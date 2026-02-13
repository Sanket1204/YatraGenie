import json
from typing import List, Tuple
from sqlalchemy.orm import Session
from .. import models, schemas

from copy import deepcopy

def determine_budget_tier(city: models.City, budget_per_day: float) -> str:
    diff_backpacker = abs(budget_per_day - city.avg_daily_cost_backpacker)
    diff_mid = abs(budget_per_day - city.avg_daily_cost_midrange)
    diff_comfort = abs(budget_per_day - city.avg_daily_cost_comfort)

    min_diff = min(diff_backpacker, diff_mid, diff_comfort)
    if min_diff == diff_backpacker:
        return "backpacker"
    elif min_diff == diff_mid:
        return "midrange"
    else:
        return "comfort"


def pick_places_for_preferences(
    db: Session, city_id: int, preferences: List[str]
) -> List[models.Place]:
    # basic heuristic: filter by tags/ category
    q = db.query(models.Place).filter(models.Place.city_id == city_id)
    all_places = q.all()
    if not preferences:
        return all_places

    scored = []
    for p in all_places:
        score = 0
        tags = (p.tags or "").lower()
        for pref in preferences:
            if pref.lower() in tags or pref.lower() in (p.category or "").lower():
                score += 2
        scored.append((score, p))

    # sort by score desc, then by low cost
    scored.sort(key=lambda x: (-x[0], x[1].approx_visit_cost))
    return [p for s, p in scored if s > 0] or [p for _, p in scored]


def distribute_places_across_days(
    places: List[models.Place], days: int
) -> List[List[Tuple[models.Place, str]]]:
    # time slots per day: morning, afternoon, evening
    slots = ["morning", "afternoon", "evening"]
    schedule = [[] for _ in range(days)]
    if not places:
        return schedule

    required = days * len(slots)

    # Normalize candidates to a list of (unique_key, obj) so we can guarantee
    # each unique_key is assigned at most once across the whole itinerary.
    candidates = []
    seen_keys = set()
    synthetic_counter = 1

    for p in places:
        if isinstance(p, dict):
            # use the name as a key for synthetic/dict entries, ensure uniqueness
            base = p.get("name") or f"synthetic_{synthetic_counter}"
            key = base
            while key in seen_keys:
                synthetic_counter += 1
                key = f"{base}_{synthetic_counter}"
            seen_keys.add(key)
            candidates.append((key, p))
        else:
            pid = getattr(p, "id", None)
            key = f"place_{pid}" if pid is not None else f"place_{getattr(p, 'name', '')}"
            if key in seen_keys:
                continue
            seen_keys.add(key)
            candidates.append((key, p))

    # If not enough unique candidates, synthesize distinct placeholders until we can
    # fill every slot without repeating any candidate key.
    while len(candidates) < required:
        key = f"synthetic_auto_{synthetic_counter}"
        synth = {
            "id": None,
            "approx_visit_cost": 0.0,
            "name": f"Local Experience {synthetic_counter}",
        }
        synthetic_counter += 1
        seen_keys.add(key)
        candidates.append((key, synth))

    # Assign candidates sequentially across slots so each unique candidate appears only once.
    ptr = 0
    for slot in slots:
        for day in range(days):
            key, obj = candidates[ptr]
            schedule[day].append((obj, slot))
            ptr += 1

    return schedule


def generate_itinerary(db: Session, req: schemas.ItineraryRequest) -> models.Itinerary:
    city = db.query(models.City).get(req.destination_city_id)
    if not city:
        raise ValueError("Destination city not found")

    budget_per_day = req.budget_total / req.days
    budget_tier = determine_budget_tier(city, budget_per_day)

    places = pick_places_for_preferences(db, city.id, req.preferences)
    # ensure we have enough unique place-like items to fill days x slots without repeating
    slots = ["morning", "afternoon", "evening"]
    required = req.days * len(slots)

    # fetch all city places
    all_places = db.query(models.Place).filter(models.Place.city_id == city.id).all()
    # use places selected by preference first, then add remaining city places
    unique_places = []
    seen_ids = set()
    for p in places + all_places:
        pid = getattr(p, 'id', None)
        if pid is None:
            continue
        if pid in seen_ids:
            continue
        seen_ids.add(pid)
        unique_places.append(p)

    # If DB doesn't have enough unique places, synthesize gentle local experiences so items are distinct
    synthetic = []
    if len(unique_places) < required:
        need = required - len(unique_places)
        base_cost = max(50.0, (city.avg_daily_cost_midrange or 1500.0) * 0.02)
        for i in range(need):
            synth = {
                "id": None,
                "approx_visit_cost": round(base_cost * (1 + (i % 3) * 0.5), 2),
                "name": f"Local Experience {i+1}",
                "recommended_duration_hours": 1.5,
                "best_time_slot": slots[i % len(slots)],
            }
            synthetic.append(synth)

    combined_places = unique_places + synthetic
    # pass combined list (which may include dict placeholders) to distributor
    schedule = distribute_places_across_days(combined_places, req.days)

    # ensure each day has at least one or more items by filling from remaining city places (post-distribution)
    all_places = db.query(models.Place).filter(models.Place.city_id == city.id).all()
    used_ids = {p.id for p in unique_places}
    available = [p for p in all_places if p.id not in used_ids]

    # For each day, fill missing slot(s) from available places; if none remain, append a small free-time placeholder
    for day_slots in schedule:
        assigned_slot_names = [s for (_p, s) in day_slots]
        missing_slots = [s for s in slots if s not in assigned_slot_names]
        for ms in missing_slots:
            if available:
                p = available.pop(0)
                day_slots.append((p, ms))
            else:
                placeholder = {"id": None, "approx_visit_cost": 0.0, "name": "Free time / Relax"}
                day_slots.append((placeholder, ms))

    total_cost = 0.0
    days_data = []
    synthetic_id = -1
    for day_idx, day_slots in enumerate(schedule, start=1):
        items = []
        day_total = 0.0
        for place, slot in day_slots:
            if isinstance(place, dict):
                cost = place.get("approx_visit_cost", 0.0)
                place_id = place.get("id")
                if place_id is None:
                    place_id = synthetic_id
                    synthetic_id -= 1
                place_name = place.get("name", "Free time / Relax")
            else:
                cost = place.approx_visit_cost
                place_id = place.id
                place_name = place.name

            total_cost += cost
            day_total += cost
            items.append(
                {
                    "place_id": place_id,
                    "place_name": place_name,
                    "time_slot": slot,
                    "estimated_cost": cost,
                }
            )
        days_data.append({"day": day_idx, "items": items, "day_total": round(day_total, 2)})

    # accommodation estimate based on budget tier and people
    people = getattr(req, "people", 1) or 1
    if budget_tier == "backpacker":
        daily_accom = city.avg_daily_cost_backpacker
    elif budget_tier == "midrange":
        daily_accom = city.avg_daily_cost_midrange
    else:
        daily_accom = city.avg_daily_cost_comfort

    accommodation_cost = daily_accom * req.days * people
    # add food/transport surcharge as a percentage of accommodation
    surcharge = accommodation_cost * 0.15

    # compute per-day accommodation and surcharge to attach to each day
    per_day_accom = daily_accom * people
    per_day_surcharge = per_day_accom * 0.15

    # update days_data entries with breakdowns
    for d in days_data:
        place_total = d.get("day_total", 0.0) if isinstance(d.get("day_total"), (int, float)) else 0.0
        # note: when saved itinerary flow, multipliers are not applied; accommodation distributed evenly per day
        d["place_total"] = round(place_total, 2)
        d["accommodation_cost"] = round(per_day_accom, 2)
        d["surcharge"] = round(per_day_surcharge, 2)
        d["day_total"] = round(place_total + per_day_accom + per_day_surcharge, 2)

    estimated_total = total_cost + accommodation_cost + surcharge

    # evaluate budget fit against requested budget_total
    if estimated_total <= req.budget_total * 0.9:
        budget_fit = "UNDER BUDGET"
    elif estimated_total <= req.budget_total * 1.1:
        budget_fit = "CLOSE TO BUDGET"
    else:
        budget_fit = "OVER BUDGET"

    summary = (
        f"{req.days}-day {budget_tier} trip to {city.name} for a "
        f"{req.traveler_type} traveler, preferences: {', '.join(req.preferences)}."
    )

    itinerary = models.Itinerary(
        user_name=req.user_name,
        origin_city=req.origin_city,
        destination_city_id=city.id,
        days=req.days,
        budget_total=req.budget_total,
        budget_per_day=budget_per_day,
        traveler_type=req.traveler_type,
        preferences=json.dumps(req.preferences),
        estimated_total_cost=estimated_total,
        data=json.dumps(
            {
                "summary": summary,
                "budget_fit": budget_fit,
                "days": days_data,
            }
        ),
    )
    db.add(itinerary)
    db.commit()
    db.refresh(itinerary)
    return itinerary


def pick_places_for_variant(db: Session, city_id: int, preferences: List[str], variant: str) -> List[models.Place]:
    """Return a list of places tuned for a variant: 'budget', 'balanced', 'premium'."""
    all_places = db.query(models.Place).filter(models.Place.city_id == city_id).all()
    if variant == "balanced":
        return pick_places_for_preferences(db, city_id, preferences)

    # score places similarly but modify sorting for variant
    scored = []
    for p in all_places:
        score = 0
        tags = (p.tags or "").lower()
        for pref in preferences:
            if pref.lower() in tags or pref.lower() in (p.category or "").lower():
                score += 2
        scored.append((score, p))

    if variant == "budget":
        # prefer low cost, but keep some preference scoring
        scored.sort(key=lambda x: (x[1].approx_visit_cost, -x[0]))
    else:  # premium
        # prefer high score then higher cost
        scored.sort(key=lambda x: (-x[0], -x[1].approx_visit_cost))

    return [p for _, p in scored]


def generate_itinerary_preview(db: Session, req: schemas.ItineraryRequest, variant: str):
    """Generate an itinerary preview (does NOT save to DB). Returns dict with summary, days, estimated_total_cost, budget_fit."""
    city = db.query(models.City).get(req.destination_city_id)
    if not city:
        raise ValueError("Destination city not found")

    budget_per_day = req.budget_total / req.days
    budget_tier = determine_budget_tier(city, budget_per_day)

    places = pick_places_for_variant(db, city.id, req.preferences, variant)
    schedule = distribute_places_across_days(places, req.days)

    total_cost = 0.0
    days_data = []
    synthetic_id = -1
    for day_idx, day_slots in enumerate(schedule, start=1):
        items = []
        day_total = 0.0
        for place, slot in day_slots:
            if isinstance(place, dict):
                cost = place.get("approx_visit_cost", 0.0)
                place_id = place.get("id")
                if place_id is None:
                    place_id = synthetic_id
                    synthetic_id -= 1
                place_name = place.get("name", "Free time / Relax")
            else:
                cost = place.approx_visit_cost
                place_id = place.id
                place_name = place.name

            total_cost += cost
            day_total += cost
            items.append({
                "place_id": place_id,
                "place_name": place_name,
                "time_slot": slot,
                "estimated_cost": cost,
            })
        days_data.append({"day": day_idx, "items": items, "day_total": round(day_total, 2)})

    # accommodation estimate and variant multiplier
    people = getattr(req, "people", 1) or 1
    if budget_tier == "backpacker":
        daily_accom = city.avg_daily_cost_backpacker
    elif budget_tier == "midrange":
        daily_accom = city.avg_daily_cost_midrange
    else:
        daily_accom = city.avg_daily_cost_comfort

    # variant multipliers make budget cheaper and premium more expensive
    multipliers = {"budget": 0.7, "balanced": 1.0, "premium": 1.6}
    m = multipliers.get(variant, 1.0)

    accommodation_cost = daily_accom * req.days * people * m
    surcharge = accommodation_cost * 0.15

    # compute per-day accommodation and surcharge for this variant
    per_day_accom = daily_accom * people * m
    per_day_surcharge = per_day_accom * 0.15

    # attach breakdowns to each day entry
    for d in days_data:
        place_total = d.get("day_total", 0.0) if isinstance(d.get("day_total"), (int, float)) else 0.0
        d["place_total"] = round(place_total, 2)
        d["accommodation_cost"] = round(per_day_accom, 2)
        d["surcharge"] = round(per_day_surcharge, 2)
        d["day_total"] = round(place_total + per_day_accom + per_day_surcharge, 2)

    estimated_total = total_cost + accommodation_cost + surcharge

    if estimated_total <= req.budget_total * 0.9:
        budget_fit = "UNDER BUDGET"
    elif estimated_total <= req.budget_total * 1.1:
        budget_fit = "CLOSE TO BUDGET"
    else:
        budget_fit = "OVER BUDGET"

    summary = (
        f"{req.days}-day {budget_tier} trip to {city.name} for a "
        f"{req.traveler_type} traveler, preferences: {', '.join(req.preferences)}."
    )

    return {
        "variant": variant,
        "summary": summary,
        "budget_total": req.budget_total,
        "estimated_total_cost": estimated_total,
        "days": days_data,
        "city_name": city.name,
        "budget_fit": budget_fit,
    }

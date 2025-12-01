import json
from typing import List, Tuple
from sqlalchemy.orm import Session
from .. import models, schemas

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
    i = 0
    for place in places:
        day_idx = i // len(slots)
        if day_idx >= days:
            break
        slot_idx = i % len(slots)
        schedule[day_idx].append((place, slots[slot_idx]))
        i += 1
    return schedule


def generate_itinerary(db: Session, req: schemas.ItineraryRequest) -> models.Itinerary:
    city = db.query(models.City).get(req.destination_city_id)
    if not city:
        raise ValueError("Destination city not found")

    budget_per_day = req.budget_total / req.days
    budget_tier = determine_budget_tier(city, budget_per_day)

    places = pick_places_for_preferences(db, city.id, req.preferences)
    schedule = distribute_places_across_days(places, req.days)

    total_cost = 0.0
    days_data = []

    for day_idx, day_slots in enumerate(schedule, start=1):
        items = []
        for place, slot in day_slots:
            cost = place.approx_visit_cost
            total_cost += cost
            items.append(
                {
                    "place_id": place.id,
                    "place_name": place.name,
                    "time_slot": slot,
                    "estimated_cost": cost,
                }
            )
        days_data.append({"day": day_idx, "items": items})

    # evaluate budget fit
    if total_cost <= req.budget_total * 0.9:
        budget_fit = "UNDER BUDGET"
    elif total_cost <= req.budget_total * 1.1:
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
        estimated_total_cost=total_cost,
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

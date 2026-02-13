from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from .. import schemas, models
from ..deps import get_db
from ..services.itinerary_generator import generate_itinerary
from ..services.itinerary_generator import generate_itinerary_preview
from ..schemas import ItineraryOptionsResponse

router = APIRouter(prefix="/api/itineraries", tags=["itineraries"])

@router.post("/", response_model=schemas.ItineraryResponse)
def create_itinerary(req: schemas.ItineraryRequest, db: Session = Depends(get_db)):
    print(f"DEBUG: Received request: {req}")
    print(f"DEBUG: destination_city_id type: {type(req.destination_city_id)}, value: {req.destination_city_id}")
    print(f"DEBUG: days type: {type(req.days)}, value: {req.days}")
    print(f"DEBUG: budget_total type: {type(req.budget_total)}, value: {req.budget_total}")
    
    # Ensure destination_city_id is an integer
    if isinstance(req.destination_city_id, str):
        try:
            req.destination_city_id = int(req.destination_city_id)
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid destination_city_id")
    
    try:
        itin = generate_itinerary(db, req)
    except ValueError as e:
        print(f"DEBUG: ValueError in generate_itinerary: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        print(f"DEBUG: Exception in generate_itinerary: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

    city_name = itin.destination_city.name
    data = json.loads(itin.data)
    return schemas.ItineraryResponse(
        id=itin.id,
        summary=data["summary"],
        budget_total=itin.budget_total,
        estimated_total_cost=itin.estimated_total_cost,
        days=data["days"],
        city_name=city_name,
        budget_fit=data["budget_fit"],
    )


@router.post("/options", response_model=ItineraryOptionsResponse)
def get_itinerary_options(req: schemas.ItineraryRequest, db: Session = Depends(get_db)):
    # produce a few variants for users to choose from
    try:
        opts = []
        for variant in ["budget", "balanced", "premium"]:
            preview = generate_itinerary_preview(db, req, variant)
            opts.append(preview)
        return ItineraryOptionsResponse(options=opts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{itinerary_id}", response_model=schemas.ItineraryResponse)
def get_itinerary(itinerary_id: int, db: Session = Depends(get_db)):
    itin = db.query(models.Itinerary).get(itinerary_id)
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    data = json.loads(itin.data)
    return schemas.ItineraryResponse(
        id=itin.id,
        summary=data["summary"],
        budget_total=itin.budget_total,
        estimated_total_cost=itin.estimated_total_cost,
        days=data["days"],
        city_name=itin.destination_city.name,
        budget_fit=data["budget_fit"],
    )

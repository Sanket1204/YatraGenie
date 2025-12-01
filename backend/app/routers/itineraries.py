from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from .. import schemas, models
from ..deps import get_db
from ..services.itinerary_generator import generate_itinerary

router = APIRouter(prefix="/api/itineraries", tags=["itineraries"])

@router.post("/", response_model=schemas.ItineraryResponse)
def create_itinerary(req: schemas.ItineraryRequest, db: Session = Depends(get_db)):
    try:
        itin = generate_itinerary(db, req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    
    # Auto-detect if frontend accidentally sent a city name instead of ID
    if isinstance(req.destination_city_id, str):
         city = db.query(models.City).filter(
        models.City.name.ilike(req.destination_city_id)
    ).first()

    if not city:
        raise HTTPException(400, detail="Destination city not found")

    req.destination_city_id = city.id


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

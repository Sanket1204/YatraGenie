from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas
from ..deps import get_db

router = APIRouter(prefix="/api/places", tags=["places"])

@router.get("/search", response_model=List[schemas.PlaceBase])
def search_places(
    city_id: Optional[int] = Query(None),
    query: Optional[str] = Query(None),
    max_cost: Optional[float] = Query(None),
    categories: Optional[str] = Query(None, description="Comma separated categories"),
    tags: Optional[str] = Query(None, description="Comma separated tags"),
    db: Session = Depends(get_db),
):
    q = db.query(models.Place)

    if city_id:
        q = q.filter(models.Place.city_id == city_id)

    if query:
        like = f"%{query.lower()}%"
        q = q.filter(models.Place.name.ilike(like) | models.Place.description.ilike(like))

    if max_cost is not None:
        q = q.filter(models.Place.approx_visit_cost <= max_cost)

    if categories:
        cat_list = [c.strip().lower() for c in categories.split(",")]
        q = q.filter(models.Place.category.in_(cat_list))

    if tags:
        tag_list = [t.strip().lower() for t in tags.split(",")]
        # simple tag matching: tags column contains any desired tag
        tag_filters = []
        for t in tag_list:
            tag_filters.append(models.Place.tags.ilike(f"%{t}%"))
        from sqlalchemy import or_
        q = q.filter(or_(*tag_filters))

    return q.limit(50).all()

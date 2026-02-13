from pydantic import BaseModel
from typing import List, Optional, Literal, Dict, Any

class PlaceBase(BaseModel):
    id: int
    name: str
    city_id: int
    category: Optional[str]
    tags: Optional[str]
    approx_visit_cost: float
    recommended_duration_hours: float
    best_time_slot: str
    description: Optional[str]

    class Config:
        orm_mode = True


class PlaceSearchQuery(BaseModel):
    city_id: Optional[int] = None
    query: Optional[str] = None
    max_cost: Optional[float] = None
    categories: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class ItineraryRequest(BaseModel):
    user_name: Optional[str] = None
    origin_city: str
    destination_city_id: int
    days: int
    people: int = 1
    budget_total: float
    traveler_type: Literal["solo", "couple", "family", "friends"]
    preferences: List[str]  # e.g. ["beach","nature","heritage"]


class ItineraryDayItem(BaseModel):
    place_id: int
    place_name: str
    time_slot: str  # morning/afternoon/evening
    estimated_cost: float


class ItineraryDay(BaseModel):
    day: int
    items: List[ItineraryDayItem]
    place_total: float = 0.0
    accommodation_cost: float = 0.0
    surcharge: float = 0.0
    day_total: float = 0.0


class ItineraryResponse(BaseModel):
    id: int
    summary: str
    budget_total: float
    estimated_total_cost: float
    days: List[ItineraryDay]
    city_name: str
    budget_fit: str  # "UNDER BUDGET", "CLOSE TO BUDGET", "OVER BUDGET"

    class Config:
        orm_mode = True


class ItineraryOption(BaseModel):
    variant: str
    summary: str
    budget_total: float
    estimated_total_cost: float
    days: List[ItineraryDay]
    city_name: str
    budget_fit: str


class ItineraryOptionsResponse(BaseModel):
    options: List[ItineraryOption]

    class Config:
        orm_mode = True

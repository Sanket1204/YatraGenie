from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    state = Column(String, nullable=False)
    country = Column(String, default="India")
    avg_daily_cost_backpacker = Column(Float, nullable=False)
    avg_daily_cost_midrange = Column(Float, nullable=False)
    avg_daily_cost_comfort = Column(Float, nullable=False)

    places = relationship("Place", back_populates="city")
    itineraries = relationship("Itinerary", back_populates="destination_city")


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"))
    category = Column(String, index=True)
    tags = Column(String)  # e.g. "beach, sunset, nightlife"
    approx_visit_cost = Column(Float, default=0.0)
    recommended_duration_hours = Column(Float, default=2.0)
    best_time_slot = Column(String, default="any")
    description = Column(Text)

    city = relationship("City", back_populates="places")


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=True)
    origin_city = Column(String, nullable=False)
    destination_city_id = Column(Integer, ForeignKey("cities.id"))
    days = Column(Integer, nullable=False)
    budget_total = Column(Float, nullable=False)
    budget_per_day = Column(Float, nullable=False)
    traveler_type = Column(String, nullable=False)
    preferences = Column(Text)  # store JSON as string
    estimated_total_cost = Column(Float, nullable=False)
    data = Column(Text)  # full itinerary JSON as string

    destination_city = relationship("City", back_populates="itineraries")

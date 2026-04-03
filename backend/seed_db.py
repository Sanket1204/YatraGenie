import sys
sys.path.insert(0, '.')

from app.database import SessionLocal, Base, engine
from app import models

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Seed cities
cities_data = [
    {
        "name": "Goa",
        "state": "Goa",
        "country": "India",
        "avg_daily_cost_backpacker": 800,
        "avg_daily_cost_midrange": 1500,
        "avg_daily_cost_comfort": 2500,
    },
    {
        "name": "Jaipur",
        "state": "Rajasthan",
        "country": "India",
        "avg_daily_cost_backpacker": 600,
        "avg_daily_cost_midrange": 1200,
        "avg_daily_cost_comfort": 2200,
    },
    {
        "name": "Kerala",
        "state": "Kerala",
        "country": "India",
        "avg_daily_cost_backpacker": 700,
        "avg_daily_cost_midrange": 1400,
        "avg_daily_cost_comfort": 2300,
    },
]

for city_data in cities_data:
    city = models.City(**city_data)
    db.add(city)

db.commit()

# Seed places
places_data = [
    # Goa places
    {
        "name": "Baga Beach",
        "city_id": 1,
        "category": "beach",
        "tags": "beach, water sports, sunset",
        "approx_visit_cost": 500,
        "recommended_duration_hours": 4,
        "best_time_slot": "afternoon",
        "description": "Popular beach with water sports",
    },
    {
        "name": "Fort Aguada",
        "city_id": 1,
        "category": "heritage",
        "tags": "heritage, fort, history",
        "approx_visit_cost": 300,
        "recommended_duration_hours": 2,
        "best_time_slot": "morning",
        "description": "17th-century Portuguese fort",
    },
    {
        "name": "Dudhsagar Waterfall",
        "city_id": 1,
        "category": "nature",
        "tags": "nature, waterfall, trekking",
        "approx_visit_cost": 800,
        "recommended_duration_hours": 6,
        "best_time_slot": "morning",
        "description": "Majestic four-tiered waterfall",
    },
    # Jaipur places
    {
        "name": "City Palace",
        "city_id": 2,
        "category": "heritage",
        "tags": "heritage, palace, architecture",
        "approx_visit_cost": 300,
        "recommended_duration_hours": 2,
        "best_time_slot": "morning",
        "description": "Royal palace blending Rajasthani and European architecture",
    },
    {
        "name": "Hawa Mahal",
        "city_id": 2,
        "category": "heritage",
        "tags": "heritage, monument, photography",
        "approx_visit_cost": 200,
        "recommended_duration_hours": 1,
        "best_time_slot": "morning",
        "description": "The iconic 'Palace of Winds'",
    },
    {
        "name": "Albert Hall Museum",
        "city_id": 2,
        "category": "museum",
        "tags": "museum, history, culture",
        "approx_visit_cost": 250,
        "recommended_duration_hours": 3,
        "best_time_slot": "afternoon",
        "description": "Museum showcasing Rajasthani art and culture",
    },
    # Kerala places
    {
        "name": "Alleppey Backwaters",
        "city_id": 3,
        "category": "nature",
        "tags": "backwaters, nature, houseboat",
        "approx_visit_cost": 1200,
        "recommended_duration_hours": 8,
        "best_time_slot": "morning",
        "description": "Scenic backwaters perfect for houseboat tours",
    },
    {
        "name": "Kochi Fort",
        "city_id": 3,
        "category": "heritage",
        "tags": "heritage, fort, history",
        "approx_visit_cost": 400,
        "recommended_duration_hours": 2,
        "best_time_slot": "afternoon",
        "description": "Historic fort built by the Portuguese",
    },
    {
        "name": "Munnar Tea Gardens",
        "city_id": 3,
        "category": "nature",
        "tags": "nature, tea, hills",
        "approx_visit_cost": 600,
        "recommended_duration_hours": 4,
        "best_time_slot": "morning",
        "description": "Lush green tea plantations in the Western Ghats",
    },
]

for place_data in places_data:
    place = models.Place(**place_data)
    db.add(place)

db.commit()
print("Database seeded successfully!")
db.close()

import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from app.database import SessionLocal, Base, engine
from app import models

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Representative seed data covering many states and UTs
cities_data = [
    # Maharashtra
    {"name": "Mumbai", "state": "Maharashtra", "avg_daily_cost_backpacker": 1200, "avg_daily_cost_midrange": 2200, "avg_daily_cost_comfort": 4000},
    {"name": "Pune", "state": "Maharashtra", "avg_daily_cost_backpacker": 900, "avg_daily_cost_midrange": 1600, "avg_daily_cost_comfort": 3000},
    # Goa
    {"name": "Goa", "state": "Goa", "avg_daily_cost_backpacker": 800, "avg_daily_cost_midrange": 1500, "avg_daily_cost_comfort": 2500},
    # Kerala
    {"name": "Kochi", "state": "Kerala", "avg_daily_cost_backpacker": 700, "avg_daily_cost_midrange": 1400, "avg_daily_cost_comfort": 2300},
    {"name": "Munnar", "state": "Kerala", "avg_daily_cost_backpacker": 650, "avg_daily_cost_midrange": 1300, "avg_daily_cost_comfort": 2100},
    # Rajasthan
    {"name": "Jaipur", "state": "Rajasthan", "avg_daily_cost_backpacker": 600, "avg_daily_cost_midrange": 1200, "avg_daily_cost_comfort": 2200},
    {"name": "Udaipur", "state": "Rajasthan", "avg_daily_cost_backpacker": 700, "avg_daily_cost_midrange": 1400, "avg_daily_cost_comfort": 2600},
    # Karnataka
    {"name": "Bengaluru", "state": "Karnataka", "avg_daily_cost_backpacker": 1000, "avg_daily_cost_midrange": 1800, "avg_daily_cost_comfort": 3200},
    {"name": "Mysuru", "state": "Karnataka", "avg_daily_cost_backpacker": 700, "avg_daily_cost_midrange": 1300, "avg_daily_cost_comfort": 2400},
    # Tamil Nadu
    {"name": "Chennai", "state": "Tamil Nadu", "avg_daily_cost_backpacker": 900, "avg_daily_cost_midrange": 1700, "avg_daily_cost_comfort": 3000},
    {"name": "Mahabalipuram", "state": "Tamil Nadu", "avg_daily_cost_backpacker": 600, "avg_daily_cost_midrange": 1100, "avg_daily_cost_comfort": 2000},
    # Uttar Pradesh
    {"name": "Agra", "state": "Uttar Pradesh", "avg_daily_cost_backpacker": 500, "avg_daily_cost_midrange": 1000, "avg_daily_cost_comfort": 1800},
    {"name": "Varanasi", "state": "Uttar Pradesh", "avg_daily_cost_backpacker": 500, "avg_daily_cost_midrange": 1000, "avg_daily_cost_comfort": 1800},
    # West Bengal
    {"name": "Kolkata", "state": "West Bengal", "avg_daily_cost_backpacker": 700, "avg_daily_cost_midrange": 1300, "avg_daily_cost_comfort": 2400},
    # Delhi (UT)
    {"name": "New Delhi", "state": "Delhi", "avg_daily_cost_backpacker": 1000, "avg_daily_cost_midrange": 1800, "avg_daily_cost_comfort": 3500},
    # Gujarat
    {"name": "Ahmedabad", "state": "Gujarat", "avg_daily_cost_backpacker": 600, "avg_daily_cost_midrange": 1100, "avg_daily_cost_comfort": 2100},
    {"name": "Gir", "state": "Gujarat", "avg_daily_cost_backpacker": 800, "avg_daily_cost_midrange": 1500, "avg_daily_cost_comfort": 2600},
    # Odisha
    {"name": "Puri", "state": "Odisha", "avg_daily_cost_backpacker": 500, "avg_daily_cost_midrange": 900, "avg_daily_cost_comfort": 1700},
    # Assam
    {"name": "Guwahati", "state": "Assam", "avg_daily_cost_backpacker": 600, "avg_daily_cost_midrange": 1100, "avg_daily_cost_comfort": 2000},
    # Himachal
    {"name": "Shimla", "state": "Himachal Pradesh", "avg_daily_cost_backpacker": 700, "avg_daily_cost_midrange": 1300, "avg_daily_cost_comfort": 2500},
    {"name": "Manali", "state": "Himachal Pradesh", "avg_daily_cost_backpacker": 800, "avg_daily_cost_midrange": 1500, "avg_daily_cost_comfort": 2700},
    # Jammu & Kashmir
    {"name": "Srinagar", "state": "Jammu & Kashmir", "avg_daily_cost_backpacker": 900, "avg_daily_cost_midrange": 1600, "avg_daily_cost_comfort": 3000},
    # Punjab
    {"name": "Amritsar", "state": "Punjab", "avg_daily_cost_backpacker": 600, "avg_daily_cost_midrange": 1100, "avg_daily_cost_comfort": 2000},
]

# Add cities
for c in cities_data:
    city = models.City(
        name=c['name'],
        state=c.get('state',''),
        country='India',
        avg_daily_cost_backpacker=c.get('avg_daily_cost_backpacker',800),
        avg_daily_cost_midrange=c.get('avg_daily_cost_midrange',1500),
        avg_daily_cost_comfort=c.get('avg_daily_cost_comfort',2500),
    )
    db.add(city)

db.commit()

# Prepare places sample for each city
places_demo = {
    'Mumbai': [
        {"name": "Gateway of India", "category": "heritage", "tags": "heritage,monument,photography", "approx_visit_cost": 100.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Iconic monument by the Arabian Sea."},
        {"name": "Marine Drive", "category": "viewpoint", "tags": "sunset,drive,romantic", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "evening", "description": "Scenic promenade along the coast."},
    ],
    'Pune': [
        {"name": "Shaniwar Wada", "category": "heritage", "tags": "fort,history,architecture", "approx_visit_cost": 50.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Historic fort of the Maratha empire."},
    ],
    'Goa': [
        {"name": "Baga Beach", "category": "beach", "tags": "beach,water sports,party", "approx_visit_cost": 500.0, "recommended_duration_hours": 4.0, "best_time_slot": "afternoon", "description": "Popular beach with lively nightlife."},
        {"name": "Dudhsagar Waterfall", "category": "nature", "tags": "waterfall,trekking,nature", "approx_visit_cost": 800.0, "recommended_duration_hours": 6.0, "best_time_slot": "morning", "description": "Spectacular multi-tiered waterfall."},
    ],
    'Kochi': [
        {"name": "Fort Kochi", "category": "heritage", "tags": "heritage,colonial,art", "approx_visit_cost": 100.0, "recommended_duration_hours": 2.0, "best_time_slot": "afternoon", "description": "Historic colonial area with Chinese fishing nets."},
    ],
    'Munnar': [
        {"name": "Tea Gardens", "category": "nature", "tags": "tea,hills,nature", "approx_visit_cost": 200.0, "recommended_duration_hours": 3.0, "best_time_slot": "morning", "description": "Lush tea plantations and viewpoints."},
    ],
    'Jaipur': [
        {"name": "Hawa Mahal", "category": "heritage", "tags": "heritage,monument,architecture", "approx_visit_cost": 150.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Iconic palace of winds."},
        {"name": "Amber Fort", "category": "heritage", "tags": "fort,history,views", "approx_visit_cost": 300.0, "recommended_duration_hours": 3.0, "best_time_slot": "morning", "description": "Hilltop fort with palace complex."},
    ],
    'Udaipur': [
        {"name": "City Palace", "category": "heritage", "tags": "palace,lake,architecture", "approx_visit_cost": 200.0, "recommended_duration_hours": 2.5, "best_time_slot": "afternoon", "description": "Royal palace complex overlooking Lake Pichola."},
    ],
    'Bengaluru': [
        {"name": "Lalbagh Botanical Garden", "category": "nature", "tags": "garden,botanical,relax", "approx_visit_cost": 50.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Large botanical garden with glasshouse."},
    ],
    'Mysuru': [
        {"name": "Mysore Palace", "category": "heritage", "tags": "palace,heritage,architecture", "approx_visit_cost": 150.0, "recommended_duration_hours": 2.0, "best_time_slot": "evening", "description": "Famous illuminated palace in Mysore."},
    ],
    'Chennai': [
        {"name": "Marina Beach", "category": "beach", "tags": "beach,walk,views", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "evening", "description": "One of the longest urban beaches in the world."},
    ],
    'Mahabalipuram': [
        {"name": "Shore Temple", "category": "heritage", "tags": "temple,heritage,beach", "approx_visit_cost": 100.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Ancient rock-cut temple by the sea."},
    ],
    'Agra': [
        {"name": "Taj Mahal", "category": "heritage", "tags": "monument,heritage,photography", "approx_visit_cost": 1100.0, "recommended_duration_hours": 3.0, "best_time_slot": "morning", "description": "World Heritage monument and symbol of love."},
    ],
    'Varanasi': [
        {"name": "Ganga Ghats", "category": "cultural", "tags": "ganges,rituals,spiritual", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Ancient riverfront steps with rituals and boat rides."},
    ],
    'Kolkata': [
        {"name": "Victoria Memorial", "category": "museum", "tags": "museum,history,architecture", "approx_visit_cost": 100.0, "recommended_duration_hours": 2.0, "best_time_slot": "afternoon", "description": "Large marble monument and museum."},
    ],
    'New Delhi': [
        {"name": "Qutub Minar", "category": "heritage", "tags": "monument,heritage,history", "approx_visit_cost": 300.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Tall minaret and UNESCO site."},
        {"name": "India Gate", "category": "memorial", "tags": "memorial,park,evening", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "evening", "description": "National war memorial and popular evening spot."},
    ],
    'Ahmedabad': [
        {"name": "Sabarmati Ashram", "category": "heritage", "tags": "ashram,history,gandhi", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Residence of Mahatma Gandhi turned museum."},
    ],
    'Gir': [
        {"name": "Gir National Park", "category": "wildlife", "tags": "wildlife,safari,lion", "approx_visit_cost": 2000.0, "recommended_duration_hours": 6.0, "best_time_slot": "morning", "description": "Home of the Asiatic lion; safari experiences."},
    ],
    'Puri': [
        {"name": "Jagannath Temple", "category": "religious", "tags": "temple,religious,festival", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Sacred Hindu temple and pilgrimage site."},
    ],
    'Guwahati': [
        {"name": "Kamakhya Temple", "category": "religious", "tags": "temple,spiritual,views", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Important Shakti Peeth with hilltop views."},
    ],
    'Shimla': [
        {"name": "Mall Road", "category": "shopping", "tags": "shopping,walk,views", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "evening", "description": "Main pedestrian street with shops and cafés."},
    ],
    'Manali': [
        {"name": "Solang Valley", "category": "adventure", "tags": "paragliding,skiing,adventure", "approx_visit_cost": 1200.0, "recommended_duration_hours": 4.0, "best_time_slot": "afternoon", "description": "Adventure sports hub with scenic views."},
    ],
    'Srinagar': [
        {"name": "Dal Lake", "category": "nature", "tags": "houseboat,boat,nature", "approx_visit_cost": 1500.0, "recommended_duration_hours": 4.0, "best_time_slot": "morning", "description": "Famous lake with houseboat stays and shikaras."},
    ],
    'Amritsar': [
        {"name": "Golden Temple", "category": "religious", "tags": "temple,spiritual,history", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "evening", "description": "Harmandir Sahib, central Sikh shrine."},
    ],
}

# Insert places linked to created cities
all_cities = db.query(models.City).all()
city_map = {c.name: c.id for c in all_cities}

for city_name, places in places_demo.items():
    city_id = city_map.get(city_name)
    if not city_id:
        continue
    for p in places:
        place = models.Place(
            name=p['name'],
            city_id=city_id,
            category=p.get('category'),
            tags=p.get('tags'),
            approx_visit_cost=p.get('approx_visit_cost',0.0),
            recommended_duration_hours=p.get('recommended_duration_hours',2.0),
            best_time_slot=p.get('best_time_slot','any'),
            description=p.get('description',''),
        )
        db.add(place)

db.commit()
print("Full database seeded (representative destinations).")
db.close()

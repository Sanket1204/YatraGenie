import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from app.database import SessionLocal, Base, engine
from app import models

# This script adds additional places for cities that had few entries.

db = SessionLocal()
extra_places = {
    'Pune': [
        {"name": "Aga Khan Palace", "category": "heritage", "tags": "history,gandhi,museum", "approx_visit_cost": 80.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "Important site in India's freedom movement."},
        {"name": "Sinhagad Fort", "category": "adventure", "tags": "fort,trek,views", "approx_visit_cost": 120.0, "recommended_duration_hours": 4.0, "best_time_slot": "morning", "description": "Popular trek and historic fort with panoramic views."},
        {"name": "Parvati Hill & Temple", "category": "viewpoint", "tags": "hill,views,temple", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Hilltop temple with city views."},
        {"name": "Dagdu Seth Halwai Ganpati", "category": "religious", "tags": "temple,culture,local", "approx_visit_cost": 10.0, "recommended_duration_hours": 0.5, "best_time_slot": "evening", "description": "Popular Ganpati temple in Pune."},
    ],
    'Mumbai': [
        {"name": "Elephanta Caves", "category": "heritage", "tags": "caves,unesco,boat", "approx_visit_cost": 250.0, "recommended_duration_hours": 3.0, "best_time_slot": "morning", "description": "Rock-cut cave temples on Elephanta island."},
        {"name": "Colaba Causeway", "category": "market", "tags": "shopping,streetfood,local", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "afternoon", "description": "Popular shopping street with stalls and cafés."},
        {"name": "Chhatrapati Shivaji Terminus", "category": "heritage", "tags": "station,architecture,unesco", "approx_visit_cost": 0.0, "recommended_duration_hours": 0.5, "best_time_slot": "afternoon", "description": "Historic railway station and UNESCO site."},
    ],
    'Bengaluru': [
        {"name": "Bangalore Palace", "category": "heritage", "tags": "palace,architecture,history", "approx_visit_cost": 200.0, "recommended_duration_hours": 2.0, "best_time_slot": "afternoon", "description": "Grand palace with Tudor-style architecture."},
        {"name": "Cubbon Park", "category": "park", "tags": "park,green,relax", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Central park popular for walks and picnics."},
    ],
    'Mysuru': [
        {"name": "Chamundi Hill", "category": "religious", "tags": "hill,temple,views", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Hilltop temple with panoramic views."},
        {"name": "Brindavan Gardens", "category": "garden", "tags": "gardens,lightshow,romantic", "approx_visit_cost": 80.0, "recommended_duration_hours": 2.5, "best_time_slot": "evening", "description": "Musical fountain and terrace gardens."},
    ],
    'Kochi': [
        {"name": "Mattancherry Palace", "category": "heritage", "tags": "museum,history,art", "approx_visit_cost": 60.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Portuguese palace with murals and exhibits."},
        {"name": "Jew Town", "category": "market", "tags": "antique,shopping,food", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "Quaint lane with shops and spice markets."},
    ],
    'Munnar': [
        {"name": "Eravikulam National Park", "category": "nature", "tags": "wildlife,trek,nature", "approx_visit_cost": 300.0, "recommended_duration_hours": 4.0, "best_time_slot": "morning", "description": "Protected area known for Nilgiri tahr and scenic trails."},
        {"name": "Mattupetty Dam", "category": "nature", "tags": "lake,boating,views", "approx_visit_cost": 150.0, "recommended_duration_hours": 2.0, "best_time_slot": "afternoon", "description": "Pleasant lake with boating options and views."},
    ],
    'Goa': [
        {"name": "Calangute Beach", "category": "beach", "tags": "beach,water sports,shopping", "approx_visit_cost": 400.0, "recommended_duration_hours": 4.0, "best_time_slot": "afternoon", "description": "One of Goa's busiest beaches with shacks and activities."},
        {"name": "Anjuna Beach & Flea Market", "category": "beach,market", "tags": "beach,market,party", "approx_visit_cost": 350.0, "recommended_duration_hours": 3.0, "best_time_slot": "afternoon", "description": "Popular beach and weekly flea market."},
        {"name": "Fort Aguada", "category": "heritage", "tags": "fort,views,history", "approx_visit_cost": 50.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Well-preserved 17th-century Portuguese fort overlooking the sea."},
        {"name": "Basilica of Bom Jesus", "category": "heritage", "tags": "church,history,unesco", "approx_visit_cost": 20.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Baroque-style basilica housing relics of St. Francis Xavier."},
        {"name": "Chapora Fort", "category": "heritage", "tags": "fort,views,photography", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "evening", "description": "Hilltop fort with panoramic views over Vagator and Chapora beach."},
    ],
    'Chennai': [
        {"name": "Kapaleeshwarar Temple", "category": "religious", "tags": "temple,heritage,architecture", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Ancient temple with Dravidian architecture."},
        {"name": "Fort St. George", "category": "museum", "tags": "museum,history,colonial", "approx_visit_cost": 80.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "Historic fort housing museum exhibits."},
        {"name": "Santhome Cathedral Basilica", "category": "heritage", "tags": "church,architecture", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "afternoon", "description": "Neo-Gothic cathedral built over the tomb of St. Thomas."},
    ],
    'New Delhi': [
        {"name": "Humayun's Tomb", "category": "heritage", "tags": "tomb,heritage,architecture", "approx_visit_cost": 250.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Precursor to the Taj Mahal with beautiful gardens."},
        {"name": "Red Fort", "category": "heritage", "tags": "fort,history,architecture", "approx_visit_cost": 300.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Historic fort and major landmark in Old Delhi."},
    ],
    'Jaipur': [
        {"name": "City Palace", "category": "heritage", "tags": "palace,museum,architecture", "approx_visit_cost": 250.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "Royal residence with museums and courtyards."},
        {"name": "Jantar Mantar", "category": "heritage", "tags": "astronomy,architecture,unesco", "approx_visit_cost": 100.0, "recommended_duration_hours": 1.0, "best_time_slot": "afternoon", "description": "Collection of astronomical instruments built by Maharaja Jai Singh II."},
        {"name": "Nahargarh Fort", "category": "heritage", "tags": "fort,views,trek", "approx_visit_cost": 80.0, "recommended_duration_hours": 2.0, "best_time_slot": "evening", "description": "Hilltop fort offering sunset views over Jaipur."},
        {"name": "Jaigarh Fort", "category": "heritage", "tags": "fort,cannon,history", "approx_visit_cost": 120.0, "recommended_duration_hours": 2.5, "best_time_slot": "morning", "description": "Fort known for its massive cannon and ramparts."},
        {"name": "Albert Hall Museum", "category": "museum", "tags": "museum,history,art", "approx_visit_cost": 60.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "State museum with a large collection of artifacts."},
        {"name": "Hawa Mahal", "category": "heritage", "tags": "palace,architecture,photography", "approx_visit_cost": 150.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Iconic 'Palace of Winds' with intricate latticework."},
        {"name": "Jal Mahal", "category": "viewpoint", "tags": "lake,photography,architecture", "approx_visit_cost": 0.0, "recommended_duration_hours": 0.5, "best_time_slot": "evening", "description": "Picturesque palace set in the middle of Man Sagar Lake."},
        {"name": "Chowki Dhani (Rajasthani Village)", "category": "experience", "tags": "culture,food,show", "approx_visit_cost": 700.0, "recommended_duration_hours": 3.0, "best_time_slot": "evening", "description": "Cultural village with food, folk performances and crafts."},
        {"name": "Johari Bazaar", "category": "market", "tags": "shopping,jewellery,textiles", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "Famous market for jewellery, textiles and handicrafts."},
        {"name": "Bapu Bazaar", "category": "market", "tags": "shopping,streetfood,local", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "Local market popular for clothing and souvenirs."},
        {"name": "Galtaji (Monkey Temple)", "category": "religious", "tags": "temple,monkeys,heritage", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Ancient Hindu pilgrimage site set in a mountain oasis."},
        {"name": "Sisodia Rani Garden", "category": "garden", "tags": "garden,relax,royal", "approx_visit_cost": 20.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Terraced garden with fountains and pavilions."},
    ],
    'Udaipur': [
        {"name": "Lake Pichola Boat Ride", "category": "experience", "tags": "boat,lake,romantic", "approx_visit_cost": 300.0, "recommended_duration_hours": 1.0, "best_time_slot": "evening", "description": "Scenic boat rides around Lake Pichola and islands."},
    ],
    'Agra': [
        {"name": "Agra Fort", "category": "heritage", "tags": "fort,history,architecture", "approx_visit_cost": 200.0, "recommended_duration_hours": 2.0, "best_time_slot": "morning", "description": "UNESCO fort with palaces and museums."},
    ],
    'Varanasi': [
        {"name": "Assi Ghat", "category": "cultural", "tags": "ghat,local,spiritual", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "evening", "description": "Popular ghat known for morning yoga and evening aartis."},
    ],
    'Kolkata': [
        {"name": "Howrah Bridge", "category": "landmark", "tags": "bridge,landmark,photography", "approx_visit_cost": 0.0, "recommended_duration_hours": 0.5, "best_time_slot": "evening", "description": "Iconic cantilever bridge over the Hooghly River."},
    ],
    'Ahmedabad': [
        {"name": "Adalaj Stepwell", "category": "heritage", "tags": "stepwell,architecture,history", "approx_visit_cost": 30.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Intricate stepwell with carved motifs."},
    ],
    'Puri': [
        {"name": "Puri Beach", "category": "beach", "tags": "beach,relax,local", "approx_visit_cost": 0.0, "recommended_duration_hours": 2.0, "best_time_slot": "afternoon", "description": "Sandy beach adjacent to the Jagannath Temple."},
    ],
    'Gir': [
        {"name": "Devaliya Safari Park", "category": "wildlife", "tags": "safari,wildlife,park", "approx_visit_cost": 1200.0, "recommended_duration_hours": 4.0, "best_time_slot": "morning", "description": "Managed wildlife park offering safe lion sightings."},
    ],
    'Guwahati': [
        {"name": "Umananda Island", "category": "nature", "tags": "island,river,views", "approx_visit_cost": 50.0, "recommended_duration_hours": 1.5, "best_time_slot": "afternoon", "description": "Small river island on the Brahmaputra with a temple."},
    ],
    'Shimla': [
        {"name": "Jakhu Temple", "category": "religious", "tags": "temple,views,hanuman", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Temple dedicated to Hanuman with hilltop views."},
    ],
    'Manali': [
        {"name": "Hadimba Temple", "category": "heritage", "tags": "temple,forest,architecture", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Ancient wooden temple surrounded by cedar forest."},
    ],
    'Srinagar': [
        {"name": "Shankaracharya Temple", "category": "heritage", "tags": "temple,views,history", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.5, "best_time_slot": "morning", "description": "Hilltop temple overlooking Srinagar and Dal Lake."},
    ],
    'Amritsar': [
        {"name": "Jallianwala Bagh", "category": "history", "tags": "memorial,history", "approx_visit_cost": 0.0, "recommended_duration_hours": 1.0, "best_time_slot": "morning", "description": "Public garden and memorial of the 1919 massacre."},
    ],
}

for city_name, places in extra_places.items():
    city = db.query(models.City).filter(models.City.name == city_name).first()
    if not city:
        print(f"City not found: {city_name}")
        continue
    existing = {p.name for p in city.places}
    for p in places:
        if p['name'] in existing:
            continue
        place = models.Place(
            name=p['name'],
            city_id=city.id,
            category=p.get('category'),
            tags=p.get('tags'),
            approx_visit_cost=p.get('approx_visit_cost',0.0),
            recommended_duration_hours=p.get('recommended_duration_hours',2.0),
            best_time_slot=p.get('best_time_slot','any'),
            description=p.get('description',''),
        )
        db.add(place)

db.commit()
print("Additional places seeded.")
db.close()

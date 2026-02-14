from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import places, itineraries, health
from .routers import payments
from . import model as models
from .routers import auth



# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YatraGenie API",
    description="Budget-friendly itinerary generator for travel in India",
    version="1.0.0",
)

origins = [
    "http://Alocalhost:5173",  # Vite dev server
    "http://localhost:5174",  # Vite dev server (fallback port)
    "http://localhost:3000",
    # add your deployed frontend URLs here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(places.router)
app.include_router(itineraries.router)
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(payments.router)

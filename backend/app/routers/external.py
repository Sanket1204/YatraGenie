from fastapi import APIRouter, HTTPException, Query
import requests
import json
import logging

# Hardcoding API key for now per the implementation plan. 
# In production, this should come from environment variables.
SERPAPI_KEY = "5a2ec6403820e3bbf5ad80c94ad6baa814359fd20f51813f22c325201e8820e0"

router = APIRouter(prefix="/api/external", tags=["external"])
logger = logging.getLogger(__name__)

@router.get("/search")
def search_external_places(
    query: str = Query(..., description="The search query (e.g. 'hotels in Goa')"),
    engine: str = Query("google_local", description="SerpApi engine to use")
):
    """
    Search for places/hotels using SerpApi.
    """
    try:
        url = "https://serpapi.com/search"
        params = {
            "engine": engine,
            "q": query,
            "api_key": SERPAPI_KEY,
            "gl": "in", # Country to search from (India)
            "hl": "en"  # Language (English)
        }
        
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        # Parse common google_local results
        results = []
        if "local_results" in data:
            for item in data["local_results"]:
                results.append({
                    "id": item.get("place_id") or str(hash(item.get("title"))),
                    "name": item.get("title", "Unknown"),
                    "category": item.get("type", "Place"),
                    "rating": item.get("rating", 0.0),
                    "reviews": item.get("reviews", 0),
                    "address": item.get("address", ""),
                    "thumbnail": item.get("thumbnail", ""),
                    "description": item.get("description", "")
                })
        
        return results

    except requests.exceptions.RequestException as e:
        logger.error(f"Error calling SerpApi: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch external results")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

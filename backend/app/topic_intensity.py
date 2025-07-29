from fastapi import APIRouter, Query
from typing import Optional, List
from .database import collection
from collections import defaultdict

router = APIRouter()

@router.get("/topic-intensity")
def topic_intensity(
    end_year: Optional[str] = None,
    topic: Optional[str] = None,
    sector: Optional[str] = None,
    region: Optional[str] = None,
    pestle: Optional[str] = None,
    source: Optional[str] = None,
    swot: Optional[str] = None,
    country: Optional[str] = None,
    city: Optional[str] = None,
):
    query = {}

    # Build filter dynamically
    if end_year and end_year != "All":
        query["end_year"] = end_year
    if topic and topic != "All":
        query["topic"] = topic
    if sector and sector != "All":
        query["sector"] = sector
    if region and region != "All":
        query["region"] = region
    if pestle and pestle != "All":
        query["pestle"] = pestle
    if source and source != "All":
        query["source"] = source
    if swot and swot != "All":
        query["swot"] = swot
    if country and country != "All":
        query["country"] = country
    if city and city != "All":
        query["city"] = city

    data = list(collection.find(query))
    topic_intensity_map = defaultdict(int)

    for item in data:
        topic = item.get("topic", "").strip()
        intensity = item.get("intensity", 0)

        if topic and isinstance(intensity, (int, float)):
            topic_intensity_map[topic] += intensity

    # Convert to list of dicts for frontend charting
    result = [{"topic": k, "intensity": v} for k, v in topic_intensity_map.items()]
    result.sort(key=lambda x: x["intensity"], reverse=True)

    return result

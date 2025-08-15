"""Endpoint for aggregating topic intensity."""

from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError


from .database import collection

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
    """Return total intensity per topic based on provided filters."""

    filters = {}
    for key, value in {
        "end_year": end_year,
        "topic": topic,
        "sector": sector,
        "region": region,
        "pestle": pestle,
        "source": source,
        "swot": swot,
        "country": country,
        "city": city,
    }.items():
        if value and value != "All":
            filters[key] = value

    try:
        cursor = collection.find(filters, {"_id": 0, "topic": 1, "intensity": 1})
        topic_totals = defaultdict(int)

        for item in cursor:
            key = item.get("topic", "").strip()
            topic_totals[key] += item.get("intensity", 0)

        result = [
            {"topic": k, "intensity": v} for k, v in topic_totals.items() if k
        ]
        result.sort(key=lambda x: x["intensity"], reverse=True)
        return result
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database query failed") from exc

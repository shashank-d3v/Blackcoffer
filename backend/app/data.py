from fastapi import APIRouter, Query
from typing import Optional
from .database import collection

router = APIRouter()

@router.get("/data")
def get_filtered_data(
    end_year: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    sector: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    pestle: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    swot: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    city: Optional[str] = Query(None)
):
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
        if value:
            filters[key] = value

    results = collection.find(filters, {"_id": 0})
    return list(results)

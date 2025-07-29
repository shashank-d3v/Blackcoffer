# backend/app/filters.py

from fastapi import APIRouter
from .database import collection

router = APIRouter()

@router.get("/filters")
def get_all_filters():
    fields = ["end_year", "topic", "sector", "region", "pestle", "source", "swot", "country", "city"]
    result = {}

    for field in fields:
        values = collection.distinct(field)
        # remove empty or None values
        result[field] = sorted([v for v in values if v])

    return result

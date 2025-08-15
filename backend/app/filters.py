from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError
from .database import collection

router = APIRouter()

@router.get("/filters")
def get_all_filters():
    fields = ["end_year", "topic", "sector", "region", "pestle", "source", "swot", "country", "city"]
    result = {}

    try:
        for field in fields:
            values = collection.distinct(field)
            # remove empty or None values
            result[field] = sorted([v for v in values if v])
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="Database query failed") from exc

    return result

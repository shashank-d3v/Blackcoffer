# backend/app/database.py

from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo.errors import ServerSelectionTimeoutError
from fastapi import HTTPException
import os

load_dotenv()

def get_client() -> MongoClient:
    try:
        return MongoClient(
            os.getenv("MONGO_URI"),
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000,
        )
    except ServerSelectionTimeoutError as exc:
        raise HTTPException(status_code=503, detail="Database connection failed") from exc


client = get_client()
db = client[os.getenv("MONGO_DB")]
collection = db[os.getenv("MONGO_COLLECTION")]

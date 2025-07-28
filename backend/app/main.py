from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]
collection = db[os.getenv("MONGO_COLLECTION")]

@app.get("/")
def root():
    return {"message": "API is live"}

@app.get("/api/data")
def get_data():
    results = collection.find({}, {"_id": 0})  # Exclude MongoDB internal ID
    return list(results)

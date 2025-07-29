# backend/app/main.py

from fastapi import FastAPI
from .filters import router as filters_router
from .data import router as data_router

app = FastAPI()

app.include_router(filters_router, prefix="/api")
app.include_router(data_router, prefix="/api")

@app.get("/")
def root():
    return {"msg": "API is live"}

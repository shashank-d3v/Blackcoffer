# backend/app/main.py

from fastapi import FastAPI
from .filters import router as filters_router
from .data import router as data_router
from .topic_intensity import router as topic_intensity_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(filters_router, prefix="/api")
app.include_router(data_router, prefix="/api")
app.include_router(topic_intensity_router, prefix="/api")

@app.get("/")
def root():
    return {"msg": "API is live"}

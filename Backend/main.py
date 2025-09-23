from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Movies API is running!"}
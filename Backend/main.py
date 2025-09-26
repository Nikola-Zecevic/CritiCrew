from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.database import init_db

from routers import __all__ as all_routers
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from importlib import import_module
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    yield

app = FastAPI(lifespan=lifespan)


origins = []  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module_name in all_routers:
    module = import_module(f"routers.{module_name}")
    app.include_router(module.router)

@app.get("/")
def read_root():
    return {"message": "Movies API is running!"}


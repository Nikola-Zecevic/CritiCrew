from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.database import init_db
from routers import movies  # CRUD rute
from views import movies as movies_view  # custom view rute za frontend

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

# registrujemo CRUD ruter
app.include_router(movies.router)

# registrujemo views ruter
app.include_router(movies_view.router)

@app.get("/")
def read_root():
    return {"message": "Movies API is running!"}

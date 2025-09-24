from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.database import init_db
from views import movies as movies_view
from routers import movie, review

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="CritiCrew Movies API",
    description="API for movie reviews and ratings",
    version="1.0.0",
    lifespan=lifespan
)

# Include routers
app.include_router(movie.router)
app.include_router(movies_view.router)
app.include_router(review.router)

@app.get("/")
def read_root():
    return {"message": "🎬 CritiCrew Movies API is running!", "docs": "/docs"}

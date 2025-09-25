from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://localhost:5174",  # Add port 5174 as well
        "http://127.0.0.1:3000", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://criti-crew-dtyi.vercel.app",  # Your Vercel frontend
        "https://*.vercel.app"  # Allow all Vercel subdomains
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movie.router)
app.include_router(movies_view.router)
app.include_router(review.router)

# Test endpoint for CORS and deployment verification
@app.get("/test-cors")
def test_cors():
    return {"message": "CORS is working!", "timestamp": "2025-09-25", "status": "success"}

@app.get("/")
def read_root():
    return {"message": "🎬 CritiCrew Movies API is running!", "docs": "/docs"}

@app.get("/test-db")
def test_database():
    """Test database connection"""
    from sqlmodel import Session, select
    from models.movie import Movie
    from database.database import engine
    
    try:
        with Session(engine) as session:
            statement = select(Movie)
            movies = session.exec(statement).all()
            return {
                "status": "success", 
                "message": "✅ Database connected successfully!",
                "movies_count": len(movies),
                "sample_movie": movies[0].title if movies else "No movies in database"
            }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"❌ Database connection failed: {str(e)}"
        }

from fastapi import APIRouter, Query
from sqlmodel import Session, select
from typing import List, Optional
from database.database import engine
from models.movie import Movie
from models.genre import Genre
from models.movie_genre_link import MovieGenreLink

router = APIRouter(prefix="/movies-view", tags=["movies-view"])

# GET /movies-view/filter?genre=Action&sort=desc
@router.get("/filter", response_model=List[dict])
def filter_movies(
    genre: Optional[str] = None,
    sort: Optional[str] = "desc"  # rating asc/desc
):
    with Session(engine) as session:
        statement = select(Movie)
        movies = session.exec(statement).all()

        # filter po žanru
        if genre:
            filtered = []
            for m in movies:
                genre_ids = session.exec(select(MovieGenreLink.genre_id).where(MovieGenreLink.movie_id == m.id)).all()
                genres = session.exec(select(Genre.name).where(Genre.id.in_(genre_ids))).all()
                if genre in genres:
                    filtered.append(m)
            movies = filtered

        # TODO: dodati rating iz reviews i sortiranje
        # TODO: Izračunati prosečan rating iz reviews tabele
        # TODO: Vratiti stvarni žanr/spojiti sa MovieGenreLink
        # Za sada sortiramo po release_date kao placeholder
        movies.sort(key=lambda x: x.release_date, reverse=(sort=="desc"))

        # vratimo samo ono što frontend koristi
        return [
            {
                "title": m.title,
                "year": m.release_date.year,
                "rating": 0,  # placeholder dok ne izračunamo iz reviews
                "description": m.description,
                "genre": "Action",  # placeholder dok ne spojiš sa MovieGenreLink
                "image": m.image,
                "slug": m.title.lower().replace(" ", "-")
            }
            for m in movies
        ]

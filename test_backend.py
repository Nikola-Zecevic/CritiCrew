#!/usr/bin/env python3
"""
Simple script to test the backend review endpoints.
Run this while your FastAPI server is running.
"""

import requests
import json

# Update this to match your backend URL
BACKEND_URL = "https://criticrew-1.onrender.com"

def test_reviews_endpoint():
    """Test the reviews endpoint"""
    try:
        # Test getting all reviews
        print("Testing GET /reviews/")
        response = requests.get(f"{BACKEND_URL}/reviews/", timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Test getting reviews for a specific movie (if any exist)
        print("\nTesting GET /reviews/?movie_id=1")
        response = requests.get(f"{BACKEND_URL}/reviews/?movie_id=1", timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error testing reviews endpoint: {e}")
        return False

def test_movies_endpoint():
    """Test if we can get movies to check backend connectivity"""
    try:
        print("Testing GET /movies/")
        response = requests.get(f"{BACKEND_URL}/movies/", timeout=10)
        print(f"Status: {response.status_code}")
        movies = response.json()
        print(f"Number of movies: {len(movies) if isinstance(movies, list) else 'Not a list'}")
        if isinstance(movies, list) and len(movies) > 0:
            print(f"First movie ID: {movies[0].get('id', 'No ID field')}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error testing movies endpoint: {e}")
        return False

if __name__ == "__main__":
    print(f"Testing backend at: {BACKEND_URL}")
    print("=" * 50)
    
    # Test movies first (should work without auth)
    movies_ok = test_movies_endpoint()
    print("\n" + "=" * 50)
    
    # Test reviews
    reviews_ok = test_reviews_endpoint()
    
    print("\n" + "=" * 50)
    print("Summary:")
    print(f"Movies endpoint: {'✅ OK' if movies_ok else '❌ FAILED'}")
    print(f"Reviews endpoint: {'✅ OK' if reviews_ok else '❌ FAILED'}")
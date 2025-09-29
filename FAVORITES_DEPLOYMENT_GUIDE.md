# Deploying Favorites Feature to Production

## Overview
This guide explains how to deploy the new favorites feature to your production environment with Aiven MySQL database and Render hosting.

## What Was Added

### Backend Changes:
1. **New Model**: `models/favorite.py` - Junction table for user-movie favorites
2. **Updated Models**: Added relationships to `User` and `Movie` models
3. **New Schemas**: `schemas/favorite.py` - Pydantic models for API
4. **New Router**: `routers/favorite.py` - API endpoints for favorites
5. **Database Migration**: `migrations/versions/add_favorites_table.py`

### Frontend Changes:
1. **Updated API Service**: Added favorite endpoints to `apiService.js` 
2. **Updated Modal Component**: Now uses backend API instead of localStorage

## Deployment Steps

### 1. Test Locally First (Optional but Recommended)

If you want to test locally before deploying:

```bash
# Navigate to backend directory
cd Backend

# Install dependencies (if not already done)
pip install -r requirements.txt

# Run the migration locally (if you have local DB setup)
alembic upgrade head

# Test the server
python -m uvicorn main:app --reload
```

### 2. Deploy to Render

#### Option A: Automatic Deployment (If you have auto-deploy enabled)

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add favorites feature with backend API and database migration"
   git push origin main
   ```

2. **Monitor Render Dashboard:**
   - Go to your Render dashboard
   - Your service should automatically start deploying
   - Watch the build logs for any errors

#### Option B: Manual Deployment

1. Go to your Render dashboard
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### 3. Run Database Migration on Render

After deployment, you need to run the migration to create the favorites table:

#### Method 1: Using Render Shell (Recommended)

1. Go to your Render service dashboard
2. Click on "Shell" tab
3. Run the migration command:
   ```bash
   alembic upgrade head
   ```

#### Method 2: SSH into Render (if available)

If you have SSH access configured:
```bash
# SSH into your Render instance
render ssh your-service-name

# Run migration
alembic upgrade head
```

#### Method 3: Add Migration to Startup (Future deployments)

You can modify your `main.py` to run migrations on startup:

```python
# Add this import at the top
import subprocess
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations on startup (optional)
    if os.getenv("RUN_MIGRATIONS", "false").lower() == "true":
        try:
            subprocess.run(["alembic", "upgrade", "head"], check=True)
            print("✅ Database migrations completed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Migration failed: {e}")
    
    # Initialize database tables on startup
    init_db()
    yield
```

Then add environment variable `RUN_MIGRATIONS=true` in Render dashboard.

### 4. Verify Database Changes

#### Check via MySQL Workbench:

1. Connect to your Aiven MySQL database via MySQL Workbench
2. Refresh your database schema
3. Verify the new `favorites` table exists with these columns:
   - `id` (Primary Key, INT, Auto Increment)
   - `user_id` (INT, Foreign Key to `users.id`)
   - `movie_id` (INT, Foreign Key to `movies.id`)
   - Unique constraint on `(user_id, movie_id)`

#### Check via API:

Test the new endpoints once deployed:

```bash
# Test getting favorites (requires authentication)
curl -X GET "https://your-render-app.onrender.com/favorites/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test adding a favorite
curl -X POST "https://your-render-app.onrender.com/favorites/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movie_id": 1}'
```

### 5. Deploy Frontend

If your frontend is also hosted (Netlify, Vercel, etc.):

1. Push frontend changes to your repository
2. The frontend should automatically deploy if auto-deploy is enabled
3. If manual, trigger deployment in your hosting platform

### 6. Test the Complete Feature

1. **Login to your application**
2. **Open a movie modal**
3. **Click the favorite button** (should be a heart icon)
4. **Verify the API calls work:**
   - Check browser console for successful API calls
   - Check that favorites persist after page refresh
   - Test removing favorites

## Troubleshooting

### Common Issues:

1. **Migration Fails:**
   ```
   Error: Target database is not up to date
   ```
   **Solution:** Make sure you're running `alembic upgrade head` not just `alembic upgrade`

2. **Foreign Key Constraint Errors:**
   ```
   Error: Cannot add foreign key constraint
   ```
   **Solution:** Ensure `users` and `movies` tables exist before running migration

3. **Authentication Issues:**
   ```
   Error: 401 Unauthorized
   ```
   **Solution:** Make sure JWT tokens are properly stored and sent in requests

4. **CORS Issues:**
   ```
   Error: CORS policy blocks request
   ```
   **Solution:** Ensure your Render backend allows requests from your frontend domain

### Rollback Plan:

If something goes wrong, you can rollback the migration:

```bash
# On Render shell
alembic downgrade -1  # Goes back one migration
# or
alembic downgrade 6d0cedfb065f  # Goes back to specific revision
```

## Environment Variables to Check

Make sure these are set in your Render environment:

- `DATABASE_URL` - Your Aiven MySQL connection string
- `SECRET_KEY` - For JWT token signing
- Any other environment variables your app uses

## API Endpoints Added

After deployment, these new endpoints will be available:

- `GET /favorites/` - Get user's favorites
- `POST /favorites/` - Add movie to favorites  
- `DELETE /favorites/{movie_id}` - Remove movie from favorites
- `GET /favorites/check/{movie_id}` - Check if movie is favorited
- `DELETE /favorites/clear` - Clear all user favorites

## Security Notes

- All favorite endpoints require authentication
- Users can only manage their own favorites
- Movie IDs are validated before adding to favorites
- Duplicate favorites are prevented by database constraint

## Next Steps

After successful deployment:

1. **Monitor logs** for any errors
2. **Test with real users** to ensure everything works
3. **Consider adding favorite counts** to movies
4. **Maybe add a favorites page** to display user's favorite movies
5. **Add analytics** to track favorite usage

---

**Remember:** Always backup your database before running migrations in production!
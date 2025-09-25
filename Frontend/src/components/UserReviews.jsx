import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

function UserReviews({ movieId, onReviewsChange }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { theme } = useThemeContext();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Load reviews from API when component mounts
  useEffect(() => {
    const loadReviews = async () => {
      if (!movieId) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`🎬 Loading reviews for movie ${movieId}...`);
        
        const reviewsData = await apiService.getMovieReviews(movieId);
        
        // Transform API data to match component expectations
        const transformedReviews = reviewsData.map(review => ({
          id: review.id,
          movieId: review.movie?.id || movieId,
          user: review.user?.username || 'Anonymous',
          rating: review.rating,
          comment: review.review_text,
          date: review.review_date
        }));
        
        setReviews(transformedReviews);
        console.log(`✅ Loaded ${transformedReviews.length} reviews`);
        
        // Notify parent component about reviews change
        if (onReviewsChange) {
          onReviewsChange(transformedReviews);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
        setError('Unable to load reviews. Please try again later.');
        setReviews([]); // Show empty state instead of fake data
        
        // Notify parent component about empty reviews
        if (onReviewsChange) {
          onReviewsChange([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [movieId]);

  const handleAddReview = async () => {
    if (!isAuthenticated || !comment.trim() || !rating) {
      return;
    }

    try {
      const reviewData = {
        movie_id: movieId,
        user_id: currentUser?.id || 1, // You'll need to get real user ID from auth
        rating,
        review_text: comment.trim(),
      };

      console.log('🎬 Creating new review...', reviewData);
      const newReview = await apiService.createReview(reviewData);
      
      // Transform and add to local state
      const transformedReview = {
        id: newReview.id,
        movieId: newReview.movie?.id || movieId,
        user: newReview.user?.username || currentUser?.name || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.review_text,
        date: newReview.review_date
      };

      setReviews((prev) => {
        const updatedReviews = [...prev, transformedReview];
        
        // Notify parent component about reviews change
        if (onReviewsChange) {
          onReviewsChange(updatedReviews);
        }
        
        return updatedReviews;
      });
      setComment("");
      setRating(3);
      console.log('✅ Review created successfully');
    } catch (error) {
      console.error('Failed to create review:', error);
      // You might want to show an error message to the user
      alert('Failed to add review. Please try again.');
    }
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return setConfirmOpen(false);
    
    const reviewToDelete = reviews[deleteIndex];
    
    try {
      // If the review has an ID, delete it from the API
      if (reviewToDelete.id) {
        await apiService.deleteReview(reviewToDelete.id);
        console.log('✅ Review deleted successfully');
      }
      
      // Remove from local state
      setReviews((prev) => {
        const updatedReviews = prev.filter((_, i) => i !== deleteIndex);
        
        // Notify parent component about reviews change
        if (onReviewsChange) {
          onReviewsChange(updatedReviews);
        }
        
        return updatedReviews;
      });
      setDeleteIndex(null);
      setConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review. Please try again.');
      setDeleteIndex(null);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setConfirmOpen(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Reviews list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Loading reviews...
          </Typography>
        </Box>
      ) : error ? (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.error.main, fontStyle: "italic" }}
        >
          {error}
        </Typography>
      ) : reviews.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", color: theme.palette.text.secondary }}
        >
          No user reviews yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviews.map((review, index) => (
            <Card
              key={`${movieId}-${index}`}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                boxShadow: "none",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    {review.user}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating
                      value={review.rating}
                      readOnly
                      max={5}
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      ({review.rating}/5)
                    </Typography>

                    {isAuthenticated &&
                      review.user === (currentUser?.name || "Anonymous") && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(index)}
                          sx={{ color: theme.palette.error.main }}
                          aria-label="delete review"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                  </Box>
                </Box>

                <Divider sx={{ mb: 1 }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    lineHeight: 1.4,
                  }}
                >
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add new review */}
      {isAuthenticated ? (
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.background.default,
              },
              "& .MuiInputBase-input": {
                color: theme.palette.text.primary,
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary }}
            >
              Your Rating:
            </Typography>
            <Rating
              name="user-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue ?? rating)}
              max={5}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddReview}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              "&:hover": { opacity: 0.9 },
            }}
          >
            Add Review
          </Button>
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            fontStyle: "italic",
            color: theme.palette.text.secondary,
          }}
        >
          Sign in to add a review.
        </Typography>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserReviews;

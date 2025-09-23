import React, { useState } from "react";
import reviewsData from "../services/reviews";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

function UserReviews({ movieId }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { mode } = useThemeContext();

  const [reviews, setReviews] = useState(
    reviewsData.filter((r) => r.movieId === movieId)
  );
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3);

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleAddReview = () => {
    if (!isAuthenticated || !comment.trim() || !rating) return;

    const newReview = {
      movieId,
      user: currentUser?.name || "Anonymous",
      rating,
      comment: comment.trim(),
    };

    setReviews((prev) => [...prev, newReview]);
    setComment("");
    setRating(3);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) {
      setConfirmOpen(false);
      return;
    }
    setReviews((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    setConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteIndex(null);
    setConfirmOpen(false);
  };

  // small helpers for theme-safe colors
  const textPrimary = mode === "dark" ? "#FFD700" : "#333";
  const cardBg = mode === "dark" ? "#121212" : "#fff";
  const secondaryText = mode === "dark" ? "#ffeb3b" : "#757575";
  const subtleText = mode === "dark" ? "#aaa" : "#666";
  const btnBg = mode === "dark" ? "#FFD700" : "#000";
  const btnColor = mode === "dark" ? "#000" : "#fff";

  return (
    <Box sx={{ mt: 2 }}>
      {/* Reviews list */}
      {reviews.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            color: subtleText,
          }}
        >
          No user reviews yet.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reviews.map((review, index) => (
            <Card
              key={`${movieId}-${index}`}
              sx={{
                backgroundColor: cardBg,
                borderRadius: 2,
                borderLeft: `3px solid ${mode === "dark" ? "#FFD700" : "#333"}`,
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
                      color: textPrimary,
                    }}
                  >
                    {review.user}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating
                      value={review.rating}
                      readOnly
                      max={5}
                      sx={{
                        color: mode === "dark" ? "#FFD700" : "#333",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: secondaryText,
                      }}
                    >
                      ({review.rating}/5)
                    </Typography>

                    {isAuthenticated &&
                      review.user === (currentUser?.name || "Anonymous") && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(index)}
                          sx={{ color: "red" }}
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
                    color: textPrimary,
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
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: mode === "dark" ? "#0f0f0f" : "#fff",
              },
              "& .MuiInputBase-input": {
                color: mode === "dark" ? "#FFD700" : "#000",
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ color: textPrimary }}>
              Your Rating:
            </Typography>
            <Rating
              name="user-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue ?? rating)}
              max={5}
              sx={{
                color: mode === "dark" ? "#FFD700" : "#333",
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddReview}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: btnBg,
              color: btnColor,
              "&:hover": { opacity: 0.95 },
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
            color: subtleText,
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

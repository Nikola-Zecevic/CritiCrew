import React, { useState } from "react";
import reviewsData from "../services/reviews";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contexts/AuthContext";

function UserReviews({ movieId }) {
  const theme = useTheme();
  const { currentUser, isAuthenticated } = useAuth(); // uzimamo oba
  const [reviews, setReviews] = useState(
    reviewsData.filter((r) => r.movieId === movieId)
  );
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleAddReview = () => {
    if (!isAuthenticated || !comment.trim()) return;

    const newReview = {
      movieId,
      user: currentUser.name || "Anonymous",
      rating,
      comment: comment.trim(),
    };

    setReviews((prev) => [...prev, newReview]);
    setComment("");
    setRating(5);
  };

  const handleDeleteReview = (index) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Reviews list */}
      {reviews.length === 0 ? (
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
              key={index}
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
                      color: theme.palette.primary.main,
                    }}
                  >
                    {review.user}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {"⭐".repeat(review.rating)} ({review.rating}/5)
                    </Typography>
                    {isAuthenticated &&
                      review.user === (currentUser?.name || "Anonymous") && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteReview(index)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                  </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary, lineHeight: 1.4 }}
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
          />
          <TextField
            label="Rating (1-5)"
            type="number"
            value={rating}
            onChange={(e) =>
              setRating(Math.min(5, Math.max(1, Number(e.target.value))))
            }
            inputProps={{ min: 1, max: 5 }}
            sx={{ maxWidth: 150 }}
          />
          <Button
            variant="contained"
            onClick={handleAddReview}
            sx={{ alignSelf: "flex-start" }}
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
    </Box>
  );
}

export default UserReviews;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import UserReviews from "./UserReviews";
import { useThemeContext } from "../contexts/ThemeContext";
import moviesService from "../services/moviesService";
import { getDisplayRating } from "../utils/ratingUtils";

function Modal({ isOpen, onClose, movie }) {
  const { theme } = useThemeContext(); // now we have the MUI theme directly
  const [currentRating, setCurrentRating] = useState(movie?.rating || 0);
  const [isUserRating, setIsUserRating] = useState(movie?.isUserRating || false);
  const [shareSnackbarOpen, setShareSnackbarOpen] = useState(false);
  
  // Update current rating when movie changes
  useEffect(() => {
    if (movie) {
      setCurrentRating(movie.rating);
      setIsUserRating(movie.isUserRating || false);
    }
  }, [movie]);

  // Function to calculate new average rating
  const updateMovieRating = (reviews) => {
    let newRating;
    let isFromUserReviews;
    
    if (!reviews || reviews.length === 0) {
      // If no reviews, keep original movie rating
      newRating = movie.rating;
      isFromUserReviews = false;
    } else {
      // Calculate average of user reviews (already on 0-5 scale)
      const userRatingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
      newRating = userRatingSum / reviews.length;
      isFromUserReviews = true;
    }
    
    // Update local state for immediate UI update
    setCurrentRating(newRating);
    setIsUserRating(isFromUserReviews);
    
    // Update cached movie data so other components see the change
    moviesService.updateMovieRating(movie.id, newRating);
  };

  // Function to handle sharing movie link
  const handleShare = async () => {
    try {
      const movieUrl = `${window.location.origin}/movie/${movie.slug}`;
      
      // Try to use the Web Share API first (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: `Check out this movie: ${movie.title}`,
          url: movieUrl,
        });
        console.log('✅ Movie shared successfully via Web Share API');
      } else {
        // Fallback to clipboard API
        await navigator.clipboard.writeText(movieUrl);
        setShareSnackbarOpen(true);
        console.log('✅ Movie link copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to share movie:', error);
      // Fallback: try to copy to clipboard even if Web Share failed
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/movie/${movie.slug}`);
        setShareSnackbarOpen(true);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
        // Last resort: show a manual copy option
        alert(`Copy this link to share: ${window.location.origin}/movie/${movie.slug}`);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setShareSnackbarOpen(false);
  };

  if (!movie) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.default,
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: 3,
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "modalSlideIn 0.3s ease-out",
          "&::-webkit-scrollbar": { width: 10, height: 10 },
          "&::-webkit-scrollbar-track": {
            background: theme.palette.background.default,
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 8,
            border: `2px solid ${theme.palette.background.default}`,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.palette.secondary.main,
          },
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.9)"
              : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        },
      }}
      aria-labelledby="movie-dialog-title"
    >
      {/* Close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "1.2rem",
          left: "1.2rem",
          bgcolor: theme.palette.primary.main,
          color: theme.palette.mode === "dark" ? "#000" : "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 10,
          "&:hover": {
            bgcolor: theme.palette.secondary.main,
            transform: "scale(1.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Share button */}
      <IconButton
        aria-label="share movie"
        onClick={handleShare}
        sx={{
          position: "absolute",
          top: "1.2rem",
          right: "1.2rem",
          bgcolor: theme.palette.primary.main,
          color: theme.palette.mode === "dark" ? "#000" : "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 10,
          "&:hover": {
            bgcolor: theme.palette.secondary.main,
            transform: "scale(1.1)",
          },
        }}
      >
        <ShareIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle
        id="movie-dialog-title"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          p: "2rem 2rem 1rem",
          borderBottom: `1px solid ${theme.palette.text.secondary}`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 0.5,
            letterSpacing: 0.5,
          }}
        >
          {movie.title}
        </Typography>

        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.1rem",
            mb: 0.5,
          }}
        >
          {movie.year}
        </Typography>

        <Box
          sx={{
            display: "inline-block",
            color: theme.palette.primary.main,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(245,197,24,0.18)"
                : "rgba(0,0,0,0.05)",
            px: 2,
            py: 1,
            borderRadius: 2.5,
            fontWeight: "bold",
            fontSize: "1.1rem",
            mt: 0.5,
          }}
          aria-hidden
        >
          ★ {getDisplayRating({ rating: currentRating, isUserRating }) === 'No reviews' ? 'No reviews' : `${getDisplayRating({ rating: currentRating, isUserRating })}/5`}
        </Box>
      </DialogTitle>

      {/* Body */}
      <DialogContent
        sx={{
          p: { xs: "1rem", md: "2rem" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
          gap: "2rem",
          alignItems: "flex-start",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Poster */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={movie.image}
            alt={movie.title}
            sx={{
              width: "100%",
              maxWidth: { xs: 200, md: 280 },
              height: "auto",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              mt: { xs: 0, md: 2 },
            }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ color: theme.palette.text.primary, mt: 0 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              fontSize: "1.5rem",
              mt: 3,
              mb: 1.5,
            }}
          >
            Description
          </Typography>

          <Typography
            component="div"
            sx={{
              lineHeight: 1.6,
              fontSize: "1.1rem",
              mt: 1,
              mb: 3.5,
              color: theme.palette.text.secondary,
            }}
          >
            {movie.description || "No description available."}
          </Typography>

          <Box>
            {[
              ["Genre", movie.genre || "Drama"],
              ["Director", movie.director || "Frank Darabont"],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  mb: 0.5,
                  p: 0.5,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 1,
                }}
              >
                <strong style={{ color: theme.palette.primary.main }}>
                  {label}:
                </strong>{" "}
                {value}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              pt: 0.5,
              borderTop: `2.5px solid ${theme.palette.primary.main}`,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                fontSize: "1.5rem",
                mt: 1.5,
                mb: 1.2,
              }}
            >
              User Reviews
            </Typography>

            <UserReviews movieId={movie.id} onReviewsChange={updateMovieRating} />
          </Box>
        </Box>
      </DialogContent>

      {/* Share success notification */}
      <Snackbar
        open={shareSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Movie link copied to clipboard!
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default Modal;

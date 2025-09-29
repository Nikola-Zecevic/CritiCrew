// Utility functions for handling movie ratings

/**
 * Format rating for display based on whether it's from user reviews or original database
 * @param {number} rating - The rating value
 * @param {boolean} isUserRating - Whether this rating comes from user reviews (0-5) or database (0-10)
 * @returns {string} - Formatted rating string like "4.2"
 */
export function formatRating(rating, isUserRating = false) {
  if (!rating && rating !== 0) {
    return "No reviews";
  }

  // If rating is 0 or 0.0, show "No reviews" instead
  if (rating === 0 || rating === 0.0) {
    return "No reviews";
  }

  // If it's a user rating (from reviews), it's already on 0-5 scale
  if (isUserRating) {
    return rating.toFixed(1);
  }

  // If it's an original database rating, convert from 0-10 to 0-5 scale
  if (rating > 5) return (rating / 2).toFixed(1);
  return rating.toFixed(1);
}

/**
 * Get the display rating with proper formatting
 * @param {Object} movie - Movie object with rating and isUserRating properties
 * @returns {string} - Formatted rating for display
 */
export function getDisplayRating(movie, reviews = []) {
  if (reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return formatRating(avg, true); // ✅ user-based rating, 0–5 scale
  }

  // fallback to stored movie rating
  return formatRating(movie.rating, movie.isUserRating);
}

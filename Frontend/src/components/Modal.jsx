
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import UserReviews from "./UserReviews";

function Modal({ isOpen, onClose, movie }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
        <Box>
          <Typography variant="h5" component="div">{movie?.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">{movie?.year}</Typography>
          <Typography variant="body2" sx={{ color: '#f5c518', fontWeight: 'bold', mt: 0.5 }}>
            ★ {movie?.rating}/10
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box sx={{ minWidth: 220, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <img
            src={movie?.image}
            alt={movie?.title}
            style={{ width: 200, borderRadius: 12, boxShadow: '0 2px 12px #0008' }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {movie?.description || "No description available."}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2"><strong>Genre:</strong> {movie?.genre || "Drama"}</Typography>
            <Typography variant="body2"><strong>Duration:</strong> {movie?.duration || "142 min"}</Typography>
            <Typography variant="body2"><strong>Director:</strong> {movie?.director || "Frank Darabont"}</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>User Reviews</Typography>
            <UserReviews movieId={movie?.id} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;

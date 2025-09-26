import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

const DeleteConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  itemName,
  message 
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "Delete Item"}</DialogTitle>
      <DialogContent>
        <Typography>
          {message || `Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
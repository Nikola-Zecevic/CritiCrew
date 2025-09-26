import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const EditMovieDialog = ({ 
  open, 
  onClose, 
  onSave, 
  movie 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    description: '',
    release_date: '',
    image: ''
  });

  useEffect(() => {
    if (movie) {
      // Format date for HTML date input (YYYY-MM-DD)
      let formattedDate = '';
      if (movie.release_date) {
        try {
          const date = new Date(movie.release_date);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.warn('Invalid date format:', movie.release_date);
        }
      }
      
      setFormData({
        title: movie.title || '',
        director: movie.director || '',
        description: movie.description || '',
        release_date: formattedDate,
        image: movie.image || ''
      });
    }
  }, [movie]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data with proper formatting
    const updateData = {
      title: formData.title.trim(),
      director: formData.director.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || null,
      release_date: formData.release_date || null
    };

    onSave(updateData);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      director: '',
      description: '',
      release_date: '',
      image: ''
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Movie</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Title"
                value={formData.title}
                onChange={handleChange('title')}
                required
                fullWidth
              />
              <TextField
                label="Director"
                value={formData.director}
                onChange={handleChange('director')}
                required
                fullWidth
              />
            </Stack>
            
            <TextField
              label="Release Date"
              type="date"
              value={formData.release_date}
              onChange={handleChange('release_date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={4}
              fullWidth
            />
            
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={handleChange('image')}
              fullWidth
              helperText="Enter the Cloudinary URL or other image URL"
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Movie
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMovieDialog;
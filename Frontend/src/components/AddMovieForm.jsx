import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import ImageUpload from './ImageUpload';
import { uploadToCloudinary } from '../utils/cloudinary';

const AddMovieForm = ({ onAddMovie, showNotification }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select an image file', 'error');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('Image size must be less than 10MB', 'error');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const result = await uploadToCloudinary(imageFile);
      return result.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const fd = new FormData(e.target);
      const title = (fd.get("title") || "").toString().trim();
      const director = (fd.get("director") || "").toString().trim();
      const release_date = (fd.get("release_date") || "").toString().trim();
      const description = (fd.get("description") || "").toString().trim();

      if (!title) {
        showNotification("Title is required.", 'error');
        return;
      }

      if (!director) {
        showNotification("Director is required.", 'error');
        return;
      }

      if (!description) {
        showNotification("Description is required.", 'error');
        return;
      }

      let imageUrl = null;
      
      // Upload image to Cloudinary if selected
      if (selectedImage) {
        try {
          imageUrl = await uploadImageToCloudinary(selectedImage);
          showNotification('Image uploaded successfully!', 'success');
        } catch (error) {
          console.error('Image upload error:', error);
          showNotification('⚠️ Image upload failed - continuing without image. Check Cloudinary preset settings.', 'warning');
          imageUrl = null;
        }
      }

      // Prepare movie data
      const movieData = {
        title: title.trim(),
        director: director.trim(),
        description: description.trim(),
        release_date: release_date || null,
        image: imageUrl || null
      };

      // Call the parent's add movie handler
      await onAddMovie(movieData);
      
      // Reset form
      e.target.reset();
      handleRemoveImage();
      showNotification('Movie added successfully!', 'success');

    } catch (error) {
      console.error('Error adding movie:', error);
      showNotification(
        error.response?.data?.detail || 'Failed to add movie. Please try again.',
        'error'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Add New Movie" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <TextField name="title" label="Title" required fullWidth />
              <TextField name="director" label="Director" required fullWidth />
            </Stack>
            
            <TextField 
              name="release_date" 
              label="Release Date" 
              type="date" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
            />
            
            <TextField
              name="description"
              label="Description"
              multiline
              rows={3}
              fullWidth
              required
            />
            
            <ImageUpload
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUploading}
              sx={{ alignSelf: "flex-start" }}
              startIcon={isUploading ? <CircularProgress size={20} /> : null}
            >
              {isUploading ? 'Adding Movie...' : 'Add Movie'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddMovieForm;
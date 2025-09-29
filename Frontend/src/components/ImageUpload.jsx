import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';

const ImageUpload = ({
  selectedImage,
  imagePreview,
  onImageSelect,
  onRemoveImage,
  title = "Movie Poster",
  acceptedFormats = "JPG, PNG, WebP up to 10MB"
}) => {
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={2}>
        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            backgroundColor: selectedImage ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            }
          }}
          onClick={() => document.getElementById('image-upload-input').click()}
        >
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          
          {selectedImage ? (
            <Stack spacing={2} alignItems="center">
              <Avatar
                src={imagePreview}
                sx={{ width: 120, height: 180, borderRadius: 1 }}
                variant="rectangular"
              />
              <Typography variant="body2" color="primary">
                {selectedImage.name}
              </Typography>
              <Chip
                size="small"
                label={`${(selectedImage.size / 1024 / 1024).toFixed(2)} MB`}
                color="primary"
                variant="outlined"
              />
            </Stack>
          ) : (
            <Stack spacing={1} alignItems="center">
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                Click to upload {title.toLowerCase()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {acceptedFormats}
              </Typography>
            </Stack>
          )}
        </Box>
        
        {selectedImage && (
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              size="small"
              startIcon={<PreviewIcon />}
              onClick={() => window.open(imagePreview, '_blank')}
            >
              Preview
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onRemoveImage}
            >
              Remove
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ImageUpload;
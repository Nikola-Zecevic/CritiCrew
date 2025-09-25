import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import usersFromFile from "../../apis/users.json";
import apiService from "../../services/apiService";
import { uploadToCloudinary } from "../../utils/cloudinary";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Chip,
  Grid,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Movie as MovieIcon,
} from "@mui/icons-material";

export default function Dashboard() {
  const { currentUser, isAuthenticated, isAdmin, isSuperadmin, logout } =
    useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("usersData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return usersFromFile.map((u) => ({ ...u }));
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  
  // Notification states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Movies states (if not already defined elsewhere)
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  // Load movies from API
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await apiService.getMovies();
        setMovies(response || []);
      } catch (error) {
        console.error('Error loading movies:', error);
        showNotification('Failed to load movies', 'error');
      } finally {
        setLoadingMovies(false);
      }
    };

    loadMovies();
  }, []);

  // Image handling functions
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
    setUploadedImageUrl(null);
  };

  // Upload image to Cloudinary using our utility
  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const result = await uploadToCloudinary(imageFile);
      return result.url;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };


  const handleAddMovie = async (e) => {
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
          setUploadedImageUrl(imageUrl);
          showNotification('Image uploaded successfully!', 'success');
        } catch (error) {
          console.error('Image upload error:', error);
          showNotification('⚠️ Image upload failed - continuing without image. Check Cloudinary preset settings.', 'warning');
          // Continue without image instead of failing completely
          imageUrl = null;
        }
      }

      // Prepare movie data (ID will be assigned automatically by backend)
      const movieData = {
        title,
        director,
        description,
        release_date: release_date || null,
        image: imageUrl
      };

      // Create movie via API
      const response = await apiService.createMovie(movieData);
      
      showNotification('Movie added successfully!', 'success');
      
      // Add to local state for immediate display
      setMovies(prev => [response, ...prev]);
      
      // Reset form
      e.target.reset();
      handleRemoveImage();

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
    <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <MovieIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movie Dashboard
          </Typography>
          <Typography variant="body2">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* Add Movie Form */}
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Add New Movie" />
          <CardContent>
            <Box component="form" onSubmit={handleAddMovie}>
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
                
                {/* Image Upload Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Movie Poster
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
                            Click to upload movie poster
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            JPG, PNG, WebP up to 10MB
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
                          onClick={handleRemoveImage}
                        >
                          Remove
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Box>

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

        {/* Movies List */}
        <Card>
          <CardHeader title="Movies in Database" />
          <CardContent>
            {loadingMovies ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : movies.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No movies found. Add your first movie above!
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {movies.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} key={movie.id}>
                    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {movie.image && (
                        <Avatar
                          src={movie.image}
                          sx={{ width: '100%', height: 200, borderRadius: 1, mb: 2 }}
                          variant="rectangular"
                        />
                      )}
                      <Typography variant="h6" gutterBottom>
                        {movie.title}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Directed by {movie.director}
                      </Typography>
                      {movie.release_date && (
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Released: {new Date(movie.release_date).getFullYear()}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ flexGrow: 1, mt: 1 }}>
                        {movie.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
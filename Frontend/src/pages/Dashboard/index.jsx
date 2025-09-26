import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import {
  Container,
  Box,
} from "@mui/material";

// Import our new components
import DashboardHeader from "../../components/DashboardHeader";
import AddMovieForm from "../../components/AddMovieForm";
import MoviesList from "../../components/MoviesList";
import UsersTable from "../../components/UsersTable";
import EditMovieDialog from "../../components/EditMovieDialog";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import NotificationSnackbar from "../../components/NotificationSnackbar";

export default function Dashboard() {
  const { currentUser, isAuthenticated, isAdmin, isSuperadmin, logout } =
    useAuth();
  const navigate = useNavigate();
  
  // Notification states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Movies states
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMovie, setDeletingMovie] = useState(null);
  
  // Filter movies based on search term
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Edit movie handlers
  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setEditDialogOpen(true);
  };

  const handleEditSave = async (updateData) => {
    try {
      console.log('Sending update data:', updateData);
      
      const updatedMovie = await apiService.updateMovie(editingMovie.id, updateData);
      
      // Update local state
      setMovies(prev => prev.map(movie => 
        movie.id === editingMovie.id ? updatedMovie : movie
      ));
      
      showNotification('Movie updated successfully!', 'success');
      setEditDialogOpen(false);
      setEditingMovie(null);
    } catch (error) {
      console.error('Error updating movie:', error);
      showNotification(`Failed to update movie: ${error.message}`, 'error');
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingMovie(null);
  };

  // Delete movie handlers
  const handleDeleteMovie = (movie) => {
    setDeletingMovie(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiService.deleteMovie(deletingMovie.id);
      
      // Remove from local state
      setMovies(prev => prev.filter(movie => movie.id !== deletingMovie.id));
      
      showNotification('Movie deleted successfully!', 'success');
      setDeleteDialogOpen(false);
      setDeletingMovie(null);
    } catch (error) {
      console.error('Error deleting movie:', error);
      showNotification(`Failed to delete movie: ${error.message}`, 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingMovie(null);
  };


  // Add movie handler for the AddMovieForm component
  const handleAddMovie = async (movieData) => {
    console.log('Creating movie with data:', movieData);

    // Create movie via API
    const response = await apiService.createMovie(movieData);
    
    // Add to local state for immediate display
    setMovies(prev => [response, ...prev]);
    
    return response;
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
      <DashboardHeader />

      <Container sx={{ mt: 4 }}>
        {/* Users Management - Only visible to superadmins */}
        {isSuperadmin && (
          <UsersTable showNotification={showNotification} />
        )}

        {/* Add Movie Form */}
        <AddMovieForm 
          onAddMovie={handleAddMovie}
          showNotification={showNotification}
        />

        {/* Movies List */}
        <MoviesList
          movies={movies}
          loading={loadingMovies}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEditMovie={handleEditMovie}
          onDeleteMovie={handleDeleteMovie}
          filteredMovies={filteredMovies}
        />
      </Container>

      {/* Edit Movie Dialog */}
      <EditMovieDialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        onSave={handleEditSave}
        movie={editingMovie}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie"
        itemName={deletingMovie?.title}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        notification={notification}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}
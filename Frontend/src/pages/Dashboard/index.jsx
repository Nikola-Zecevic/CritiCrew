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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  
  // Responsive items per page calculation
  const getItemsPerPage = React.useCallback(() => {
    if (window.innerWidth >= 1536) { return 15; } // xl: 5 columns × 3 rows
    if (window.innerWidth >= 1200) { return 12; } // lg: 4 columns × 3 rows
    if (window.innerWidth >= 900) { return 9; }   // md: 3 columns × 3 rows
    if (window.innerWidth >= 600) { return 6; }   // sm: 2 columns × 3 rows
    return 3; // xs: 1 column × 3 rows
  }, []);
  
  const [itemsPerPage, setItemsPerPage] = useState(() => getItemsPerPage());

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  // Debug logging for pagination
  React.useEffect(() => {
    console.log('Pagination Debug:', {
      totalMovies: movies.length,
      filteredMovies: filteredMovies.length,
      itemsPerPage,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      paginatedMoviesCount: paginatedMovies.length
    });
  }, [movies.length, filteredMovies.length, itemsPerPage, currentPage, totalPages, startIndex, endIndex, paginatedMovies.length]);

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to page 1 if current page exceeds total pages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

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

  // Handle window resize for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
        // Reset to page 1 when items per page changes to avoid empty pages
        setCurrentPage(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPage, getItemsPerPage]);

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

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
          paginatedMovies={paginatedMovies}
          filteredMovies={filteredMovies}
          currentPage={currentPage || 1}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
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
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/apiService";
import { Container, Box, Typography } from "@mui/material";

import AddMovieForm from "../../components/AddMovieForm";
import MoviesList from "../../components/MoviesList";
import EditMovieDialog from "../../components/EditMovieDialog";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog";
import NotificationSnackbar from "../../components/NotificationSnackbar";

export default function ManageMovies() {
  const { currentUser, isAuthenticated, isSuperadmin } = useAuth();
  const navigate = useNavigate();

  // Figure out if user is at least admin
  const isAdmin = currentUser?.role === "admin" || isSuperadmin;

  // Redirect unauthorized users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Don't render if not authorized
  if (!isAuthenticated || !isAdmin) return null;

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Movies state
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const getItemsPerPage = useCallback(() => {
    if (window.innerWidth >= 1536) return 15;
    if (window.innerWidth >= 1200) return 12;
    if (window.innerWidth >= 900) return 9;
    if (window.innerWidth >= 600) return 6;
    return 3;
  }, []);
  const [itemsPerPage, setItemsPerPage] = useState(() => getItemsPerPage());

  // Edit/Delete dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMovie, setDeletingMovie] = useState(null);

  // Filter & paginate movies
  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  // Reset page on search term or page overflow
  useEffect(() => setCurrentPage(1), [searchTerm]);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // Load movies from API
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await apiService.getMovies();
        setMovies(response || []);
      } catch (error) {
        console.error("Error loading movies:", error);
        showNotification("Failed to load movies", "error");
      } finally {
        setLoadingMovies(false);
      }
    };
    loadMovies();
  }, []);

  // Handle window resize for items per page
  useEffect(() => {
    const handleResize = () => {
      const newItems = getItemsPerPage();
      if (newItems !== itemsPerPage) {
        setItemsPerPage(newItems);
        setCurrentPage(1);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerPage, getItemsPerPage]);

  // Movie actions
  const handleAddMovie = async (data) => {
    const response = await apiService.createMovie(data);
    setMovies((prev) => [response, ...prev]);
    return response;
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setEditDialogOpen(true);
  };
  const handleEditSave = async (data) => {
    try {
      const updated = await apiService.updateMovie(editingMovie.id, data);
      setMovies((prev) =>
        prev.map((m) => (m.id === editingMovie.id ? updated : m))
      );
      showNotification("Movie updated successfully!");
      setEditDialogOpen(false);
      setEditingMovie(null);
    } catch (error) {
      console.error(error);
      showNotification(`Failed to update movie: ${error.message}`, "error");
    }
  };
  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingMovie(null);
  };

  const handleDeleteMovie = (movie) => {
    setDeletingMovie(movie);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      await apiService.deleteMovie(deletingMovie.id);
      setMovies((prev) => prev.filter((m) => m.id !== deletingMovie.id));
      showNotification("Movie deleted successfully!");
      setDeleteDialogOpen(false);
      setDeletingMovie(null);
    } catch (error) {
      console.error(error);
      showNotification(`Failed to delete movie: ${error.message}`, "error");
    }
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingMovie(null);
  };

  // Pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
          Manage Movies
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Add, edit, and manage your movie collection
        </Typography>
      </Box>

      <Container sx={{ mt: 4 }}>
        <AddMovieForm
          onAddMovie={handleAddMovie}
          showNotification={showNotification}
        />
        <MoviesList
          movies={movies}
          loading={loadingMovies}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEditMovie={handleEditMovie}
          onDeleteMovie={handleDeleteMovie}
          paginatedMovies={paginatedMovies}
          filteredMovies={filteredMovies}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>

      <EditMovieDialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        onSave={handleEditSave}
        movie={editingMovie}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie"
        itemName={deletingMovie?.title}
      />

      <NotificationSnackbar
        notification={notification}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}

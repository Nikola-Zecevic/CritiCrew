import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Movie as MovieIcon,
} from '@mui/icons-material';
import DashboardMovieCard from './DashboardMovieCard';
import Pagination from './Pagination';

const MoviesList = ({
  movies,
  loading,
  searchTerm,
  onSearchChange,
  onEditMovie,
  onDeleteMovie,
  paginatedMovies,
  filteredMovies,
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title={`Movies in Database (${movies.length})`}
        subheader="Manage your movie collection"
      />
      <CardContent>
        {/* Search Bar */}
        {movies.length > 0 && (
          <Box mb={3}>
            <TextField
              fullWidth
              placeholder="Search movies by title, director, or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            {searchTerm && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Showing {filteredMovies.length} of {movies.length} movies
              </Typography>
            )}
          </Box>
        )}

        {/* Movies Grid or Empty States */}
        {movies.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            py={6}
            sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
          >
            <MovieIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No movies in your collection yet
            </Typography>
            <Typography color="text.secondary" align="center">
              Add your first movie using the form above to get started!
            </Typography>
          </Box>
        ) : filteredMovies.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            py={4}
            sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No movies match your search
            </Typography>
            <Typography color="text.secondary" align="center">
              Try adjusting your search terms or clear the search to see all movies
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => onSearchChange('')}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                  xl: 'repeat(5, 1fr)'
                },
                gap: 3,
                gridAutoRows: '450px',
                mb: 3
              }}
            >
              {paginatedMovies.map((movie) => (
                <DashboardMovieCard
                  key={movie.id}
                  movie={movie}
                  onEdit={onEditMovie}
                  onDelete={onDeleteMovie}
                />
              ))}
            </Box>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MoviesList;
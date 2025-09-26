import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  Movie as MovieIcon,
} from '@mui/icons-material';

const DashboardMovieCard = ({ movie, onEdit, onDelete }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'grid',
        gridTemplateRows: '200px 1fr',
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        }
      }}
    >
      {/* Movie Poster */}
      <Box 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden', 
          width: '100%',
          height: '100%',
          backgroundColor: 'grey.100'
        }}
      >
        {movie.image ? (
          <Box
            component="img"
            src={movie.image}
            alt={movie.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block'
            }}
            onLoad={(e) => {
              e.target.style.objectFit = 'cover';
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MovieIcon sx={{ fontSize: 48, color: 'grey.400' }} />
          </Box>
        )}
        
        {/* Movie ID Badge */}
        <Chip
          label={`ID: ${movie.id}`}
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'rgba(25, 118, 210, 0.9)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
        
        {/* Release Year Badge */}
        {movie.release_date && (
          <Chip
            label={new Date(movie.release_date).getFullYear()}
            size="small"
            variant="outlined"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>

      {/* Movie Details */}
      <CardContent 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          p: 2,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Title - Fixed height */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1,
            minHeight: '1.5rem'
          }}
        >
          {movie.title}
        </Typography>
        
        {/* Director - Fixed height */}
        <Typography 
          variant="body2"
          color="text.secondary"
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1,
            minHeight: '1.25rem'
          }}
        >
          <Box component="span" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
            Director:
          </Box>{' '}
          {movie.director}
        </Typography>

        {/* Release Date - Fixed height */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1,
            minHeight: '1.25rem'
          }}
        >
          {movie.release_date ? (
            <>
              <Box component="span" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                Released:
              </Box>{' '}
              {new Date(movie.release_date).getFullYear()}
            </>
          ) : (
            <Box component="span" sx={{ color: 'text.disabled' }}>
              Release date not available
            </Box>
          )}
        </Typography>

        {/* Description - Flexible height */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            mb: 2,
            fontSize: '0.875rem'
          }}
        >
          {movie.description || 'No description available'}
        </Typography>

        {/* Action Buttons - Fixed at bottom */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
          sx={{ mt: 'auto' }}
        >
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => onEdit(movie)}
            sx={{ 
              minWidth: 'auto', 
              px: 2,
              fontSize: '0.75rem'
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDelete(movie)}
            sx={{ 
              minWidth: 'auto', 
              px: 2,
              fontSize: '0.75rem'
            }}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardMovieCard;
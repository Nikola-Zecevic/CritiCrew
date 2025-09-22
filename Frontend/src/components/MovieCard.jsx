
import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function MovieCard({ movie, isFeatured = false }) {
  if (isFeatured) {
    return (
      <Card sx={{ display: 'flex', mb: 3, boxShadow: 6, borderRadius: 3, background: '#232323', color: '#fff' }}>
        <CardMedia
          component="img"
          image={movie.image}
          alt={movie.title}
          sx={{ width: 220, borderRadius: 3, objectFit: 'cover', m: 2 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, p: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{movie.title}</Typography>
          <Typography variant="subtitle2" color="#f5c518" sx={{ mb: 1 }}>Year: {movie.year}</Typography>
          <Typography variant="body2" sx={{ color: '#f5c518', mb: 1 }}>★ {movie.rating}/10</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>{movie.description}</Typography>
          <Button
            component={Link}
            to={`/movie/${movie.slug}`}
            variant="contained"
            sx={{ background: '#f5c518', color: '#000', fontWeight: 'bold', borderRadius: 2, mt: 1, width: 140 }}
          >
            Read More
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 320, m: 2, boxShadow: 3, borderRadius: 3, background: '#232323', color: '#fff' }}>
      <CardMedia
        component="img"
        image={movie.image}
        alt={movie.title}
        sx={{ height: 340, objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{movie.title}</Typography>
        <Typography variant="subtitle2" color="#f5c518" sx={{ mb: 1 }}>Year: {movie.year}</Typography>
        <Typography variant="body2" sx={{ color: '#f5c518', mb: 1 }}>★ {movie.rating}/10</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>{movie.genre}</Typography>
        <Button
          component={Link}
          to={`/movie/${movie.slug}`}
          variant="contained"
          sx={{ background: '#f5c518', color: '#000', fontWeight: 'bold', borderRadius: 2, mt: 1 }}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}

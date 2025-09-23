import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useThemeContext } from "../contexts/ThemeContext";

export default function MovieCard({ movie, isFeatured = false }) {
  const { theme } = useThemeContext(); // get the MUI theme from ThemeContext
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        display: isFeatured && !isSmallScreen ? "flex" : "block",
        flexDirection: isFeatured && !isSmallScreen ? "row" : "column",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardMedia
        component="img"
        image={movie.image}
        alt={movie.title}
        sx={{
          width: isFeatured && !isSmallScreen ? "40%" : "100%",
          height: isFeatured && !isSmallScreen ? "auto" : 280,
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          p: isFeatured ? 3 : 2,
        }}
      >
        <Typography
          variant={isFeatured ? "h5" : "h6"}
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {movie.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Year: {movie.year}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.secondary.main }}
        >
          ⭐ {movie.rating}/10
        </Typography>

        {isFeatured && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, mt: 1 }}
          >
            {movie.description}
          </Typography>
        )}

        {!isFeatured && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary }}
          >
            {movie.genre}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Link to={`/movie/${movie.slug}`} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "#000" : "#fff",
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                px: 2.5,
                py: 1,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.main,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#111",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                },
              }}
            >
              Read More
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}

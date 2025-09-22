import React from "react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   InputBase,
//   Paper,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Button,
//   Avatar,
// } from "@mui/material";
// import { Search as SearchIcon, DarkMode, LightMode } from "@mui/icons-material";
// import { useAuth } from "../contexts/AuthContext";
// import { useThemeContext } from "../contexts/ThemeContext";
// import useMovieSearch from "../hooks/useMovieSearch";

import { Link, useNavigate } from "react-router-dom";
import useMovieSearch from "../hooks/useMovieSearch";
import { useAuth } from "../contexts/AuthContext";
import { Box, TextField, IconButton, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useThemeContext } from "../contexts/ThemeContext";
import { LightMode, DarkMode } from "@mui/icons-material";

export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const {
    searchQuery,
    searchResults,
    showSuggestions,
    handleSearchInputChange,
    clearSearch,
  } = useMovieSearch();

  // function getInitials(name = "") {
  //   return name
  //     .split(" ")
  //     .map((word) => word[0])
  //     .join("")
  //     .toUpperCase();
  // }

  // function handleSearch(e) {
  //   e.preventDefault();
  // }

  // function handleSuggestionClick(movie) {

  const handleSearch = (e) => e.preventDefault();
  const handleSuggestionClick = (movie) => {
    clearSearch();
    navigate(`/movie/${movie.slug}`);
  };

  const getInitials = (name = "U") =>
    name
      .split(" ")
      .map((w) => (w ? w[0] : ""))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Filter", to: "/filter" },
    { label: "Random Movie", to: "/random" },
    { label: "About Us", to: "/about" },
  ];

  const navLinkStyle = {
    position: "relative",
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: "1.1rem",
    px: 1,
    py: 0.5,
    transition: "color 0.2s ease",
    "&:hover": { color: theme.palette.primary.main },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-4px",
      left: 0,
      width: "0%",
      height: "2px",
      bgcolor: theme.palette.primary.main,
      transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": { width: "100%" },
  };

  return (
    // <AppBar position="static" color="default" elevation={2}>
    //   <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    //     {/* Logo */}
    //     <Typography
    //       variant="h6"
    //       component={RouterLink}
    //       to="/"
    //       sx={{
    //         textDecoration: "none",
    //         color: "inherit",
    //         fontWeight: "bold",
    //       }}
    //     >
    //       CritiCrew
    //     </Typography>

    //     {/* Search */}
    //     <Box sx={{ position: "relative", flexGrow: 1, maxWidth: 400, mx: 2 }}>
    //       <Paper
    //         component="form"
    //         onSubmit={handleSearch}
    //         sx={{
    //           p: "2px 4px",
    //           display: "flex",
    //           alignItems: "center",
    //           width: "100%",
    //         }}
    //       >
    //         <InputBase
    //           placeholder="Search movies…"
    //           value={searchQuery}
    //           onChange={(e) => handleSearchInputChange(e.target.value)}
    //           sx={{ ml: 1, flex: 1 }}
    //         />
    //         <IconButton type="submit" sx={{ p: "10px" }}>
    //           <SearchIcon />
    //         </IconButton>
    //       </Paper>

    //       {showSuggestions && searchResults.length > 0 && (
    //         <Paper
    //           sx={{
    //             position: "absolute",
    //             top: "100%",
    //             left: 0,
    //             right: 0,
    //             mt: 1,
    //             zIndex: 10,
    //             maxHeight: 250,
    //             overflowY: "auto",
    //           }}
    //         >
    //           <List>
    //             {searchResults.map((movie) => (
    //               <ListItem key={movie.id} disablePadding>
    //                 <ListItemButton
    //                   onClick={() => handleSuggestionClick(movie)}
    //                 >
    //                   <ListItemText
    //                     primary={`${movie.title} (${movie.year})`}
    //                     secondary={`⭐ ${movie.rating}`}
    //                   />
    //                 </ListItemButton>
    //               </ListItem>
    //             ))}
    //           </List>
    //         </Paper>
    //       )}
    //     </Box>

    //     <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
    //       <Button component={RouterLink} to="/" color="inherit">
    //         Home
    //       </Button>
    //       <Button component={RouterLink} to="/filter" color="inherit">
    //         Filter
    //       </Button>
    //       <Button component={RouterLink} to="/random" color="inherit">
    //         Random Movie
    //       </Button>
    //       <Button component={RouterLink} to="/about" color="inherit">
    //         About Us
    //       </Button>
    //       {isAdmin && (
    //         <Button component={RouterLink} to="/dashboard" color="inherit">
    //           Dashboard
    //         </Button>
    //       )}
    //     </Box>

    //     <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
    //       <IconButton onClick={toggleTheme} color="inherit">
    //         {mode === "light" ? <DarkMode /> : <LightMode />}
    //       </IconButton>

    //       <IconButton component={RouterLink} to="/profile" sx={{ ml: 1 }}>
    //         <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
    //           {getInitials(currentUser?.name || "U")}
    //         </Avatar>
    //       </IconButton>
    //     </Box>
    //   </Toolbar>
    // </AppBar>
    <>
      {/* Floating theme toggle - top left */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          bgcolor: "background.paper",
          boxShadow: 3,
          "&:hover": { bgcolor: "yellow" },
          zIndex: 2000,
        }}
      >
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>

      {/* Floating profile avatar - top right */}
      <Box
        component={Link}
        to="/profile"
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: `2px solid ${theme.palette.primary.main}`,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          fontWeight: "bold",
          display: { xs: "flex", md: "none" }, // samo na mob
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          boxShadow: 3,
          zIndex: 2000,
          "&:hover": {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.getContrastText(theme.palette.primary.main),
            transform: "scale(1.05)",
          },
        }}
      >
        {getInitials(currentUser?.name)}
      </Box>

      <Box
        component="nav"
        sx={{
          bgcolor: theme.palette.background.default,
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          position: "sticky",
          top: 0,
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 1200,
            mx: "auto",
            px: 3,
            gap: 3,
            py: { xs: 2, md: 1.5 },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              fontSize: { xs: "2.2rem", md: "2.4rem" },
              fontWeight: "bold",
              textDecoration: "none",
              textAlign: { xs: "center", md: "left" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            CritiCrew
          </Box>

          {/* Search */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 550,
              width: "100%",
              position: "relative",
              order: { xs: 3, md: 0 },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ display: "flex", width: "100%" }}
            >
              <TextField
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                size="medium"
                variant="outlined"
                sx={{
                  flex: 1,
                  bgcolor: mode === "dark" ? "#222" : "#fff",
                  borderRadius: "6px 0 0 6px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      mode === "dark" ? "#333" : theme.palette.divider,
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                }}
              />
              <IconButton
                type="submit"
                aria-label="search"
                sx={{
                  ml: 1,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "0 6px 6px 0",
                  "&:hover": { bgcolor: theme.palette.primary.light },
                }}
              >
                <SearchIcon
                  sx={{
                    color: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                  }}
                />
              </IconButton>
            </Box>

            {showSuggestions && searchResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  maxHeight: 220,
                  overflowY: "auto",
                  zIndex: 1400,
                }}
              >
                {searchResults.map((movie) => (
                  <Box
                    key={movie.id}
                    onClick={() => handleSuggestionClick(movie)}
                    sx={{
                      px: 2,
                      py: 1,
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {movie.title} ({movie.year}) — ⭐{movie.rating}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Menu links */}
          <Box
            component="ul"
            sx={{
              display: "flex",
              listStyle: "none",
              gap: { xs: 2, md: 5 },
              m: 0,
              p: 0,
              order: { xs: 2, md: 0 },
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {navLinks.map((link) => (
              <li key={link.to}>
                <Box component={Link} to={link.to} sx={navLinkStyle}>
                  {link.label}
                </Box>
              </li>
            ))}
            {isAdmin && (
              <li>
                <Box component={Link} to="/dashboard" sx={navLinkStyle}>
                  Dashboard
                </Box>
              </li>
            )}
          </Box>

          {/* Profile avatar desktop only */}
          <Box
            component={Link}
            to="/profile"
            sx={{
              display: { xs: "none", md: "flex" },
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: `2px solid ${theme.palette.primary.main}`,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.primary.main,
              fontWeight: "bold",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                transform: "scale(1.05)",
              },
            }}
          >
            {getInitials(currentUser?.name)}
          </Box>
        </Box>
      </Box>
    </>
  );
}

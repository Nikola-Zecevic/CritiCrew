import React from "react";
import { Link as RouterLink } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import { Box, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.default,
        borderTop: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.text.primary,
        padding: "2rem 0 1rem",
        marginTop: "auto",
      }}
    >
      <Box
        className="footer-content"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
          mb: 2,
          px: 2,
        }}
      >
        {/* CritiCrew info */}
        <Box sx={{ minWidth: 220 }}>
          <Typography
            variant="h5"
            sx={{ color: theme.palette.primary.main, mb: 1, fontWeight: 700 }}
          >
            CritiCrew
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
          >
            Your ultimate destination for movie ratings, reviews, and
            information.
          </Typography>
        </Box>

        {/* Quick links */}
        <Box sx={{ minWidth: 180 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              mb: 1,
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            Quick Links
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {[
              { label: "Home", to: "/" },
              { label: "Filter", to: "/filter" },
              { label: "Random Movie", to: "/random" },
              { label: "About Us", to: "/about" },
            ].map((link) => (
              <Box component="li" sx={{ mb: 1 }} key={link.to}>
                <RouterLink to={link.to} style={{ textDecoration: "none" }}>
                  <Box
                    component="span"
                    sx={{
                      color: theme.palette.text.secondary,
                      transition: "color 0.3s",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  >
                    {link.label}
                  </Box>
                </RouterLink>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Social links */}
        <Box sx={{ minWidth: 180 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              mb: 1,
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            Follow Us
          </Typography>
          <SocialLinks />
        </Box>
      </Box>

      {/* Footer bottom */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          pt: 1,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, m: 0 }}
        >
          © 2025 CritiCrew. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

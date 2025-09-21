import React from "react";
import { Link as RouterLink } from "react-router-dom";
import SocialLinks from "./SocialLinks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* CritiCrew info */}
        <Box className="footer-section" sx={{ minWidth: 220 }}>
          <Typography
            variant="h5"
            sx={{ color: "#f5c518", mb: 1, fontWeight: 700 }}
          >
            CritiCrew
          </Typography>
          <Typography variant="body2" sx={{ color: "#ccc", lineHeight: 1.6 }}>
            Your ultimate destination for movie ratings, reviews, and
            information.
          </Typography>
        </Box>

        {/* Quick links */}
        <Box className="footer-section" sx={{ minWidth: 180 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#f5c518",
              mb: 1,
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            Quick Links
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <RouterLink to="/" style={{ textDecoration: "none" }}>
                <Box
                  component="span"
                  sx={{
                    color: "#ccc",
                    transition: "color 0.3s",
                    "&:hover": { color: "#f5c518" },
                  }}
                >
                  Home
                </Box>
              </RouterLink>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <RouterLink to="/filter" style={{ textDecoration: "none" }}>
                <Box
                  component="span"
                  sx={{
                    color: "#ccc",
                    transition: "color 0.3s",
                    "&:hover": { color: "#f5c518" },
                  }}
                >
                  Filter
                </Box>
              </RouterLink>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <RouterLink to="/random" style={{ textDecoration: "none" }}>
                <Box
                  component="span"
                  sx={{
                    color: "#ccc",
                    transition: "color 0.3s",
                    "&:hover": { color: "#f5c518" },
                  }}
                >
                  Random Movie
                </Box>
              </RouterLink>
            </Box>
            <Box component="li">
              <RouterLink to="/about" style={{ textDecoration: "none" }}>
                <Box
                  component="span"
                  sx={{
                    color: "#ccc",
                    transition: "color 0.3s",
                    "&:hover": { color: "#f5c518" },
                  }}
                >
                  About Us
                </Box>
              </RouterLink>
            </Box>
          </Box>
        </Box>

        {/* Social links */}
        <Box className="footer-section follow-us" sx={{ minWidth: 180 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#f5c518",
              mb: 1,
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            Follow Us
          </Typography>
          <SocialLinks />
        </Box>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <Typography variant="body2" sx={{ color: "#666", m: 0 }}>
          © 2025 CritiCrew. All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}

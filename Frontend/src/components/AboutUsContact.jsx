import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "../contexts/ThemeContext";

function AboutUsContact() {
  const { theme } = useThemeContext();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 2, md: "40px" },
        mb: "60px",
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 3,
        flexDirection: { xs: "column", md: "row" },
        transition: "transform 0.3s ease",
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Box sx={{ flex: 1, p: { xs: 1, md: 3 } }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            color: theme.palette.text.primary,
            mb: 3,
            textAlign: "center",
            fontWeight: 600,
            wordWrap: "break-word",

          }}
        >
          Contact Us
        </Typography>


        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: theme.palette.text.primary,
              mb: 2,
              wordWrap: "break-word",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <strong>Email:</strong> hello@criticrew.com
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: theme.palette.text.primary,
              mb: 2,
              wordWrap: "break-word",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <strong>Location:</strong> San Francisco, CA
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              color: theme.palette.text.secondary,
              mb: 2,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Follow us on social media for the latest updates and film
            discussions:
          </Typography>

          <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              justifyContent: "center",
              alignItems: "center",
              color: theme.palette.text.secondary,
              textAlign: "center",

            }}
          >
            <li>Twitter: @CritiCrew</li>
            <li>Instagram: @CritiCrew</li>
            <li>Facebook: /CritiCrew</li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AboutUsContact;

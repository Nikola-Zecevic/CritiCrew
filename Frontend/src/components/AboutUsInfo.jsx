import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AboutUsSection from "./AboutUsSection";
import AboutUsContact from "./AboutUsContact";
import { useThemeContext } from "../contexts/ThemeContext";

function AboutUsInfo() {
  const { theme } = useThemeContext();

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 3 },
        fontFamily: "Arial, sans-serif",
        color: theme.palette.text.primary,
        lineHeight: 1.6,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          fontSize: { xs: "2rem", md: "2.5rem" },
          mb: { xs: 3, md: 4 },
          color: theme.palette.mode === "dark" ? "#ffdf5e" : "#e6b800",
          position: "relative",
          pb: 2,
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            height: 4,
            background: `linear-gradient(90deg, ${
              theme.palette.mode === "dark" ? "#ffeb99" : "#ffe066"
            }, ${theme.palette.mode === "dark" ? "#eebe00" : "#ffbf00"})`,
            borderRadius: 2,
            display: "block",
          },
        }}
      >
        About Us
      </Typography>

      <AboutUsSection
        imageLink="/images/cinema.jpg"
        reverse={false}
        section="first"
      />
      <AboutUsSection
        imageLink="/images/cinemappl.jpeg"
        reverse={true}
        section="second"
      />
      <AboutUsContact />
    </Box>
  );
}

export default AboutUsInfo;

import React from "react";
import Box from "@mui/material/Box";
import AboutUsText from "./AboutUsText";
import { useThemeContext } from "../contexts/ThemeContext";

function AboutUsSection({ imageLink, reverse = false, section }) {
  const { theme } = useThemeContext();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 3, md: 5 },
        mb: { xs: 4, md: 6 },
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.paper
            : theme.palette.background.default,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        flexDirection: { xs: "column", md: reverse ? "row-reverse" : "row" },
        transition: "transform 0.3s ease",
        "&:hover": { transform: { md: "translateY(-5px)" } },
      }}
    >
      <AboutUsText section={section} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={imageLink}
          alt="Cinema"
          sx={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>
    </Box>
  );
}

export default AboutUsSection;

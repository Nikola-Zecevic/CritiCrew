import React from "react";
import Box from "@mui/material/Box";
import AboutUsText from "./AboutUsText";
import { useThemeContext } from "../contexts/ThemeContext";

function AboutUsSection({ imageLink, reverse = false, section }) {
  const { mode } = useThemeContext();

  const bgColor = mode === "dark" ? "#2c2c2c" : "#f0f0f0";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "40px",
        marginBottom: "60px",
        padding: "20px",
        borderRadius: "10px",
        background: bgColor,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        flexDirection: reverse ? "row-reverse" : "row",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
        },
        "@media (max-width: 768px)": {
          flexDirection: "column",
        },
      }}
    >
      <AboutUsText section={section} mode={mode} />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: "10px",
        }}
      >
        <img
          src={imageLink}
          alt="Cinema"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>
    </Box>
  );
}

export default AboutUsSection;

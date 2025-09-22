import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AboutUsSection from "./AboutUsSection";
import AboutUsContact from "./AboutUsContact";

function AboutUsInfo() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        lineHeight: 1.6,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          fontSize: "2.5rem",
          marginBottom: "2rem",
          color: "#ffdf5e",
          position: "relative",
          paddingBottom: "15px",
          "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            height: 4,
            background: "linear-gradient(90deg, #ffeb99, #eebe00)",
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

import React from "react";
import { Instagram, Twitter, YouTube } from "@mui/icons-material";
import { Box, IconButton, useTheme } from "@mui/material";

const socialMedia = [
  { name: "Instagram", url: "https://www.instagram.com", icon: <Instagram /> },
  { name: "X", url: "https://www.x.com", icon: <Twitter /> }, // Using Twitter icon for X
  { name: "YouTube", url: "https://www.youtube.com", icon: <YouTube /> },
];

export default function SocialLinks() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {socialMedia.map((social) => (
        <IconButton
          key={social.name}
          component="a"
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme.palette.text.secondary,
            transition: "transform 0.2s ease, color 0.2s ease",
            "&:hover": {
              color: theme.palette.primary.main,
              transform: "scale(1.1)",
            },
          }}
        >
          {social.icon}
        </IconButton>
      ))}
    </Box>
  );
}

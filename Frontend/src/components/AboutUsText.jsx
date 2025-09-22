import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "../contexts/ThemeContext";

function AboutUsText({ section }) {
  const { mode } = useThemeContext();

  const texts = {
    first: [
      "We're a small team of film enthusiasts who believe a great movie is more than entertainment—it's a shared experience that brings people together. It all started with our own movie nights, where we saw how powerful stories could spark laughter, debate, and create lasting memories.",
      "Our mission is simple: to cut through the endless options and help you discover films you'll genuinely love. We're not critics—we're your knowledgeable movie-going friends who want to share the magic of cinema with you.",
    ],
    second: [
      "We're real people who pour our passion into this project. Our content comes from genuine enjoyment and thoughtful analysis—we celebrate great filmmaking and offer honest perspectives.",
      "Movies are a conversation that doesn't end when the credits roll. Join our community, share your thoughts, and let's discover great films together.",
    ],
  };

  return (
    <Box sx={{ flex: 1, padding: "20px" }}>
      {texts[section].map((text, index) => (
        <Typography
          key={index}
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            color: mode === "dark" ? "#FFD700" : "#000000", // GOLD in dark, BLACK in light
          }}
        >
          {text}
        </Typography>
      ))}
    </Box>
  );
}

export default AboutUsText;

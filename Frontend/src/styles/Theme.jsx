import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
    },
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#757575",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#121212",
    },
    text: {
      primary: "#FFD700",
    },
    primary: {
      main: "#FFD700",
    },
    secondary: {
      main: "#ffeb3b",
    },
  },
});

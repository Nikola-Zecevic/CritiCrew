import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../styles/Theme";

const ThemeContext = createContext();

export const ThemeProviderContext = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode" || "dark");
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline></CssBaseline>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
export const useThemeContext = () => useContext(ThemeContext);

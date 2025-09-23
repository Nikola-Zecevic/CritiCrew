import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./router/App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProviderContext } from "./contexts/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <ThemeProviderContext>
        <App />
      </ThemeProviderContext>
    </StrictMode>
  </AuthProvider>
);

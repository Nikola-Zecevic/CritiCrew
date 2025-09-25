import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import apiService from "../../services/apiService";
import { Alert, Snackbar } from "@mui/material";
import "../../styles/Authentication.css";

export default function AuthenticationPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    if (mode === "login") {
      const identifier = form.get("identifier");
      const password = form.get("password");

      const result = login(identifier, password);
      if (result.success) {
        navigate("/");
      } else {
        showNotification(result.message, "error");
      }
    } else {
      // Handle signup
      try {
        const userData = {
          name: form.get("name"),
          surname: form.get("surname"),
          address: form.get("address") || null,
          email: form.get("email"),
          username: form.get("username"),
          password: form.get("password"), // Backend will hash this
        };

        console.log("🔐 Registering new user...", { ...userData, password: "[HIDDEN]" });
        
        const newUser = await apiService.registerUser(userData);
        console.log("✅ User registered successfully:", newUser);
        
        showNotification("Account created successfully! Please login.", "success");
        setTimeout(() => {
          navigate("/auth?mode=login");
        }, 2000);
        
      } catch (error) {
        console.error("❌ Registration failed:", error);
        showNotification(
          error.message || "Registration failed. Please try again.",
          "error"
        );
      }
    }
  }

  return (
    <>
      <AuthForm mode={mode} onSubmit={handleSubmit} />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import apiService from "../../services/apiService";
import { Alert, Snackbar } from "@mui/material";
import "../../styles/Authentication.css";

export default function AuthenticationPage() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    
    const form = new FormData(e.target);

    if (mode === "login") {
      const username = form.get("username");
      const password = form.get("password");

      const result = await login(username, password);
      if (result.success) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(result.message);
      }
    } else {
      // Handle signup with backend schema
      const userData = {
        username: form.get("username"),
        password: form.get("password"),
        email: form.get("email"),
        name: form.get("name"),
        surname: form.get("surname"),
        address: form.get("address") || null,
      };

      console.log("🔐 Registering new user...", { ...userData, password: "[HIDDEN]" });
      
      const result = await register(userData);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate("/auth?mode=login");
        }, 2000);
      } else {
        setError(result.message);
      }
    }
    
    setFormLoading(false);
  }

  return (
    <>
      <AuthForm 
        mode={mode} 
        onSubmit={handleSubmit} 
        loading={formLoading || loading}
        error={error}
        success={success}
      />
      
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

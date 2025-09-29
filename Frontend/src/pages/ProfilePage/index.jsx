import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";

export default function ProfilePage() {
  const { currentUser, isAuthenticated, updateUser, logout, loading } =
    useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/auth?mode=login", { replace: true });
        return;
      }
      setUsername(currentUser?.username || currentUser?.name || "");
    }
  }, [loading, isAuthenticated, currentUser, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !currentUser) return null;

  async function handleUpdateUsername(e) {
    e.preventDefault();
    const newName = (username || "").trim();
    if (!newName) {
      alert("Username cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      updateUser(currentUser.id, { username: newName });
      alert("Username updated.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const pw = (newPassword || "").trim();
    if (!pw) {
      alert("Password cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      updateUser(currentUser.id, { password: pw });
      setNewPassword("");
      alert("Password changed.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        borderRadius: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Typography>
        <strong>Username:</strong> {currentUser.username}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <strong>Role:</strong> {currentUser.role}
      </Typography>

      <Box component="form" onSubmit={handleUpdateUsername} sx={{ mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Change Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={saving}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={saving}>
            Update Username
          </Button>
        </Stack>
      </Box>

      <Box component="form" onSubmit={handleChangePassword} sx={{ mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={saving}
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={saving}>
            Change Password
          </Button>
        </Stack>
      </Box>

      <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
        Logout
      </Button>
    </Paper>
  );
}

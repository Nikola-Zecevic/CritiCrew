// src/pages/ManageUsers/index.jsx
import React from "react";
import { Container, Box, Typography } from "@mui/material";
import UsersTable from "../../components/UsersTable";
import NotificationSnackbar from "../../components/NotificationSnackbar";
import { useAuth } from "../../contexts/AuthContext";

export default function ManageUsers() {
  const { isAuthenticated, isSuperadmin } = useAuth();
  const [notification, setNotification] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  // If the route was reached, user is already authenticated.
  // Ensure only superadmin sees the content (router also protects this).
  if (!isAuthenticated || !isSuperadmin) {
    return null;
  }

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
          Manage Users
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Promote, demote, and manage user accounts
        </Typography>
      </Box>

      <Container sx={{ mt: 4 }}>
        <UsersTable showNotification={showNotification} />
      </Container>

      <NotificationSnackbar
        notification={notification}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}

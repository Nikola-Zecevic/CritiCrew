import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Box,
  Typography,
} from "@mui/material";

// Import our components
import UsersTable from "../../components/UsersTable";
import NotificationSnackbar from "../../components/NotificationSnackbar";

export default function ManageUsers() {
  const { currentUser, isAuthenticated, isSuperadmin } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Redirect non-superadmin users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!isSuperadmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isSuperadmin, navigate]);

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Don't render anything if not superadmin - let the useEffect handle redirection
  if (!isAuthenticated || !isSuperadmin) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: "primary.main", 
        color: "primary.contrastText", 
        py: 3,
        textAlign: "center"
      }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Users
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Promote, demote, and manage user accounts
        </Typography>
      </Box>

      <Container sx={{ mt: 4 }}>
        {/* Users Management */}
        <UsersTable showNotification={showNotification} />
      </Container>

      {/* Notification Snackbar */}
      <NotificationSnackbar
        notification={notification}
        onClose={handleCloseNotification}
      />
    </Box>
  );
}
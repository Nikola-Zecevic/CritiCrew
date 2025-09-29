import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminUserManagement from '../../components/AdminUserManagement';
import { Box, Typography, Alert } from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';

export default function AdminPage() {
  const { isAdmin, isSuperadmin, currentUser } = useAuth();
  const { theme } = useThemeContext();

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">
          Access denied. You need administrator privileges to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          Welcome, {currentUser.name || currentUser.username}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Role: {isSuperadmin ? 'Super Administrator' : 'Administrator'}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        {isSuperadmin && <AdminUserManagement />}
        
        {isAdmin && !isSuperadmin && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">
              As an admin, you have access to moderate reviews and manage movies. 
              Only superadmins can manage users.
            </Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
}
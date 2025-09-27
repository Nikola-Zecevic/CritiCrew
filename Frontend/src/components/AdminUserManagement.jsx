import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward as PromoteIcon,
  ArrowDownward as DemoteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

export default function AdminUserManagement() {
  const { getAllUsers, promoteUser, demoteUser, deleteUser, isSuperadmin } = useAuth();
  const { theme } = useThemeContext();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [promoteDialog, setPromoteDialog] = useState({ open: false, user: null });
  const [demoteDialog, setDemoteDialog] = useState({ open: false, user: null });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.users);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (user) => {
    setActionLoading(user.id);
    setError('');
    setSuccess('');
    
    const result = await promoteUser(user.id);
    if (result.success) {
      setSuccess(`${user.username} promoted to admin successfully!`);
      await loadUsers(); // Refresh the list
    } else {
      setError(result.message);
    }
    
    setActionLoading(null);
    setPromoteDialog({ open: false, user: null });
  };

  const handleDemote = async (user) => {
    setActionLoading(user.id);
    setError('');
    setSuccess('');
    
    const result = await demoteUser(user.id);
    if (result.success) {
      setSuccess(`${user.username} demoted to regular user successfully!`);
      await loadUsers(); // Refresh the list
    } else {
      setError(result.message);
    }
    
    setActionLoading(null);
    setDemoteDialog({ open: false, user: null });
  };

  const handleDelete = async (user) => {
    setActionLoading(user.id);
    setError('');
    setSuccess('');
    
    const result = await deleteUser(user.id);
    if (result.success) {
      setSuccess(`${user.username} deleted successfully!`);
      await loadUsers(); // Refresh the list
    } else {
      setError(result.message);
    }
    
    setActionLoading(null);
    setDeleteDialog({ open: false, user: null });
  };

  const getRoleColor = (role) => {
    switch (role?.name) {
      case 'superadmin':
        return 'error';
      case 'admin':
        return 'warning';
      default:
        return 'default';
    }
  };

  const canPromote = (user) => {
    return isSuperadmin && user.role?.name !== 'admin' && user.role?.name !== 'superadmin';
  };

  const canDemote = (user) => {
    return isSuperadmin && user.role?.name === 'admin';
  };

  const canDelete = (user) => {
    return isSuperadmin && user.role?.name !== 'superadmin';
  };

  if (!isSuperadmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only superadmins can manage users.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadUsers}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Username</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name} {user.surname}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role?.name || 'user'}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {canPromote(user) && (
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => setPromoteDialog({ open: true, user })}
                              disabled={actionLoading === user.id}
                              title="Promote to Admin"
                            >
                              <PromoteIcon />
                            </IconButton>
                          )}
                          
                          {canDemote(user) && (
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => setDemoteDialog({ open: true, user })}
                              disabled={actionLoading === user.id}
                              title="Demote to User"
                            >
                              <DemoteIcon />
                            </IconButton>
                          )}
                          
                          {canDelete(user) && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, user })}
                              disabled={actionLoading === user.id}
                              title="Delete User"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                          
                          {actionLoading === user.id && (
                            <CircularProgress size={16} />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Promote Dialog */}
      <Dialog open={promoteDialog.open} onClose={() => setPromoteDialog({ open: false, user: null })}>
        <DialogTitle>Promote User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to promote <strong>{promoteDialog.user?.username}</strong> to admin?
            This will give them administrative privileges.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromoteDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handlePromote(promoteDialog.user)}
            color="success"
            variant="contained"
          >
            Promote
          </Button>
        </DialogActions>
      </Dialog>

      {/* Demote Dialog */}
      <Dialog open={demoteDialog.open} onClose={() => setDemoteDialog({ open: false, user: null })}>
        <DialogTitle>Demote User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to demote <strong>{demoteDialog.user?.username}</strong> to regular user?
            This will remove their administrative privileges.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDemoteDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDemote(demoteDialog.user)}
            color="warning"
            variant="contained"
          >
            Demote
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteDialog.user?.username}</strong>?
            This action cannot be undone and will permanently remove all user data including reviews.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.user)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
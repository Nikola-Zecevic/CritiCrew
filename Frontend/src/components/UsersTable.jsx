import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UsersTable = ({ showNotification }) => {
  const { updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users from localStorage/JSON file
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem("usersData");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          setUsers(parsedUsers);
        } else {
          // If no stored users, load from imported JSON
          import('../apis/users.json').then(data => {
            setUsers(data.default || []);
          });
        }
      } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [showNotification]);

  const handleRoleChange = (userId, newRole) => {
    try {
      // Update user role
      updateUser(userId, { role: newRole });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      showNotification(`User role updated to ${newRole}`, 'success');
    } catch (error) {
      console.error('Error updating user role:', error);
      showNotification('Failed to update user role', 'error');
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin':
        return 'error';
      case 'admin':
        return 'warning';
      case 'regular':
      case 'user':
        return 'primary';
      case 'guest':
        return 'default';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    return role?.charAt(0).toUpperCase() + role?.slice(1) || 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader 
        title={`Users Management (${users.length})`}
        subheader="Manage user roles and permissions"
        avatar={<PeopleIcon />}
      />
      <CardContent>
        {users.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            py={4}
            sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
          >
            <PeopleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No users found
            </Typography>
            <Typography color="text.secondary" align="center">
              Users will appear here when they register
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      ID
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Username
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Current Role
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {user.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.username || user.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {user.role !== 'regular' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleRoleChange(user.id, 'regular')}
                            sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                          >
                            Make Regular
                          </Button>
                        )}
                        {user.role !== 'admin' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() => handleRoleChange(user.id, 'admin')}
                            sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                          >
                            Make Admin
                          </Button>
                        )}
                        {user.role !== 'superadmin' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleRoleChange(user.id, 'superadmin')}
                            sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                          >
                            Make Superadmin
                          </Button>
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
  );
};

export default UsersTable;
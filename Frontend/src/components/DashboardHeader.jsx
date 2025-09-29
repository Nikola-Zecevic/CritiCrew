import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Movie as MovieIcon,
} from '@mui/icons-material';

const DashboardHeader = ({ title = "Movie Dashboard", subtitle = "Admin Panel" }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <MovieIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2">
          {subtitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
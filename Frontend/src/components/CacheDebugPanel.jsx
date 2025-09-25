import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import moviesService from '../services/moviesService';

const CacheDebugPanel = () => {
  const [cacheInfo, setCacheInfo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateCacheInfo = () => {
    const info = moviesService.getCacheInfo();
    setCacheInfo(info);
  };

  useEffect(() => {
    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    try {
      await moviesService.refreshCache();
      updateCacheInfo();
    } catch (error) {
      console.error('Failed to refresh cache:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearCache = () => {
    moviesService.clearCache();
    updateCacheInfo();
  };

  const formatTime = (ms) => {
    if (!ms) {
      return 'N/A';
    }
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}m ${seconds}s`;
  };

  if (!cacheInfo) {
    return null;
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        position: 'fixed', 
        top: 80, 
        right: 20, 
        p: 2, 
        minWidth: 250,
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        zIndex: 1000
      }}
    >
      <Typography variant="h6" gutterBottom>
        🎬 Cache Debug
      </Typography>
      
      <Box mb={2}>
        <Typography variant="body2">
          Status: {cacheInfo.hasCache ? '✅ Active' : '❌ Empty'}
        </Typography>
        <Typography variant="body2">
          Size: {cacheInfo.cacheSize} movies
        </Typography>
        <Typography variant="body2">
          Valid: {cacheInfo.isValid ? '✅ Fresh' : '❌ Expired'}
        </Typography>
        <Typography variant="body2">
          Age: {formatTime(cacheInfo.cacheAge)}
        </Typography>
        <Typography variant="body2">
          Expires in: {formatTime(cacheInfo.expiresIn)}
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexDirection="column">
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleRefreshCache}
          disabled={isRefreshing}
        >
          {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleClearCache}
          color="warning"
        >
          🗑️ Clear
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => moviesService.logCacheStats()}
        >
          📊 Log Stats
        </Button>
      </Box>
    </Paper>
  );
};

export default CacheDebugPanel;
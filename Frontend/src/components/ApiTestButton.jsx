import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import moviesService from '../services/moviesService';

const ApiTestButton = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testApiConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing API connection...');
      const movies = await moviesService.getAllMovies();
      
      if (movies && movies.length > 0) {
        setTestResult({
          success: true,
          message: `✅ API Working! Loaded ${movies.length} movies`,
          isFromApi: !movies.some(m => m.id === 1 && m.title === "The Shawshank Redemption") // Check if it's not fallback
        });
      } else {
        setTestResult({
          success: false,
          message: '❌ API returned empty data'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ API Failed: ${error.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 9999, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" gutterBottom>API Test</Typography>
      
      <Button 
        variant="contained" 
        onClick={testApiConnection} 
        disabled={testing}
        size="small"
      >
        {testing ? '🔄 Testing...' : '🧪 Test API'}
      </Button>
      
      {testResult && (
        <Alert 
          severity={testResult.success ? 'success' : 'error'} 
          sx={{ mt: 1, fontSize: '0.8rem' }}
        >
          {testResult.message}
          {testResult.isFromApi === false && (
            <>
              <br />
              <small>📦 Using fallback data</small>
            </>
          )}
          {testResult.isFromApi === true && (
            <>
              <br />
              <small>🌐 Using live API data</small>
            </>
          )}
        </Alert>
      )}
    </Box>
  );
};

export default ApiTestButton;
import React from 'react';
import { Typography, Box } from '@mui/material';

const FormatChatMessage = ({ content }) => {
  if (!content) {
    return null;
  }

  // Split content by line breaks and process each part
  const parts = content.split('\n').map((line, index) => {
    // Skip empty lines at the beginning but preserve them elsewhere for spacing
    if (line.trim() === '') {
      return <Box key={index} sx={{ height: '8px' }} />;
    }

    // Remove any markdown-style bullets and format
    let cleanLine = line.trim();
    
    // Clean up common markdown artifacts
    cleanLine = cleanLine.replace(/^[-*+]\s*/, ''); // Remove bullet points
    cleanLine = cleanLine.replace(/^\d+\.\s*/, ''); // Remove numbered lists
    cleanLine = cleanLine.replace(/^\s*>\s*/, ''); // Remove blockquotes
    cleanLine = cleanLine.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold markdown
    cleanLine = cleanLine.replace(/\*(.*?)\*/g, '$1'); // Remove italic markdown

    // If the line starts with a movie title pattern (could be bold or have special chars)
    if (cleanLine.includes(':') && !cleanLine.includes('?')) {
      const [title, ...descParts] = cleanLine.split(':');
      const description = descParts.join(':').trim();
      
      if (title && description) {
        return (
          <Box key={index} sx={{ mb: 1.5 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                mb: 0.5
              }}
            >
              🎬 {title.trim()}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.5,
                pl: 2
              }}
            >
              {description}
            </Typography>
          </Box>
        );
      }
    }

    // Regular text line
    return (
      <Typography 
        key={index} 
        variant="body2" 
        sx={{ 
          mb: cleanLine.length > 50 ? 1 : 0.5,
          lineHeight: 1.5,
          color: 'text.primary'
        }}
      >
        {cleanLine}
      </Typography>
    );
  });

  return <Box>{parts}</Box>;
};

export default FormatChatMessage;
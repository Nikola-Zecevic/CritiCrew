import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Fab,
  Fade,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import FormatChatMessage from './FormatChatMessage';
import {
  Chat,
  Send,
  Close,
  Movie,
  SmartToy,
  Clear,
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import chatBotService, { listAvailableGeminiModels } from '../services/chatBotService';
import apiService from '../services/apiService';

export default function ChatBot() {
  const { theme } = useThemeContext();
  const { isAuthenticated, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const messagesEndRef = useRef(null);

  // Load user data and movies
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all movies
        const moviesData = await apiService.getMovies();
        setAllMovies(moviesData || []);

        // Load user favorites if authenticated
        if (isAuthenticated) {
          try {
            const favoritesData = await apiService.getFavorites();
            console.log('🔍 ChatBot Favorites Debug:', {
              isAuthenticated,
              currentUser,
              favoritesData,
              favoritesLength: favoritesData?.length,
              favoritesType: typeof favoritesData,
              isArray: Array.isArray(favoritesData)
            });
            
            // Extract the favorites array from the response object
            const favoritesArray = favoritesData?.favorites || [];
            console.log('🎬 Extracted Favorites:', favoritesArray);
            setUserFavorites(favoritesArray);
          } catch (error) {
            console.log('Could not load favorites:', error);
          }
        } else {
          console.log('🔍 User not authenticated, skipping favorites load');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (isOpen) {
      loadData();
      // Check available models for debugging
      listAvailableGeminiModels();
    }
  }, [isOpen, isAuthenticated]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        content: `🎬 Hello${currentUser?.name ? ` ${currentUser.name}` : ''}! I'm CritiCrew AI, your movie companion!

I can help you with:
🎯 Movie recommendations based on your favorites
🔍 Find movies from plot descriptions  
🎭 Share movie quotes and trivia
🎪 Suggest movies by genre or mood

What movie topic interests you today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentUser]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('📊 ChatBot Debug:', {
        favorites: userFavorites,
        movies: allMovies,
        favoritesType: typeof userFavorites,
        moviesType: typeof allMovies,
        favoritesIsArray: Array.isArray(userFavorites),
        moviesIsArray: Array.isArray(allMovies)
      });
      
      const result = await chatBotService.generateResponse(
        userMessage.content,
        userFavorites,
        allMovies
      );

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: result.success ? result.response : result.error,
        timestamp: new Date(),
        isError: !result.success,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an unexpected error. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action) => {
    let prompt = '';
    switch (action) {
      case 'recommend':
        prompt = 'Recommend some movies based on my favorites';
        break;
      case 'genre':
        prompt = 'Suggest some good action movies';
        break;
      case 'quotes':
        prompt = 'Give me some famous movie quotes';
        break;
      case 'random':
        prompt = 'Recommend a random movie I should watch tonight';
        break;
      default:
        return;
    }
    
    setInputValue(prompt);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const clearChat = () => {
    setMessages([]);
    chatBotService.clearHistory();
    // Re-add welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: `🎬 Chat cleared! I'm ready to help you discover amazing movies. What would you like to know?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  // Check if API is configured
  const isConfigured = chatBotService.isConfigured();

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {isOpen ? <Close /> : <Chat />}
      </Fab>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 400 },
            height: { xs: 'calc(100vh - 200px)', sm: 600 },
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SmartToy />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              CritiCrew AI
            </Typography>
            <IconButton
              size="small"
              onClick={clearChat}
              sx={{ color: 'inherit' }}
              title="Clear Chat"
            >
              <Clear />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
              title="Close Chat"
            >
              <Close />
            </IconButton>
          </Box>

          {!isConfigured && (
            <Alert severity="warning" sx={{ m: 1 }}>
              Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.
            </Alert>
          )}

          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 1,
              bgcolor: theme.palette.background.default,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    bgcolor: message.type === 'user' 
                      ? theme.palette.primary.main
                      : message.isError
                      ? theme.palette.error.light
                      : theme.palette.background.paper,
                    color: message.type === 'user'
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    borderRadius: 2,
                  }}
                >
                  {message.type === 'bot' ? (
                    <FormatChatMessage content={message.content} />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.content}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.7,
                      textAlign: message.type === 'user' ? 'right' : 'left',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">
                      Thinking...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <>
              <Divider />
              <Box sx={{ p: 1 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                  Quick actions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip
                    size="small"
                    icon={<Movie />}
                    label="Recommendations"
                    onClick={() => handleQuickAction('recommend')}
                    clickable
                  />
                  <Chip
                    size="small"
                    label="Action Movies"
                    onClick={() => handleQuickAction('genre')}
                    clickable
                  />
                  <Chip
                    size="small"
                    label="Movie Quotes"
                    onClick={() => handleQuickAction('quotes')}
                    clickable
                  />
                  <Chip
                    size="small"
                    label="Random Pick"
                    onClick={() => handleQuickAction('random')}
                    clickable
                  />
                </Box>
              </Box>
            </>
          )}

          {/* Input Area */}
          <Box
            sx={{
              p: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about movies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || !isConfigured}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !isConfigured}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  minHeight: 40,
                  flexShrink: 0,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&:disabled': {
                    bgcolor: theme.palette.action.disabled,
                  },
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
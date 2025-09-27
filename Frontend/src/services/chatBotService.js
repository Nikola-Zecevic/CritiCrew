import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Utility: List available Gemini models for the current API key
export async function listAvailableGeminiModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('Available Gemini models:', data);
    return data;
  } catch (error) {
    console.error('Error listing Gemini models:', error);
    return null;
  }
}

class ChatBotService {
  constructor() {
    this.conversationHistory = [];
  }

  // Movie-focused system prompt
  getSystemPrompt(userFavorites = [], allMovies = []) {
    // Ensure userFavorites and allMovies are arrays
    const favoritesArray = Array.isArray(userFavorites) ? userFavorites : [];
    const moviesArray = Array.isArray(allMovies) ? allMovies : [];
    
    console.log('🎭 System Prompt Debug:', {
      originalFavorites: userFavorites,
      originalMovies: allMovies,
      favoritesArray,
      moviesArray,
      favoritesCount: favoritesArray.length,
      moviesCount: moviesArray.length,
      sampleFavorite: favoritesArray[0],
      sampleMovie: moviesArray[0]
    });
    
    // Just use movie titles, no additional details
    const favoriteTitles = favoritesArray.map(fav => fav.title).join(', ');
    const favoritesContext = favoritesArray.length > 0 ? `\nUser's favorites: ${favoriteTitles}` : '';
    return `You are a movie expert assistant. Answer movie questions directly and naturally.${favoritesContext}`;
  }

  // Generate movie recommendations based on user input
  async generateResponse(userMessage, userFavorites = [], allMovies = []) {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      console.log('🤖 ChatBot Service Debug:', {
        userFavorites: userFavorites,
        allMovies: allMovies,
        favoritesType: typeof userFavorites,
        moviesType: typeof allMovies,
        favoritesIsArray: Array.isArray(userFavorites),
        moviesIsArray: Array.isArray(allMovies)
      });

      const systemPrompt = this.getSystemPrompt(userFavorites, allMovies);
      
      // Create a simple prompt combining system context and user message
      const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 250,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('🤖 Sending request to Gemini API...');
      
      const response = await axios.post(GEMINI_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('✅ Gemini API Response:', response.data);
      console.log('� Token Usage:', response.data?.usageMetadata);
      console.log('�🔍 Response Structure Debug:', {
        candidates: response.data?.candidates,
        candidatesLength: response.data?.candidates?.length,
        firstCandidate: response.data?.candidates?.[0],
        candidateKeys: response.data?.candidates?.[0] ? Object.keys(response.data.candidates[0]) : [],
        content: response.data?.candidates?.[0]?.content,
        parts: response.data?.candidates?.[0]?.content?.parts,
        firstPart: response.data?.candidates?.[0]?.content?.parts?.[0],
        // Try to log the complete first candidate
        fullFirstCandidate: JSON.stringify(response.data?.candidates?.[0], null, 2)
      });

      // Check for different response formats and finish reasons
      const candidate = response.data?.candidates?.[0];
      const finishReason = candidate?.finishReason;
      
      console.log('🔄 Finish Reason:', finishReason);
      
      let aiResponse = null;
      
      // Check for content in different locations
      if (candidate?.content?.parts?.[0]?.text) {
        aiResponse = candidate.content.parts[0].text;
      } else if (candidate?.content?.parts?.[0]) {
        // Check if there's any content in the part even without text property
        console.log('🔍 Checking part content:', candidate.content.parts[0]);
        aiResponse = candidate.content.parts[0].text || candidate.content.parts[0].content || null;
      } else if (candidate?.output) {
        aiResponse = candidate.output;
      } else if (candidate?.text) {
        aiResponse = candidate.text;
      }

      // Handle MAX_TOKENS case - but first check if we got partial content
      if (finishReason === 'MAX_TOKENS') {
        if (aiResponse) {
          aiResponse += "\n\n(Response was truncated due to length limits)";
        } else {
          aiResponse = "I apologize, but my response was cut off due to length limits. Could you please ask a more specific question?";
        }
      }

      if (aiResponse) {
        // Get favorites array for post-processing
        const favoritesArray = Array.isArray(userFavorites) ? userFavorites : [];
        
        // Add movie-themed formatting and emojis to the response
        let formattedResponse = aiResponse;
        
        // Add movie emoji if not present
        if (!formattedResponse.includes('🎬') && !formattedResponse.includes('🎭') && !formattedResponse.includes('🍿')) {
          formattedResponse = '🎬 ' + formattedResponse;
        }
        
        // Add some movie-related context if the response is very short
        if (formattedResponse.length < 100 && favoritesArray.length > 0) {
          formattedResponse += `\n\n💫 Based on your favorites: ${favoritesArray.map(fav => fav.title).join(', ')}`;
        }
        
        // Store conversation history (simplified for now)
        this.conversationHistory.push({
          userMessage,
          aiResponse: formattedResponse,
          timestamp: new Date()
        });

        // Keep conversation history manageable (last 10 exchanges)
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = this.conversationHistory.slice(-10);
        }

        return {
          success: true,
          response: formattedResponse,
        };
      } else {
        console.error('❌ Unexpected response format:', response.data);
        console.error('❌ Could not find text in any expected location');
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      let errorMessage = 'Sorry, I encountered an issue. Please try again.';
      
      if (error.message === 'Gemini API key not configured') {
        errorMessage = 'API key not configured. Please add your Gemini API key to the .env file.';
      } else if (error.response?.status === 400) {
        const details = error.response?.data?.error?.message || '';
        errorMessage = `Request error: ${details}. Please try rephrasing your question.`;
      } else if (error.response?.status === 403) {
        errorMessage = 'API key invalid or access denied. Please check your Gemini API key.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Model not found. Your API key may not have access to this model.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try asking a shorter question.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Get movie recommendations based on favorites
  async getMovieRecommendations(userFavorites = [], allMovies = []) {
    const favoriteGenres = [...new Set(userFavorites.map(fav => fav.genre))].join(', ');
    const favoriteMovies = userFavorites.map(fav => fav.title).join(', ');
    
    let prompt = `🎬 Movie Recommendation Request:`;
    
    if (favoriteMovies) {
      prompt += `\nBased on my favorite movies: ${favoriteMovies}`;
      if (favoriteGenres) {
        prompt += `\nFavorite genres: ${favoriteGenres}`;
      }
      prompt += `\n\nPlease recommend 5 movies I might enjoy, with brief explanations of why each recommendation fits my taste.`;
    } else {
      prompt += `\nI'm new to the platform and haven't marked any favorites yet. Please recommend 5 popular, highly-rated movies across different genres to help me get started.`;
    }
    
    return await this.generateResponse(prompt, userFavorites, allMovies);
  }

  // Find movie by plot description
  async findMovieByPlot(plotDescription, allMovies = []) {
    const prompt = `🔍 Plot-to-Movie Search:
    
Plot Description: "${plotDescription}"

Please identify which movie this plot describes. If you're confident about the match, provide:
1. Movie title and year
2. Brief confirmation of why it matches
3. Additional details like director or main actors

If you're not certain, provide 2-3 possible matches with explanations.`;

    return await this.generateResponse(prompt, [], allMovies);
  }

  // Get movie quotes
  async getMovieQuotes(movieTitle) {
    const prompt = `🎭 Movie Quotes Request:

Movie: "${movieTitle}"

Please provide 3-5 memorable quotes from this movie. For each quote:
1. The exact quote
2. Which character said it
3. Brief context if helpful

Format them nicely with proper attribution.`;

    return await this.generateResponse(prompt);
  }

  // Get genre-based recommendations
  async getGenreRecommendations(genre, allMovies = []) {
    const genreMovies = allMovies.filter(movie => 
      movie.genre?.toLowerCase().includes(genre.toLowerCase())
    ).slice(0, 10);

    const prompt = `🎯 Genre-Based Recommendations:

Genre: "${genre}"

Please recommend excellent ${genre} movies. Focus on:
1. Classic must-watch films in this genre
2. Hidden gems or underrated movies
3. Recent acclaimed releases
4. Brief explanation of what makes each special

Provide 5-7 recommendations with variety in time periods and subgenres.`;

    return await this.generateResponse(prompt, [], genreMovies);
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Check if API key is configured
  isConfigured() {
    return !!GEMINI_API_KEY;
  }
}

// Create and export singleton instance
const chatBotService = new ChatBotService();
export default chatBotService;
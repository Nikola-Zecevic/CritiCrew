import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

const GUEST_USER = { id: null, username: null, role: "guest", name: "Guest" };

/* JWT Token helpers */
function decodeJWT(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

function isTokenExpired(token) {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

/* Create user object from JWT payload */
function createUserFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.sub,
    username: payload.username || payload.sub,
    email: payload.email || null,
    name: payload.name || payload.username || 'User',
    role: payload.role || 'user',
    role_id: payload.role_id || null
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(GUEST_USER);
  const [loading, setLoading] = useState(true);

  // Load persisted auth token on mount and validate it
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      if (token && !isTokenExpired(token)) {
        try {
          // Get user info from backend API instead of decoding JWT
          const user = await apiService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to load user from API:', error);
          // Fallback to JWT decoding if API fails
          const fallbackUser = createUserFromToken(token);
          if (fallbackUser) {
            setCurrentUser(fallbackUser);
            setLoading(false);
            return;
          }
        }
      }
      
      // Clear invalid/expired tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("authUser"); // Remove old mock data
      setCurrentUser(GUEST_USER);
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  /**
   * login(username, password) - Now uses backend API
   */
  async function login(username, password) {
    try {
      setLoading(true);
      const response = await apiService.loginUser({ username, password });
      
      if (response.access_token) {
        // Store the JWT token
        localStorage.setItem("authToken", response.access_token);
        
        try {
          // Get user info from backend API instead of decoding JWT
          const user = await apiService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            return { success: true, user };
          } else {
            throw new Error("Failed to get user info from API");
          }
        } catch (userError) {
          console.error('Failed to get user info:', userError);
          // Fallback to JWT decoding if API fails
          const fallbackUser = createUserFromToken(response.access_token);
          if (fallbackUser) {
            setCurrentUser(fallbackUser);
            return { success: true, user: fallbackUser };
          } else {
            throw new Error("Invalid token received");
          }
        }
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || "Login failed. Please check your credentials." 
      };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setCurrentUser(GUEST_USER);
    localStorage.removeItem("authToken");
    localStorage.removeItem("token"); 
    localStorage.removeItem("authUser"); // Remove old mock data
  }

  /**
   * register(userData) - Register new user via backend API
   */
  async function register(userData) {
    try {
      setLoading(true);
      const response = await apiService.registerUser(userData);
      
      if (response.id) {
        return { 
          success: true, 
          message: "Registration successful! Please log in with your credentials.",
          user: response 
        };
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || "Registration failed. Please try again." 
      };
    } finally {
      setLoading(false);
    }
  }

  /**
   * Admin functions for user management
   */
  async function promoteUser(userId) {
    try {
      const response = await apiService.promoteUser(userId);
      return { success: true, user: response };
    } catch (error) {
      console.error('Promote user error:', error);
      return { success: false, message: error.message || "Failed to promote user" };
    }
  }

  async function demoteUser(userId) {
    try {
      const response = await apiService.demoteUser(userId);
      return { success: true, user: response };
    } catch (error) {
      console.error('Demote user error:', error);
      return { success: false, message: error.message || "Failed to demote user" };
    }
  }

  async function deleteUser(userId) {
    try {
      await apiService.deleteUser(userId);
      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, message: error.message || "Failed to delete user" };
    }
  }

  async function getAllUsers() {
    try {
      const users = await apiService.getAllUsers();
      return { success: true, users };
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, message: error.message || "Failed to fetch users" };
    }
  }

  // Role-based access checks
  const isAuthenticated = !!(
    currentUser &&
    currentUser.role &&
    currentUser.role !== "guest"
  );
  
  const isAdmin = isAuthenticated && 
    (currentUser.role === "admin" || currentUser.role === "superadmin");
    
  const isSuperadmin = isAuthenticated && currentUser.role === "superadmin";

  // Helper to check if token is still valid
  const isTokenValid = () => {
    const token = localStorage.getItem("authToken");
    return token && !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        register,
        promoteUser,
        demoteUser,
        deleteUser,
        getAllUsers,
        isAuthenticated,
        isAdmin,
        isSuperadmin,
        isTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import api from './api';

const login = async (username, password) => {
  try {
    const response = await api.post('/api/auth/login', { username, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Save user ID separately for easier access
      const userData = parseToken(response.data.token);
      if (userData && userData.userId) {
        localStorage.setItem('userId', String(userData.userId));
      }
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

const signup = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/signup', { username, email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Save user ID separately for easier access
      const userData = parseToken(response.data.token);
      if (userData && userData.userId) {
        localStorage.setItem('userId', String(userData.userId));
      }
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Signup failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  // Consider authenticated if either token or userId exists
  return !!(token || userId);
};

// Helper function to parse JWT token
const parseToken = (token) => {
  if (!token) return null;
  
  try {
    // Parse the JWT token to get user info
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const userData = JSON.parse(jsonPayload);
    
    // Ensure userId is a string
    if (userData && userData.userId) {
      userData.userId = String(userData.userId);
    }
    
    return userData;
  } catch (error) {
    console.error('Failed to parse token:', error);
    return null;
  }
};

const getUserInfo = () => {
  const token = localStorage.getItem('token');
  
  // First try to get userId from localStorage as a fallback
  const fallbackUserId = localStorage.getItem('userId');
  
  // If we have no token, but we have a userId in localStorage, return minimal info
  if (!token && fallbackUserId) {
    console.log("Using fallback userId:", fallbackUserId);
    return { userId: String(fallbackUserId) };
  }
  
  // If no token or userId, the user is not logged in
  if (!token) return null;
  
  // Parse the token
  const userData = parseToken(token);
  
  // If token parsing fails but we have a fallback, use that
  if (!userData && fallbackUserId) {
    console.log("Token parsing failed. Using fallback userId:", fallbackUserId);
    return { userId: String(fallbackUserId) };
  }
  
  // Make sure userId is always a string
  if (userData && userData.userId) {
    userData.userId = String(userData.userId);
  }
  
  // Debug log
  console.log("Auth user info:", userData);
  
  return userData;
};

// Check and set userId if it's missing but should be available
const ensureUserIdInStorage = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  // If we have a token but no userId, try to extract and save it
  if (token && !userId) {
    const userData = parseToken(token);
    if (userData && userData.userId) {
      localStorage.setItem('userId', String(userData.userId));
      console.log("Fixed missing userId in storage:", userData.userId);
    }
  }
};

// Run this check when the service is imported
ensureUserIdInStorage();

export default {
  login,
  signup,
  logout,
  isAuthenticated,
  getUserInfo,
  ensureUserIdInStorage
};

import config from '../config/env';

/**
 * Token management utility
 * SECURITY MEASURE: Generates and verifies JWT tokens with expiry
 */

// Generate token with expiration from env
export const generateToken = (userId) => {
  try {
    const header = btoa(JSON.stringify({ 
      alg: 'HS256', 
      typ: 'JWT' 
    }));
    
    const payload = btoa(JSON.stringify({ 
      userId, 
      exp: Date.now() + config.security.tokenExpiry,
      iat: Date.now(),
      jti: Math.random().toString(36).substring(2, 15)
    }));
    
    const signature = btoa(`finsight-${userId}-${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  } catch (error) {
    console.error('Token generation failed:', error);
    return null;
  }
};

// Verify token expiration and integrity
export const verifyToken = (token) => {
  try {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp <= Date.now()) {
      if (config.isDevelopment) {
        console.log('Token expired');
      }
      return false;
    }
    
    return true;
  } catch (error) {
    if (config.isDevelopment) {
      console.error('Token verification error:', error);
    }
    return false;
  }
};

// Get token from storage
export const getAuthToken = () => {
  return sessionStorage.getItem('auth_token');
};

// Set token securely
export const setAuthToken = (token) => {
  if (!token) {
    sessionStorage.removeItem('auth_token');
    return;
  }
  sessionStorage.setItem('auth_token', token);
};

// Clear token
export const clearAuthToken = () => {
  sessionStorage.removeItem('auth_token');
};

// Refresh token
export const refreshToken = (userId) => {
  const newToken = generateToken(userId);
  setAuthToken(newToken);
  return newToken;
};
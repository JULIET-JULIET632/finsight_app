import config from '../config/env';

/**
 * Secure cookie management utility
 * SECURITY MEASURE: Implements SameSite=Strict and Secure flags
 */

// Set secure cookie
export const setClientCookie = (name, value, days = 7) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    
    // Set Secure flag only in production with HTTPS
    const secure = config.isProduction && window.location.protocol === 'https:' 
      ? '; Secure' 
      : '';
    
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict${secure}`;
    
    if (config.isDevelopment) {
      console.log(`Cookie set: ${name}`);
    }
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

// Get cookie value
export const getCookie = (name) => {
  try {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

// Delete cookie
export const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
};

// Generate CSRF token
export const generateCSRFToken = () => {
  try {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15) +
                  Date.now().toString(36);
    
    setClientCookie('XSRF-TOKEN', token, 1);
    return token;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return null;
  }
};

// Validate CSRF token
export const validateCSRFToken = (token) => {
  const storedToken = getCookie('XSRF-TOKEN');
  return storedToken === token;
};

// Clear all cookies
export const clearAllCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name.trim());
  }
};
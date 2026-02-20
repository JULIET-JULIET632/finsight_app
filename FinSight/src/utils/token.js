// Simple token generation (in production, use server-side JWT)
export const generateToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 3600000, // 1 hour
    iat: Date.now() 
  }));
  const signature = btoa(Math.random().toString(36).substring(2));
  return `${header}.${payload}.${signature}`;
};

// Verify token (client-side basic check)
export const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
};

// Get token from storage
export const getAuthToken = () => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};

// Set token securely
export const setAuthToken = (token, remember = false) => {
  if (remember) {
    localStorage.setItem('auth_token', token);
  } else {
    sessionStorage.setItem('auth_token', token);
  }
};
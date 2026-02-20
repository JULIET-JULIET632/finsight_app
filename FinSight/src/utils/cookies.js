// Set secure cookie with httpOnly flag (can only be set server-side)
// This is a client-side helper for document.cookie (non-httpOnly)
export const setClientCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict${secure}`;
};

// Get cookie value
export const getCookie = (name) => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

// Delete cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Generate CSRF token
export const generateCSRFToken = () => {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  setClientCookie('XSRF-TOKEN', token, 1);
  return token;
};
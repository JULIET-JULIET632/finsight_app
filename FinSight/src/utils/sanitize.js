import DOMPurify from 'dompurify';
import config from '../config/env';

/**
 * Input sanitization utility
 * SECURITY MEASURE: Prevents XSS attacks
 */

// Configure DOMPurify
DOMPurify.setConfig({
  ALLOWED_TAGS: [], // Strip all HTML tags
  ALLOWED_ATTR: [], // Strip all attributes
  FORBID_TAGS: ['style', 'script', 'iframe', 'frame', 'embed', 'object'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
});

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  try {
    // Strip all HTML tags and attributes
    const sanitized = DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    
    // Additional encoding for special characters
    return sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  } catch (error) {
    if (config.isDevelopment) {
      console.error('Sanitization error:', error);
    }
    return '';
  }
};

// Sanitize form data object
export const sanitizeFormData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

// Sanitize numeric input
export const sanitizeNumeric = (value) => {
  if (!value) return '';
  // Remove anything that's not a digit
  return value.replace(/[^\d]/g, '');
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (international format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Encode for HTML attributes
export const encodeForAttribute = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

// Encode for URL
export const encodeForURL = (value) => {
  if (!value) return '';
  return encodeURIComponent(value);
};
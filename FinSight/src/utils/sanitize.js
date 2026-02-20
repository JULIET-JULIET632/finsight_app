import DOMPurify from 'dompurify';

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }); // Strip all HTML tags
};

// Sanitize form data object
export const sanitizeFormData = (data) => {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    sanitized[key] = sanitizeInput(data[key]);
  });
  return sanitized;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Sanitize and validate numeric input
export const sanitizeNumeric = (value) => {
  if (!value) return '';
  return value.replace(/[^0-9]/g, '');
};
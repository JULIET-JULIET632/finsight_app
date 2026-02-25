/**
 * Environment configuration utility
 * Centralizes access to environment variables with fallbacks
 * SECURITY MEASURE: Validates required variables in production
 */

const config = {
  // API Configuration
  api: {
    url: process.env.REACT_APP_API_URL || 'https://api.finsight.com',
    version: process.env.REACT_APP_API_VERSION || 'v1',
    baseUrl: () => {
      const base = config.api.url;
      const version = config.api.version;
      return version ? `${base}/${version}` : base;
    },
  },

  // Feature Flags
  features: {
    aiRecommendations: process.env.REACT_APP_ENABLE_AI_RECOMMENDATIONS === 'true',
    simulations: process.env.REACT_APP_ENABLE_SIMULATIONS === 'true',
    devMode: process.env.REACT_APP_DEV_MODE === 'true',
  },

  // Security Settings
  security: {
    tokenExpiry: parseInt(process.env.REACT_APP_TOKEN_EXPIRY || '3600000', 10),
    sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '1800000', 10),
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// SECURITY MEASURE: Validate required environment variables in production
const validateConfig = () => {
  if (!config.isProduction) return;

  const requiredVars = [
    'REACT_APP_API_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

validateConfig();

// SECURITY MEASURE: Freeze config to prevent modifications
Object.freeze(config);

export default config;
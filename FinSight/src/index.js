import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import config from './config/env';

// SECURITY MEASURE: Disable console in production
if (config.isProduction) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}

// SECURITY MEASURE: Log environment info in development
if (config.isDevelopment) {
  console.log('🔧 FinSight running in development mode');
  console.log('📡 API URL:', config.api.url);
  console.log('🚀 Features:', {
    aiRecommendations: config.features.aiRecommendations,
    simulations: config.features.simulations,
    devMode: config.features.devMode,
  });
}

// SECURITY MEASURE: Add global error handler
window.addEventListener('error', (event) => {
  if (config.isProduction) {
    // In production, log to monitoring service
    console.error('Global error caught:', event.error);
    // Prevent default error handling
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (config.isProduction) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
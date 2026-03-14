import { useState, useCallback } from 'react';
import { simulateStrategy } from '../services/api';
import { getAuthToken } from '../utils/token';
import { generateCSRFToken } from '../utils/cookies';
import config from '../config/env';

/**
 * Custom hook for strategy simulation
 * Handles API calls, loading states, and errors
 */
export const useSimulation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  const runSimulation = useCallback(async (originalData, adjustments) => {
    setLoading(true);
    setError(null);

    try {
      // SECURITY: Verify authentication
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // SECURITY: Generate new CSRF token
      generateCSRFToken();

      // Call API
      const result = await simulateStrategy(originalData, adjustments);

      // SECURITY: Validate response structure
      if (!result || result.status !== 'success') {
        throw new Error('Invalid response from server');
      }

      // Store in session storage for later use
      sessionStorage.setItem('simulationResult', JSON.stringify(result));
      
      setSimulationResult(result);
      return result;
    } catch (err) {
      // SECURITY: User-friendly error message
      const errorMessage = config.isDevelopment 
        ? err.message 
        : 'Unable to complete simulation. Please try again.';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear simulation data
  const clearSimulation = useCallback(() => {
    setSimulationResult(null);
    setError(null);
    sessionStorage.removeItem('simulationResult');
  }, []);

  return {
    loading,
    error,
    simulationResult,
    runSimulation,
    clearSimulation,
  };
};
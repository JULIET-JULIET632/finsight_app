import { useState, useCallback } from 'react';
import { diagnoseBusiness } from '../services/api';
import { getAuthToken } from '../utils/token';
import { generateCSRFToken } from '../utils/cookies';
import config from '../config/env';

/**
 * Custom hook for business diagnosis
 * Handles API calls, loading states, and errors
 */
export const useDiagnosis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const runDiagnosis = useCallback(async (formData) => {
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
      const result = await diagnoseBusiness(formData);

      // SECURITY: Validate response structure
      if (!result || result.status !== 'success') {
        throw new Error('Invalid response from server');
      }

      // Store in session storage for later use
      sessionStorage.setItem('diagnosisResult', JSON.stringify(result));
      
      setDiagnosisResult(result);
      return result;
    } catch (err) {
      // SECURITY: User-friendly error message
      const errorMessage = config.isDevelopment 
        ? err.message 
        : 'Unable to complete diagnosis. Please try again.';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear diagnosis data
  const clearDiagnosis = useCallback(() => {
    setDiagnosisResult(null);
    setError(null);
    sessionStorage.removeItem('diagnosisResult');
  }, []);

  return {
    loading,
    error,
    diagnosisResult,
    runDiagnosis,
    clearDiagnosis,
  };
};
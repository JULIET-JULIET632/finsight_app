import { useState, useCallback } from 'react';
import { getCoachAdvice, downloadReport } from '../services/api';
import { getAuthToken } from '../utils/token';
import { generateCSRFToken } from '../utils/cookies';
import config from '../config/env';

/**
 * Custom hook for AI coach
 * Handles API calls, loading states, and errors
 */
export const useCoach = () => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [coachAdvice, setCoachAdvice] = useState(null);

  const getAdvice = useCallback(async (simulationResult) => {
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
      const result = await getCoachAdvice(simulationResult);

      // SECURITY: Validate response structure
      if (!result || !result.action_steps) {
        throw new Error('Invalid response from server');
      }

      // Store in session storage for later use
      sessionStorage.setItem('coachAdvice', JSON.stringify(result));
      
      setCoachAdvice(result);
      return result;
    } catch (err) {
      // SECURITY: User-friendly error message
      const errorMessage = config.isDevelopment 
        ? err.message 
        : 'Unable to get coach advice. Please try again.';
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPDFReport = useCallback(async (coachData) => {
    setDownloading(true);
    setError(null);

    try {
      // SECURITY: Verify authentication
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // SECURITY: Generate new CSRF token
      generateCSRFToken();

      // Get PDF blob
      const blob = await downloadReport(coachData);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finsight-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      // SECURITY: User-friendly error message
      const errorMessage = config.isDevelopment 
        ? err.message 
        : 'Unable to download report. Please try again.';
      
      setError(errorMessage);
      throw err;
    } finally {
      setDownloading(false);
    }
  }, []);

  // Clear coach data
  const clearCoachAdvice = useCallback(() => {
    setCoachAdvice(null);
    setError(null);
    sessionStorage.removeItem('coachAdvice');
  }, []);

  return {
    loading,
    downloading,
    error,
    coachAdvice,
    getAdvice,
    downloadPDFReport,
    clearCoachAdvice,
  };
};
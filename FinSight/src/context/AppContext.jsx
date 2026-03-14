import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAuthToken, verifyToken } from '../utils/token';
import { generateCSRFToken } from '../utils/cookies';
import config from '../config/env';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  diagnosisData: null,
  simulationData: null,
  coachData: null,
  currency: 'NGN',
  currencySymbol: '₦',
  businessSector: '',
};

// Action types
const ACTIONS = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DIAGNOSIS_DATA: 'SET_DIAGNOSIS_DATA',
  SET_SIMULATION_DATA: 'SET_SIMULATION_DATA',
  SET_COACH_DATA: 'SET_COACH_DATA',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_BUSINESS_SECTOR: 'SET_BUSINESS_SECTOR',
  CLEAR_ALL: 'CLEAR_ALL',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
        loading: false,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ACTIONS.SET_DIAGNOSIS_DATA:
      return {
        ...state,
        diagnosisData: action.payload,
      };
    case ACTIONS.SET_SIMULATION_DATA:
      return {
        ...state,
        simulationData: action.payload,
      };
    case ACTIONS.SET_COACH_DATA:
      return {
        ...state,
        coachData: action.payload,
      };
    case ACTIONS.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload.currency,
        currencySymbol: action.payload.symbol,
      };
    case ACTIONS.SET_BUSINESS_SECTOR:
      return {
        ...state,
        businessSector: action.payload,
      };
    case ACTIONS.CLEAR_ALL:
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // SECURITY: Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = getAuthToken();
        const isValid = token && verifyToken(token);
        
        dispatch({
          type: ACTIONS.SET_AUTHENTICATED,
          payload: isValid,
        });

        // Load stored data if authenticated
        if (isValid) {
          // SECURITY: Generate CSRF token
          generateCSRFToken();

          // Load from session storage
          const storedDiagnosis = sessionStorage.getItem('diagnosisResult');
          const storedSimulation = sessionStorage.getItem('simulationResult');
          const storedCoach = sessionStorage.getItem('coachAdvice');
          const storedCurrency = sessionStorage.getItem('currency');
          const storedSymbol = sessionStorage.getItem('currencySymbol');
          const storedSector = sessionStorage.getItem('businessSector');

          if (storedDiagnosis) {
            dispatch({
              type: ACTIONS.SET_DIAGNOSIS_DATA,
              payload: JSON.parse(storedDiagnosis),
            });
          }

          if (storedSimulation) {
            dispatch({
              type: ACTIONS.SET_SIMULATION_DATA,
              payload: JSON.parse(storedSimulation),
            });
          }

          if (storedCoach) {
            dispatch({
              type: ACTIONS.SET_COACH_DATA,
              payload: JSON.parse(storedCoach),
            });
          }

          if (storedCurrency && storedSymbol) {
            dispatch({
              type: ACTIONS.SET_CURRENCY,
              payload: { currency: storedCurrency, symbol: storedSymbol },
            });
          }

          if (storedSector) {
            dispatch({
              type: ACTIONS.SET_BUSINESS_SECTOR,
              payload: storedSector,
            });
          }
        }
      } catch (error) {
        if (config.isDevelopment) {
          console.error('Session verification failed:', error);
        }
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: 'Session verification failed',
        });
      }
    };

    verifySession();
  }, []);

  // Actions
  const setAuthenticated = (status) => {
    dispatch({ type: ACTIONS.SET_AUTHENTICATED, payload: status });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const setDiagnosisData = (data) => {
    sessionStorage.setItem('diagnosisResult', JSON.stringify(data));
    dispatch({ type: ACTIONS.SET_DIAGNOSIS_DATA, payload: data });
  };

  const setSimulationData = (data) => {
    sessionStorage.setItem('simulationResult', JSON.stringify(data));
    dispatch({ type: ACTIONS.SET_SIMULATION_DATA, payload: data });
  };

  const setCoachData = (data) => {
    sessionStorage.setItem('coachAdvice', JSON.stringify(data));
    dispatch({ type: ACTIONS.SET_COACH_DATA, payload: data });
  };

  const setCurrency = (currency, symbol) => {
    sessionStorage.setItem('currency', currency);
    sessionStorage.setItem('currencySymbol', symbol);
    dispatch({ type: ACTIONS.SET_CURRENCY, payload: { currency, symbol } });
  };

  const setBusinessSector = (sector) => {
    sessionStorage.setItem('businessSector', sector);
    dispatch({ type: ACTIONS.SET_BUSINESS_SECTOR, payload: sector });
  };

  const clearAll = () => {
    sessionStorage.clear();
    dispatch({ type: ACTIONS.CLEAR_ALL });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setAuthenticated,
        setError,
        setDiagnosisData,
        setSimulationData,
        setCoachData,
        setCurrency,
        setBusinessSector,
        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
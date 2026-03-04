import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeInput } from '../utils/sanitize';
import { getCookie, generateCSRFToken } from '../utils/cookies';
import { getAuthToken, verifyToken } from '../utils/token';
import { useAppContext } from '../context/AppContext';
import { useCoach } from '../hooks/useCoach';
import downloadScoreAsPDF from '../utils/download';

const AICoachScreen = () => {
  const navigate = useNavigate();
  const { simulationData, diagnosisData, currency, currencySymbol } = useAppContext();
  const { loading: coachLoading, error: coachError, getAdvice, downloadPDFReport } = useCoach();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [isDownloadHovered, setIsDownloadHovered] = useState(false);
  const [isAssessmentHovered, setIsAssessmentHovered] = useState(false);
  
  const [actionSteps, setActionSteps] = useState([]);
  const [growthTips, setGrowthTips] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [sector, setSector] = useState('');
  const [currencySym, setCurrencySym] = useState('$');

  // SECURITY MEASURE 1: Authentication check on mount
  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = getAuthToken();
        if (!token || !verifyToken(token)) {
          setError('Your session has expired. Please start over.');
          setTimeout(() => navigate('/welcome'), 3000);
          return;
        }

        const csrfToken = getCookie('XSRF-TOKEN');
        if (!csrfToken) {
          generateCSRFToken();
        }

        // Load simulation data
        const storedSimulation = sessionStorage.getItem('simulationResult');
        const storedDiagnosis = sessionStorage.getItem('diagnosisResult');
        const storedSector = sessionStorage.getItem('businessSector') || '';
        const storedCurrency = sessionStorage.getItem('currencySymbol') || '$';
        
        setCurrencySym(storedCurrency);
        setSector(storedSector);

        // Get final score from simulation data
        if (simulationData) {
          setFinalScore(simulationData.final_score);
        } else if (storedSimulation) {
          const parsed = JSON.parse(storedSimulation);
          setFinalScore(parsed.final_score);
        }

        setIsAuthenticated(true);
      } catch (err) {
        setError('Authentication failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [navigate, simulationData]);

  // SECURITY MEASURE 2: Fetch coach advice using useCoach hook
  useEffect(() => {
    const fetchCoachAdvice = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        
        // Prepare payload from simulation data
        const storedSimulation = sessionStorage.getItem('simulationResult');
        const simulationResult = simulationData || (storedSimulation ? JSON.parse(storedSimulation) : null);
        
        if (!simulationResult) {
          // Fallback to static data if no simulation
          setActionSteps([
            "Focus on reducing your single highest-cost expense within the next 30 days.",
            "Increase monthly revenue by 10% before taking on additional debt.",
            "Build a minimum cash reserve equivalent to 2 months of operating expenses."
          ]);
          setGrowthTips([
            "Negotiate longer payment terms with your top 3 suppliers this quarter.",
            "Audit your product/service pricing against current market rates.",
            "Join a local business association for access to group purchasing and training."
          ]);
          setIsLoading(false);
          return;
        }

        // Call the coach API using the hook
        const result = await getAdvice(simulationResult);
        
        setActionSteps(result.action_steps || []);
        setGrowthTips(result.growth_tips || []);
        setCoachData(result);
        
      } catch (err) {
        console.error('Coach API failed:', err);
        // Fallback to static data
        setActionSteps([
          "Focus on reducing your single highest-cost expense within the next 30 days.",
          "Increase monthly revenue by 10% before taking on additional debt.",
          "Build a minimum cash reserve equivalent to 2 months of operating expenses."
        ]);
        setGrowthTips([
          "Negotiate longer payment terms with your top 3 suppliers this quarter.",
          "Audit your product/service pricing against current market rates.",
          "Join a local business association for access to group purchasing and training."
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoachAdvice();
  }, [isAuthenticated, simulationData, getAdvice]);

  // SECURITY MEASURE 3: Handle download with fallback to local PDF generation
  const handleDownloadPDF = async () => {
    if (!isAuthenticated) {
      setError('Please authenticate before downloading');
      return;
    }

    setIsDownloading(true);
    generateCSRFToken();
    
    try {
      // Try API first
      try {
        const reportData = {
          sector: sector,
          final_score: finalScore,
          currency: currency || 'USD',
          action_steps: actionSteps,
          growth_tips: growthTips,
        };
        
        await downloadPDFReport(reportData);
        console.log('PDF downloaded successfully via API');
      } catch (apiErr) {
        console.log('API download failed, using local PDF generation', apiErr);
        // Fallback to local PDF generation
        downloadScoreAsPDF(
          finalScore || 64,
          sector || 'Business',
          new Date().toLocaleDateString(),
          { actionSteps, growthTips }
        );
      }
    } catch (err) {
      console.error('Download failed:', err);
      // Ultimate fallback
      downloadScoreAsPDF(
        finalScore || 64,
        sector || 'Business',
        new Date().toLocaleDateString(),
        { actionSteps, growthTips }
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // SECURITY MEASURE 4: Handle new assessment
  const handleNewAssessment = () => {
    generateCSRFToken();
    // Clear session data but keep authentication
    sessionStorage.removeItem('formData');
    sessionStorage.removeItem('selectedItems');
    sessionStorage.removeItem('simulationData');
    sessionStorage.removeItem('simulationResult');
    sessionStorage.removeItem('coachAdvice');
    navigate('/business-info');
  };

  // SECURITY MEASURE 5: Loading state (combine local and hook loading)
  if (isLoading || coachLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <p className="text-center text-gray-500">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  // SECURITY MEASURE 6: Error state (combine local and hook error)
  if (error || coachError) {
    return (
      <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
        <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-500 mb-4">{error || coachError}</p>
            <button
              onClick={() => navigate('/welcome')}
              className="px-4 py-2 bg-[#2C6C71] text-white rounded-[10px]"
            >
              Go to Welcome
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DCE5E6] flex justify-center p-4" style={{ fontFamily: 'Poppins' }}>
      <div className="w-[395px] bg-white rounded-[30px] shadow-xl overflow-hidden relative">
        {/* SECURITY MEASURE 7: Back button with CSRF token */}
        <div className="absolute top-6 left-0 right-0 flex items-center justify-center z-10">
          <button 
            onClick={() => {
              generateCSRFToken();
              navigate('/updated-score');
            }}
            className="absolute left-4 text-xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
            style={{ fontSize: '24px', fontWeight: '300' }}
          >
            &lt;
          </button>
          <h1 className="text-xl font-semibold" style={{ color: '#01272B' }}>
            AI Coach Recommendations
          </h1>
        </div>

        <div className="px-5 pt-20 pb-6">
          {/* Subtitle */}
          <p className="text-xs text-gray-500 text-center mb-6">
            Personalised guidance based on your financial profile
          </p>

          {/* Projected Score Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-8 border-2" style={{ borderColor: '#D9D9D9' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#998F8F' }}>Projected Score</span>
              <span className="text-sm" style={{ color: '#EFB700' }}>Fairly Good</span>
            </div>
            <div className="text-left">
              <span className="text-3xl font-bold" style={{ color: '#EFB700' }}>{finalScore || 64}</span>
              <span className="text-xl text-gray-400">/100</span>
            </div>
          </div>

          {/* Action Steps Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6 border-2" style={{ borderColor: '#D9D9D9' }}>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Action Steps:</h2>
            <div className="space-y-3">
              {actionSteps.map((step, index) => (
                <p key={index} className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">{index + 1}.</span> {step}
                </p>
              ))}
            </div>
          </div>

          {/* Growth Tips Card */}
          <div className="bg-[#FFF8F8] rounded-[20px] p-5 mb-6 border-2" style={{ borderColor: '#D9D9D9' }}>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Growth Tips:</h2>
            <div className="space-y-3">
              {growthTips.map((tip, index) => (
                <p key={index} className="text-xs text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900">•</span> {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Disclaimer Text */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed mb-6 px-2">
            These recommendations are generated from your self-reported data. They do not constitute professional financial advice. Consult a qualified financial advisor before making major business decisions.
          </p>

          {/* Buttons Container */}
          <div className="space-y-3">
            {/* Download Report Button - NOW WITH FALLBACK */}
            <button
              onClick={handleDownloadPDF}
              onMouseEnter={() => setIsDownloadHovered(true)}
              onMouseLeave={() => setIsDownloadHovered(false)}
              disabled={!isAuthenticated || isDownloading}
              className="w-full font-semibold py-3 px-4 rounded-[10px] shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: isDownloadHovered ? '#1A4A4A' : '#2C6C71',
                color: 'white'
              }}
            >
              {isDownloading ? 'Downloading...' : 'Download Report'}
            </button>

            {/* Start New Assessment Button */}
            <button
              onClick={handleNewAssessment}
              onMouseEnter={() => setIsAssessmentHovered(true)}
              onMouseLeave={() => setIsAssessmentHovered(false)}
              disabled={!isAuthenticated}
              className="w-full font-semibold py-3 px-4 rounded-[15px] transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2"
              style={{ 
                backgroundColor: isAssessmentHovered ? '#F5F5F5' : 'white',
                color: '#2C6C71',
                borderColor: '#2C6C71',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              Start New Assessment
            </button>
          </div>

          {/* Bottom spacing */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AICoachScreen;
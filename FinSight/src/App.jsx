import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import BusinessInfoScreen from './pages/BusinessInfoScreen';
import ResultsDashboard from './pages/ResultsDashboard';
import SimulationSelectionScreen from './pages/SimulationSelectionScreen';
import SimulationScreen from './pages/SimulationScreen';
import UpdatedScoreScreen from './pages/UpdatedScoreScreen';
import AICoachScreen from './pages/AICoachScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/business-info" element={<BusinessInfoScreen />} />
        <Route path="/results" element={<ResultsDashboard />} />
        <Route path="/simulation-selection" element={<SimulationSelectionScreen />} />
        <Route path="/simulation" element={<SimulationScreen />} />
        <Route path="/updated-score" element={<UpdatedScoreScreen />} />
        <Route path="/ai-coach" element={<AICoachScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
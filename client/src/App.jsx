import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import PlacementPredictor from './pages/PlacementPredictor';
import ResumeOptimizer from './pages/ResumeOptimizer';
import RoadmapPage from './pages/RoadmapPage';
import LearningPage from './pages/LearningPage';
import InternshipsPage from './pages/InternshipsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AlumniPage from './pages/AlumniPage';
import ChatbotPage from './pages/ChatbotPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p style={{ color: 'var(--text-muted)' }} className="font-body">Loading your career dashboard...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
            toastStyle={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="placement" element={<PlacementPredictor />} />
              <Route path="resume" element={<ResumeOptimizer />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="internships" element={<InternshipsPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="alumni" element={<AlumniPage />} />
              <Route path="chatbot" element={<ChatbotPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

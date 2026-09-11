import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobsList from './pages/JobsList';
import JobCreate from './pages/JobCreate';
import ResumeUpload from './pages/ResumeUpload';
import CandidateScreening from './pages/CandidateScreening';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen flex items-center justify-center text-brand-600 font-bold">Initializing Application...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            
            {/* Job Routes */}
            <Route path="jobs" element={<JobsList />} />
            <Route path="jobs/create" element={<JobCreate />} />
            
            {/* Screening Routes */}
            <Route path="jobs/:jobId/upload" element={<ResumeUpload />} />
            <Route path="candidates/results" element={<CandidateScreening />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
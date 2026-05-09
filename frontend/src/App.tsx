import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import StudentDashboard from './pages/student/Dashboard';
import CollegeDashboard from './pages/college/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import JobManager from './pages/company/JobManager';
import TestBuilder from './pages/company/TestBuilder';
import CollegeDiscovery from './pages/company/CollegeDiscovery';
import PlacementRequests from './pages/company/PlacementRequests';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Role-Based Dashboard Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['COLLEGE']}>
                <CollegeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/jobs" 
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <JobManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/tests" 
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <TestBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/colleges" 
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <CollegeDiscovery />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/requests" 
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <PlacementRequests />
              </ProtectedRoute>
            } 
          />

          {/* Default Redirection */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

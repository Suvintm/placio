import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import StudentDashboard from './pages/student/Dashboard';
import CollegeDashboard from './pages/college/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Role-Based Dashboard Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/college/dashboard" element={<CollegeDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />

        {/* Fallback to Auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

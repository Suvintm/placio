import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

interface SignupViewProps {
  onSwitch: () => void;
}

import type { Role } from '../../context/AuthContext';

const SignupView: React.FC<SignupViewProps> = ({ onSwitch }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd get the email from the form state
    login('user@example.com', role);
    if (role) {
      const path = `/${role.toLowerCase()}/dashboard`;
      navigate(path);
    }
  };

  return (
    <div className="form-container">
      <div className="title-row">
        <h1 className="form-title">Create an account</h1>
        <img src={logo} alt="Placio" className="form-header-logo" />
      </div>
      <p className="form-subtitle">Select your profile type to begin the onboarding process.</p>

      <div className="role-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div 
          className={`role-card ${role === 'STUDENT' ? 'active' : ''}`}
          onClick={() => setRole('STUDENT')}
        >
          <div className="role-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h3 className="role-card-title">Student</h3>
          <div className="active-indicator">
            {role === 'STUDENT' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
        </div>

        <div 
          className={`role-card ${role === 'COLLEGE' ? 'active' : ''}`}
          onClick={() => setRole('COLLEGE')}
        >
          <div className="role-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21H21"></path>
              <path d="M5 21V7H19V21"></path>
              <path d="M9 21V17H15V21"></path>
            </svg>
          </div>
          <h3 className="role-card-title">College</h3>
          <div className="active-indicator">
            {role === 'COLLEGE' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
        </div>

        <div 
          className={`role-card ${role === 'COMPANY' ? 'active' : ''}`}
          onClick={() => setRole('COMPANY')}
        >
          <div className="role-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h3 className="role-card-title">Company</h3>
          <div className="active-indicator">
            {role === 'COMPANY' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </div>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="input-row">
          <div className="input-group">
            <label className="input-label">First Name</label>
            <input type="text" className="input-field" placeholder="John" required />
          </div>
          <div className="input-group">
            <label className="input-label">Last Name</label>
            <input type="text" className="input-field" placeholder="Doe" required />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">
            {role === 'STUDENT' ? 'University Email' : 'Work Email'}
          </label>
          <div className="input-field-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input type="email" className="input-field input-field-with-icon" placeholder="john@example.edu" required />
          </div>
        </div>

        {/* Role Specific Fields */}
        {role === 'STUDENT' && (
          <>
            <div className="input-group">
              <label className="input-label">College Code</label>
              <input type="text" className="input-field" placeholder="Enter unique code provided by TPO" required />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Branch</label>
                <select className="input-field">
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="MECH">Mechanical</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Batch Year</label>
                <input type="number" className="input-field" placeholder="2025" required />
              </div>
            </div>
          </>
        )}

        {role === 'COLLEGE' && (
          <>
            <div className="input-group">
              <label className="input-label">College Name</label>
              <input type="text" className="input-field" placeholder="e.g. MIT University" required />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Location</label>
                <input type="text" className="input-field" placeholder="City, State" required />
              </div>
              <div className="input-group">
                <label className="input-label">NAAC Grade</label>
                <select className="input-field">
                  <option value="A++">A++</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Affiliated University</label>
              <input type="text" className="input-field" placeholder="e.g. Mumbai University" required />
            </div>
          </>
        )}

        {role === 'COMPANY' && (
          <>
            <div className="input-group">
              <label className="input-label">Company Name</label>
              <input type="text" className="input-field" placeholder="e.g. Google" required />
            </div>
            <div className="input-group">
              <label className="input-label">Designation</label>
              <input type="text" className="input-field" placeholder="e.g. Senior HR Manager" required />
            </div>
          </>
        )}

        <div className="input-group">
          <label className="input-label">Password</label>
          <div className="input-field-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field input-field-with-icon" 
              placeholder="••••••••" 
              required 
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                )}
              </svg>
            </span>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Create Account 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? 
        <a href="#" className="auth-switch-link" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Sign In
        </a>
      </div>
    </div>
  );
};

export default SignupView;

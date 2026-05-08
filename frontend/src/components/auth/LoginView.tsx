import React, { useState } from 'react';

interface LoginViewProps {
  onSwitch: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-container">
      <h1 className="form-title">Welcome back</h1>
      <p className="form-subtitle">Enter your institutional credentials to continue.</p>

      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label className="input-label">Institutional Email</label>
          <div className="input-field-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input 
              type="email" 
              className="input-field input-field-with-icon" 
              placeholder="alex.sterling@university.edu" 
              required 
            />
          </div>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="input-label">Password</label>
            <a href="#" className="auth-switch-link" style={{ fontSize: '13px', marginBottom: '8px' }}>Forgot password?</a>
          </div>
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
          Sign In
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>

      <div className="auth-switch">
        New to CareerElite? 
        <a href="#" className="auth-switch-link" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Create an account
        </a>
      </div>
    </div>
  );
};

export default LoginView;

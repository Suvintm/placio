import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import '../../styles/auth_stepper.css';

interface LoginViewProps {
  onSwitch: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSwitch }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password, role);
      // navigation handled by useEffect
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  // We use a useEffect to navigate once the user is logged in
  const { user } = useAuth();
  React.useEffect(() => {
    if (user && user.role) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [user, navigate]);

  return (
    <div className="form-container">
      <div className="title-row">
        <h1 className="form-title">
          {role === 'STUDENT' ? 'Student' : role === 'COLLEGE' ? 'Institutional' : 'Corporate'} Login
        </h1>
        <img src={logo} alt="Placio" className="form-header-logo" />
      </div>
      <p className="form-subtitle">Enter your credentials to continue.</p>

      <div className="role-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className={`role-card ${role === 'STUDENT' ? 'active' : ''}`} onClick={() => setRole('STUDENT')}>
          <h3 className="role-card-title">Student</h3>
        </div>
        <div className={`role-card ${role === 'COLLEGE' ? 'active' : ''}`} onClick={() => setRole('COLLEGE')}>
          <h3 className="role-card-title">College</h3>
        </div>
        <div className={`role-card ${role === 'COMPANY' ? 'active' : ''}`} onClick={() => setRole('COMPANY')}>
          <h3 className="role-card-title">Company</h3>
        </div>
      </div>

      {error && <div className="auth-error-msg" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">Email Address</label>
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
              placeholder={role === 'STUDENT' ? 'student@domain.com' : 'official@domain.com'}
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
            <a href="#" className="forgot-password">Forgot password?</a>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
          {!isSubmitting && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
        </button>
      </form>

      <div className="auth-switch">
        New to Placio? 
        <a href="#" className="auth-switch-link" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Create an account
        </a>
      </div>
    </div>
  );
};

export default LoginView;

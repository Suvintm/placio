import React, { useState, useEffect } from 'react';
import LoginView from '../components/auth/LoginView';
import SignupView from '../components/auth/SignupView';
import '../styles/auth.css';

// Import banners
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import banner5 from '../assets/banner5.png';
import logo from '../assets/logo.png';

// Import company logos
import googleLogo from '../assets/google.png';
import metaLogo from '../assets/meta.png';
import microsoftLogo from '../assets/microsoft.png';
import oracleLogo from '../assets/oracle.png';
import cognizantLogo from '../assets/cognizant.png';
import swiggyLogo from '../assets/swiggy.png';
import uberLogo from '../assets/uber.png';
import zohoLogo from '../assets/zoho.png';
import zomatoLogo from '../assets/zomato.png';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = [banner5, banner4, banner3, banner2, banner1];
  const companyLogos = [
    googleLogo, metaLogo, microsoftLogo, oracleLogo, 
    cognizantLogo, swiggyLogo, uberLogo, zohoLogo, zomatoLogo
  ];

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img src={logo} alt="Placio Logo" className="auth-official-logo" />
        
        <div className="mobile-device">
          <div className="mobile-notch"></div>
          <div className="mobile-screen">
            <div 
              className="mobile-banner"
              style={{ backgroundImage: `url(${banners[currentBannerIndex]})` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        {/* Fixed Header for Mobile */}
        <div className="auth-fixed-header">
          <div className="header-top-row">
            <img src={logo} alt="Placio" className="mobile-header-logo" />
            <div className="auth-mode-toggle">
              <div 
                className={`toggle-option ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </div>
              <div 
                className={`toggle-option ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </div>
              <div className={`toggle-slider ${isLogin ? 'login-active' : 'signup-active'}`}></div>
            </div>
          </div>

          <div className="company-carousel-container">
            <p className="carousel-label">Trusted by industry leaders</p>
            <div className="company-carousel">
              <div className="company-track">
                {[...companyLogos, ...companyLogos].map((logoSrc, index) => (
                  <div key={index} className="company-logo-item">
                    <img src={logoSrc} alt="Partner Logo" className="partner-logo-img" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-scroll-container">
          {isLogin ? (
            <LoginView onSwitch={toggleAuth} />
          ) : (
            <SignupView onSwitch={toggleAuth} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

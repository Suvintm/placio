import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../styles/navbar.css';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <span className="menu-line line-long"></span>
          <span className="menu-line line-medium"></span>
          <span className="menu-line line-short"></span>
        </button>
        <img 
          src={logo} 
          alt="Placio" 
          className="nav-logo" 
          onClick={() => navigate('/')} 
        />
        
        <div className="nav-search-container">
          <span className="nav-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input 
            type="text" 
            className="nav-search-input" 
            placeholder="Search for roles, companies..." 
          />
        </div>
      </div>

      <div className="nav-right">
        <button className="nav-icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        <div className="nav-profile-container">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
            alt="Profile" 
            className="nav-profile-img" 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="dashboard-main-container">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <main className="dashboard-content" style={{ position: 'relative' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

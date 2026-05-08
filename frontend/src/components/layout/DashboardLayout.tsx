import React from 'react';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <main className="dashboard-content" style={{ paddingTop: '70px' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

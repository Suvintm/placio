import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const CollegeDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>College Dashboard</h1>
        <p>Welcome to the Placio college administration portal. Manage your students, verify company partnerships, and track placement statistics.</p>
      </div>
    </DashboardLayout>
  );
};

export default CollegeDashboard;

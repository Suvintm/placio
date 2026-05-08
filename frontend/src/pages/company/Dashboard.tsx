import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const CompanyDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Company Dashboard</h1>
        <p>Welcome to the Placio recruitment portal. Post job opportunities, connect with top talent, and manage your campus recruitment drives.</p>
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;

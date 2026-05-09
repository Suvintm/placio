import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import '../company/CompanyStyles.css';

const CollegeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [counts, setCounts] = useState({ requests: 0, students: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          fetch(`${API_URL}/college/profile`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/college/requests`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (requestsRes.ok) {
          const requests = await requestsRes.json();
          setCounts(prev => ({ ...prev, requests: requests.length }));
        }
      } catch (error) {
        console.error('Error fetching college dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const collegeName = profile?.profile?.institution_name || 'College';

  return (
    <DashboardLayout>
      <div className="premium-container">
        {/* Welcome Banner */}
        <div className="dashboard-banner" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="dashboard-banner-title">
              {collegeName} Dashboard 🎓
            </h1>
            <p className="dashboard-banner-text">
              Empower your students by connecting with top-tier companies. Manage drive requests and track career outcomes in real-time.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/college/requests')}
                className="premium-btn-primary"
                style={{ background: 'white', color: '#4f46e5', border: 'none' }}
              >
                View Drive Requests
              </button>
              <button 
                onClick={() => navigate('/college/students')}
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                Manage Students
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div className="premium-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{counts.requests}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Drive Requests</div>
              </div>
            </div>
          </div>
          <div className="premium-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{counts.students}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Registered Students</div>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-card" style={{ padding: '40px', textAlign: 'center', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Welcome to your Command Center</h3>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto 24px' }}>
            From here you can oversee the entire placement ecosystem. Use the sidebar to navigate through drive requests, student records, and analytics.
          </p>
          <button className="premium-btn-secondary" onClick={() => navigate('/college/settings')}>
            Complete College Profile
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollegeDashboard;

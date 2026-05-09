import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import './CompanyStyles.css';

interface CompanyProfileData {
  user: {
    email: string;
    full_name: string;
    role: string;
  };
  profile: {
    id: number;
    company_name: string;
    industry: string;
    website: string | null;
    hr_name: string;
    hr_phone: string | null;
    hr_designation: string | null;
  };
}

interface RecentActivity {
  id: number;
  title?: string;
  status?: string;
  type: 'JOB' | 'REQUEST';
  date: string;
}

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<CompanyProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [counts, setCounts] = useState({ jobs: 0, tests: 0, requests: 0, colleges: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Profile
        const profileRes = await fetch(`${API_URL}/company/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
        }

        // Fetch counts and activity
        const [jobsRes, testsRes, requestsRes, collegesRes] = await Promise.all([
          fetch(`${API_URL}/company/jobs`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/company/tests`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/company/requests`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/company/colleges`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const jobs = await jobsRes.json();
        const tests = await testsRes.json();
        const requests = await requestsRes.json();
        const colleges = await collegesRes.json();

        setCounts({
          jobs: jobs.length,
          tests: tests.length,
          requests: requests.length,
          colleges: colleges.length
        });

        // Consolidate recent activity
        const combinedActivity: RecentActivity[] = [
          ...jobs.slice(0, 3).map((j: any) => ({ id: j.id, title: j.title, type: 'JOB', date: j.created_at })),
          ...requests.slice(0, 3).map((r: any) => ({ id: r.id, status: r.status, type: 'REQUEST', date: r.created_at }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setRecentActivity(combinedActivity.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoadingProfile(false);
        setIsLoadingActivity(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: 'Active Job Listings', value: counts.jobs.toString(), icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#3b82f6' },
    { title: 'Aptitude Tests', value: counts.tests.toString(), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: '#8b5cf6' },
    { title: 'Sent Requests', value: counts.requests.toString(), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: '#f59e0b' },
    { title: 'Connected Colleges', value: counts.colleges.toString(), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: '#10b981' }
  ];

  const companyName = profileData?.profile?.company_name || 'Loading...';
  const companyEmail = profileData?.user?.email || user?.email || 'Loading...';
  const companyInitial = companyName !== 'Loading...' ? companyName.charAt(0).toUpperCase() : 'C';

  return (
    <DashboardLayout>
      <div className="premium-container">
        
        {/* Welcome Banner */}
        <div className="dashboard-banner">
          {/* Abstract SVG Background */}
          <svg style={{ position: 'absolute', right: '-10%', top: '-20%', width: '60%', height: '140%', opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.3C91,-33.5,97.2,-18.1,98.2,-2.3C99.2,13.5,95,29.8,85.2,43.3C75.4,56.8,60.1,67.5,43.9,76.5C27.7,85.5,10.6,92.8,-5.5,92.5C-21.6,92.2,-36.8,84.4,-51.2,74.7C-65.6,65,-79.1,53.4,-86.6,39.1C-94.1,24.8,-95.6,7.8,-92.9,-8.5C-90.2,-24.8,-83.3,-40.4,-72.4,-51.9C-61.5,-63.4,-46.6,-70.8,-32.1,-77.8C-17.6,-84.8,-3.5,-91.4,10.7,-93.6C24.9,-95.8,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="dashboard-banner-title">
              Welcome back, {companyName}! 👋
            </h1>
            <p className="dashboard-banner-text">
              Manage your recruitment ecosystem from one powerful dashboard. Discover top institutions and hire the best campus talent.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/company/jobs')}
                style={{ background: 'white', color: '#1e3a8a', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Post a Job
              </button>
              <button 
                onClick={() => navigate('/company/colleges')}
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              >
                Discover Colleges
              </button>
            </div>
          </div>
        </div>

        {/* Company Overview & Recent Activity Row (Now Second Position) */}
        <div className="dashboard-grid-2col">
          {/* Company Overview Card */}
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Profile Header Background */}
            <div style={{ height: '100px', background: 'linear-gradient(to right, #e0e7ff, #f3e8ff)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', color: '#059669', padding: '6px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></div>
                  Verified
                </div>
              </div>
            </div>
            
            <div style={{ padding: '0 24px 24px 24px', position: 'relative' }}>
              {isLoadingProfile ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading profile details...</div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-40px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', flexShrink: 0 }}>
                        <span style={{ fontSize: '40px', fontWeight: 800, color: '#3b82f6', background: '-webkit-linear-gradient(#1e3a8a, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {companyInitial}
                        </span>
                      </div>
                      <div style={{ paddingBottom: '8px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0' }}>{companyName}</h2>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>{profileData?.profile?.industry || 'Industry N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-details-grid">
                    <div className="profile-detail-item">
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>HR Contact</label>
                      <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 500 }}>{profileData?.profile?.hr_name || 'N/A'}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{profileData?.profile?.hr_designation || 'HR'}</div>
                    </div>
                    <div className="profile-detail-item">
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Contact Info</label>
                      <div style={{ fontSize: '14px', color: '#0f172a' }}>{companyEmail}</div>
                      <div style={{ fontSize: '14px', color: '#0f172a' }}>{profileData?.profile?.hr_phone || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    {profileData?.profile?.website && (
                      <a href={profileData.profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        Company Website
                      </a>
                    )}
                    <button className="premium-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => navigate('/company/settings')}>
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="premium-card">
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" fill="none" stroke="#3b82f6" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Recent Activity
            </h3>
            
            {isLoadingActivity ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading activity...</div>
            ) : recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>No recent activity to show.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivity.map((activity, index) => (
                  <div key={`${activity.type}-${activity.id}-${index}`} style={{ display: 'flex', gap: '12px', alignItems: 'start', paddingBottom: '12px', borderBottom: index < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: activity.type === 'JOB' ? '#eff6ff' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activity.type === 'JOB' ? '#3b82f6' : '#f59e0b', flexShrink: 0 }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {activity.type === 'JOB' ? (
                          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        ) : (
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        )}
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                        {activity.type === 'JOB' ? `New Job Posted: ${activity.title}` : `Drive Request Sent (${activity.status})`}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              className="premium-btn-secondary" 
              style={{ width: '100%', marginTop: '20px', fontSize: '13px' }}
              onClick={() => navigate(recentActivity[0]?.type === 'JOB' ? '/company/jobs' : '/company/requests')}
            >
              View All History
            </button>
          </div>
        </div>

        {/* Quick Stats Grid (Now Third Position) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="premium-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', lineHeight: '1.2' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{stat.title}</div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;

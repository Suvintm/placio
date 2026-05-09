import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import '../company/CompanyStyles.css';

interface PublishedJob {
  request_id: number;
  job: {
    id: number;
    title: string;
    description: string;
    skills_required: string;
  };
  company: {
    company_name: string;
    industry: string;
  };
  has_applied: boolean;
}

const StudentDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<PublishedJob[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          fetch(`${API_URL}/student/profile`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/student/jobs`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (jobsRes.ok) setJobs(await jobsRes.json());
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (jobId: number, requestId: number) => {
    try {
      const response = await fetch(`${API_URL}/student/jobs/${jobId}/apply?request_id=${requestId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setJobs(jobs.map(j => 
          j.job.id === jobId ? { ...j, has_applied: true } : j
        ));
        alert("Application submitted successfully!");
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  };

  const studentName = profile?.user?.full_name || 'Student';

  return (
    <DashboardLayout>
      <div className="premium-container">
        {/* Welcome Banner */}
        <div className="dashboard-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="dashboard-banner-title">
              Hello, {studentName}! 👋
            </h1>
            <p className="dashboard-banner-text">
              Your future starts here. Browse active placement drives from your college and take the next step in your career.
            </p>
          </div>
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" fill="none" stroke="#3b82f6" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Active Placement Drives
          </h2>

          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}><div className="loading-spinner"></div></div>
          ) : jobs.length === 0 ? (
            <div className="premium-card" style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: '#64748b' }}>No active placement drives found for your college at the moment.</p>
            </div>
          ) : (
            <div className="premium-grid">
              {jobs.map((item) => (
                <div key={item.job.id} className="premium-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {item.company.company_name.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{item.job.title}</h3>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{item.company.company_name}</span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.job.description}
                  </p>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="premium-btn-secondary" 
                      style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                      onClick={() => navigate(`/student/jobs/${item.job.id}?request_id=${item.request_id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="premium-btn-primary" 
                      style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                      disabled={item.has_applied}
                      onClick={() => handleApply(item.job.id, item.request_id)}
                    >
                      {item.has_applied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

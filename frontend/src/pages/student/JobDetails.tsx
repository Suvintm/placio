import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import '../company/CompanyStyles.css';

interface JobDetails {
  job: {
    id: number;
    job_id: string;
    title: string;
    description: string;
    skills_required: string;
    eligibility_criteria: string;
  };
  company: {
    company_name: string;
    industry: string;
    website: string | null;
  };
  application: {
    status: string;
  } | null;
  test: {
    id: number;
    title: string;
    description: string;
  } | null;
}

const StudentJobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get request_id from query params
  const searchParams = new URLSearchParams(location.search);
  const requestId = searchParams.get('request_id');

  const [details, setDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/student/jobs/${jobId}?request_id=${requestId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId && requestId) {
      fetchJobDetails();
    }
  }, [jobId, requestId]);

  const handleApply = async () => {
    try {
      const response = await fetch(`${API_URL}/student/jobs/${jobId}/apply?request_id=${requestId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDetails(prev => prev ? { ...prev, application: { status: 'APPLIED' } } : null);
        alert("Application submitted successfully!");
      }
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="premium-container" style={{ textAlign: 'center', padding: '100px' }}>
          <div className="loading-spinner"></div>
          <p>Loading job details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!details) {
    return (
      <DashboardLayout>
        <div className="premium-container">
          <div className="premium-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Job not found</h2>
            <button className="premium-btn-primary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="premium-container">
        <div style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '16px' }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h1 className="premium-header-title" style={{ margin: 0 }}>{details.job.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>{details.company.company_name}</span>
                <span style={{ color: '#94a3b8' }}>•</span>
                <span style={{ color: '#64748b' }}>{details.company.industry}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {details.application ? (
                <div style={{ padding: '12px 24px', background: '#f0fdf4', color: '#10b981', borderRadius: '12px', fontWeight: 700, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Applied
                </div>
              ) : (
                <button className="premium-btn-primary" style={{ padding: '12px 32px' }} onClick={handleApply}>
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="premium-card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Job Description</h3>
              <div style={{ color: '#475569', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {details.job.description}
              </div>
            </div>

            <div className="premium-card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Skills & Eligibility</h3>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Required Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {details.job.skills_required.split(',').map((skill, i) => (
                    <span key={i} style={{ padding: '6px 14px', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Eligibility</label>
                <p style={{ margin: 0, color: '#475569', fontSize: '15px' }}>{details.job.eligibility_criteria}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Aptitude Test Card */}
            {details.test && (
              <div className="premium-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Aptitude Assessment</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '24px', lineHeight: '1.6' }}>
                  This position requires an aptitude test. You can take the test after applying to complete your application process.
                </p>
                <button 
                  className="premium-btn-primary" 
                  style={{ width: '100%', background: 'white', color: '#4f46e5', border: 'none' }}
                  onClick={() => alert("Redirecting to Test... (Logic coming soon)")}
                >
                  Take Test Now
                </button>
              </div>
            )}

            <div className="premium-card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Company Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Industry</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>{details.company.industry}</div>
                </div>
                {details.company.website && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Website</div>
                    <a href={details.company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                      Visit Website ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentJobDetails;

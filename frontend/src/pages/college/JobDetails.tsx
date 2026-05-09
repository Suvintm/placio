import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    created_at: string;
  };
  company: {
    company_name: string;
    industry: string;
    website: string | null;
  };
  test: {
    id: number;
    title: string;
    description: string;
    questions_count: number;
  } | null;
}

const CollegeJobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [details, setDetails] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/college/jobs/${jobId}`, {
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

    fetchJobDetails();
  }, [jobId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="premium-container" style={{ textAlign: 'center', padding: '100px' }}>
          <div className="loading-spinner"></div>
          <p>Loading job profile...</p>
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
            Back to Requests
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 className="premium-header-title" style={{ margin: 0 }}>{details.job.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>{details.company.company_name}</span>
                <span style={{ color: '#94a3b8' }}>•</span>
                <span style={{ color: '#64748b' }}>{details.job.job_id}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Job Description */}
            <div className="premium-card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" fill="none" stroke="#3b82f6" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7"></path></svg>
                Job Description
              </h3>
              <div style={{ color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {details.job.description}
              </div>
            </div>

            {/* Eligibility & Skills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="premium-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Eligibility Criteria</h3>
                <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{details.job.eligibility_criteria}</div>
              </div>
              <div className="premium-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Required Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {details.job.skills_required.split(',').map((skill, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Attached Test */}
            <div className="premium-card" style={{ border: '1px solid #e0e7ff', background: '#f8faff' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" fill="none" stroke="#8b5cf6" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Attached Assessment
              </h3>
              {details.test ? (
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{details.test.title}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{details.test.questions_count} Questions</div>
                  <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>{details.test.description}</p>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>Note:</span> Students will need to complete this test as part of the application process.
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  No aptitude test attached to this drive.
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="premium-card">
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Company Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Industry</label>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{details.company.industry}</div>
                </div>
                {details.company.website && (
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Website</label>
                    <a href={details.company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}>
                      {details.company.website.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                ) }
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CollegeJobDetails;

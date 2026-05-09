import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';
import './CompanyStyles.css';

interface College {
  id: number;
  institution_name: string;
  university: string;
  city: string;
  state: string;
  naac_grade: string;
  website: string;
  tpo_name: string;
}

interface Job {
  id: number;
  title: string;
}

interface AptitudeTest {
  id: number;
  title: string;
}

const CollegeDiscovery: React.FC = () => {
  const { user } = useAuth();
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Placement Request Modal State
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tests, setTests] = useState<AptitudeTest[]>([]);
  const [requestData, setRequestData] = useState({
    job_id: '',
    test_id: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchColleges(), fetchJobsAndTests()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch(`${API_URL}/company/colleges`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setColleges(data);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchJobsAndTests = async () => {
    try {
      const [jobsRes, testsRes] = await Promise.all([
        fetch(`${API_URL}/company/jobs`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/company/tests`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (testsRes.ok) setTests(await testsRes.json());
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const filteredColleges = colleges.filter(college => 
    college.institution_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInitiateDrive = (college: College) => {
    setSelectedCollege(college);
    setShowRequestModal(true);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollege || !requestData.job_id || !requestData.test_id) {
      alert("Please select a job and a test.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        college_id: selectedCollege.id,
        job_id: parseInt(requestData.job_id),
        test_id: parseInt(requestData.test_id),
        message: requestData.message
      };

      const response = await fetch(`${API_URL}/company/requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('Placement request sent successfully!');
        setShowRequestModal(false);
        setRequestData({ job_id: '', test_id: '', message: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send placement request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {loading && <WaterBubbleLoader fullScreen={true} text="Discovering Colleges..." />}
      <div className="premium-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h2 className="premium-header-title">Discover Colleges</h2>
            <p className="premium-header-subtitle">Find and connect with top institutions for your next placement drive.</p>
          </div>
          <input 
            type="text" 
            placeholder="Search by college name, city, or state..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="premium-input"
            style={{ maxWidth: '500px' }}
          />
        </div>

        {!loading && (
          <div className="premium-grid">
            {filteredColleges.length === 0 ? (
              <p>No colleges found matching your search.</p>
            ) : (
            filteredColleges.map(college => (
              <div key={college.id} className="premium-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 className="premium-card-title">{college.institution_name}</h3>
                  {college.naac_grade && (
                    <span className="premium-badge premium-badge-warning">
                      NAAC {college.naac_grade}
                    </span>
                  )}
                </div>
                
                <div style={{ color: '#4b5563', fontSize: '14px', marginBottom: '16px', flex: 1 }}>
                  <p style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {college.city}, {college.state}
                  </p>
                  <p style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    {college.university}
                  </p>
                  {college.website && (
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      <a href={college.website} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Website</a>
                    </p>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    TPO: <strong style={{ color: '#111827' }}>{college.tpo_name || 'N/A'}</strong>
                  </div>
                  <button onClick={() => handleInitiateDrive(college)} className="premium-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    Initiate Drive
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Request Modal */}
        {showRequestModal && selectedCollege && (
          <div className="premium-modal-overlay">
            <div className="premium-modal-content" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 className="premium-header-title" style={{ fontSize: '24px' }}>Send Placement Request</h3>
                  <p className="premium-header-subtitle">to {selectedCollege.institution_name}</p>
                </div>
                <button onClick={() => setShowRequestModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>&times;</button>
              </div>
              
              <form onSubmit={handleRequestSubmit}>
                
                <div className="premium-input-group">
                  <label className="premium-label">1. Attach Job Description <span style={{ color: '#ef4444' }}>*</span></label>
                  {jobs.length === 0 ? (
                    <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', fontSize: '14px' }}>
                      You haven't created any jobs yet. Please create a job first.
                    </div>
                  ) : (
                    <select required value={requestData.job_id} onChange={e => setRequestData({...requestData, job_id: e.target.value})} className="premium-select">
                      <option value="">-- Select a Job --</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="premium-input-group">
                  <label className="premium-label">2. Attach Aptitude Test <span style={{ color: '#ef4444' }}>*</span></label>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6b7280' }}>This test will be shared with the students by the college.</p>
                  {tests.length === 0 ? (
                    <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', fontSize: '14px' }}>
                      You haven't created any tests yet. Please create a test first.
                    </div>
                  ) : (
                    <select required value={requestData.test_id} onChange={e => setRequestData({...requestData, test_id: e.target.value})} className="premium-select">
                      <option value="">-- Select an Aptitude Test --</option>
                      {tests.map(test => (
                        <option key={test.id} value={test.id}>{test.title}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="premium-input-group">
                  <label className="premium-label">3. Message for TPO (Optional)</label>
                  <textarea 
                    value={requestData.message} 
                    onChange={e => setRequestData({...requestData, message: e.target.value})} 
                    className="premium-textarea"
                    placeholder="E.g. We are looking to hire 20 students from the CS branch..." 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                  <button type="button" onClick={() => setShowRequestModal(false)} className="premium-btn-secondary">Cancel</button>
                  <button type="submit" disabled={isSubmitting || jobs.length === 0 || tests.length === 0} className="premium-btn-primary">
                    {isSubmitting ? 'Sending Request...' : 'Send Placement Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CollegeDiscovery;

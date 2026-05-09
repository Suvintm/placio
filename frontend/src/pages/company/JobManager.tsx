import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';
import './CompanyStyles.css';

interface Job {
  id: number;
  job_id: string;
  title: string;
  description: string;
  skills_required: string;
  eligibility_criteria: string;
  created_at: string;
  is_active: boolean;
}

const JobManager: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    eligibility_criteria: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/company/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingJobId(null);
    setFormData({ title: '', description: '', skills_required: '', eligibility_criteria: '' });
    setShowModal(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      skills_required: job.skills_required,
      eligibility_criteria: job.eligibility_criteria
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEditing = editingJobId !== null;
      const url = isEditing ? `${API_URL}/company/jobs/${editingJobId}` : `${API_URL}/company/jobs`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        setFormData({ title: '', description: '', skills_required: '', eligibility_criteria: '' });
        setEditingJobId(null);
        fetchJobs();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {loading && <WaterBubbleLoader fullScreen={true} text="Loading Jobs..." />}
      <div className="premium-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="premium-header-title">Job Manager</h2>
            <p className="premium-header-subtitle">Create and manage your active job listings.</p>
          </div>
          <button onClick={openCreateModal} className="premium-btn-primary">
            + Create New Job
          </button>
        </div>

        {!loading && (
          <div className="premium-grid">
            {jobs.length === 0 ? (
              <p>No jobs created yet.</p>
            ) : (
            jobs.map(job => (
              <div key={job.id} className="premium-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 className="premium-card-title">{job.title}</h3>
                  <span className={`premium-badge ${job.is_active ? 'premium-badge-success' : 'premium-badge-neutral'}`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '13px' }}>ID: {job.job_id}</p>
                <div style={{ marginBottom: '12px', flex: 1 }}>
                  <strong style={{ fontSize: '13px', color: '#374151' }}>Skills Required:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#4b5563' }}>{job.skills_required}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <strong style={{ fontSize: '13px', color: '#374151' }}>Eligibility:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.eligibility_criteria}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => openEditModal(job)} className="premium-btn-secondary">
                    Edit Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="premium-modal-overlay">
            <div className="premium-modal-content" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="premium-header-title" style={{ fontSize: '24px' }}>{editingJobId ? 'Edit Job Listing' : 'Create New Job Listing'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>&times;</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="premium-input-group">
                  <label className="premium-label">Job Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="premium-input" placeholder="e.g. Frontend Developer" />
                </div>
                
                <div className="premium-input-group">
                  <label className="premium-label">Skills Required</label>
                  <input type="text" name="skills_required" required value={formData.skills_required} onChange={handleInputChange} className="premium-input" placeholder="e.g. React, TypeScript, Node.js" />
                </div>

                <div className="premium-input-group">
                  <label className="premium-label">Eligibility Criteria</label>
                  <textarea name="eligibility_criteria" required value={formData.eligibility_criteria} onChange={handleInputChange} className="premium-textarea" placeholder="e.g. Minimum 7.5 CGPA, No standing arrears" />
                </div>

                <div className="premium-input-group">
                  <label className="premium-label">Detailed Job Description</label>
                  <textarea name="description" required value={formData.description} onChange={handleInputChange} className="premium-textarea" style={{ minHeight: '150px' }} placeholder="Describe the responsibilities and perks..." />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="premium-btn-secondary">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="premium-btn-primary" style={{ width: '160px' }}>
                    {isSubmitting ? 'Saving...' : (editingJobId ? 'Save Changes' : 'Create Job')}
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

export default JobManager;

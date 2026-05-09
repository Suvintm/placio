import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';

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
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Job Manager</h2>
          <button 
            onClick={openCreateModal}
            style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            + Create New Job
          </button>
        </div>

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {jobs.length === 0 ? (
              <p>No jobs created yet.</p>
            ) : (
            jobs.map(job => (
              <div key={job.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#111827' }}>{job.title}</h3>
                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: job.is_active ? '#dcfce7' : '#f3f4f6', color: job.is_active ? '#166534' : '#374151', borderRadius: '12px' }}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>ID: {job.job_id}</p>
                <div style={{ marginBottom: '12px', flex: 1 }}>
                  <strong style={{ fontSize: '14px' }}>Skills:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#4b5563' }}>{job.skills_required}</p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong style={{ fontSize: '14px' }}>Eligibility:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.eligibility_criteria}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => openEditModal(job)}
                    style={{ padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
                  >
                    Edit Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>{editingJobId ? 'Edit Job' : 'Create New Job'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Job Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="e.g. Frontend Developer" />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Skills Required</label>
                  <input type="text" name="skills_required" required value={formData.skills_required} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="e.g. React, TypeScript, Node.js" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Eligibility Criteria</label>
                  <textarea name="eligibility_criteria" required value={formData.eligibility_criteria} onChange={handleInputChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }} placeholder="e.g. Minimum 7.5 CGPA, No standing arrears" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Detailed Job Description</label>
                  <textarea name="description" required value={formData.description} onChange={handleInputChange} rows={5} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }} placeholder="Describe the responsibilities and perks..." />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', backgroundColor: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                  <button type="submit" disabled={isSubmitting} style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
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

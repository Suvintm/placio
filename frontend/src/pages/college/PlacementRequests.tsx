import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import '../company/CompanyStyles.css'; // Reuse existing premium styles

interface Company {
  id: number;
  company_name: string;
  industry: string;
  website: string | null;
}

interface Job {
  id: number;
  title: string;
  description: string;
  skills_required: string;
}

interface PlacementRequest {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  message: string | null;
  created_at: string;
  company: Company;
  job: Job;
  test_id: number | null;
}

const CollegePlacementRequests: React.FC = () => {
  const [requests, setRequests] = useState<PlacementRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${API_URL}/college/requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching placement requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/college/requests/${requestId}/status?status=${newStatus}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus as any } : req
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'ACCEPTED': return '#3b82f6'; // Changed to Blue for Accepted
      case 'PUBLISHED': return '#10b981'; // Green for Published
      case 'REJECTED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <DashboardLayout>
      <div className="premium-container">
        <header style={{ marginBottom: '32px' }}>
          <h1 className="premium-header-title">Placement Drive Requests</h1>
          <p className="premium-header-subtitle">Manage incoming recruitment drives from companies</p>
        </header>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="premium-card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>No requests yet</h2>
            <p style={{ color: '#6b7280' }}>Companies will send you placement drive requests here.</p>
          </div>
        ) : (
          <div className="premium-grid">
            {requests.map((request) => (
              <div key={request.id} className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#3b82f6' }}>
                        {request.company.company_name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{request.company.company_name}</h3>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{request.company.industry}</span>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      background: `${getStatusColor(request.status)}15`, 
                      color: getStatusColor(request.status) 
                    }}>
                      {request.status}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Position</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{request.job.title}</div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Message</div>
                    <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {request.message || "No message provided."}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                      className="premium-btn-primary" 
                      style={{ flex: 1, padding: '10px', minWidth: '120px' }}
                      onClick={() => navigate(`/college/jobs/${request.job.id}`)}
                    >
                      View Details
                    </button>
                    
                    {request.status === 'ACCEPTED' && (
                      <button 
                        className="premium-btn-primary" 
                        style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', minWidth: '120px' }}
                        onClick={async () => {
                          const success = await handleStatusUpdate(request.id, 'PUBLISHED');
                          if (success) {
                            alert("Job successfully published to all students of your college!");
                          } else {
                            alert("Failed to publish job. Please try again.");
                          }
                        }}
                      >
                        Publish to Students
                      </button>
                    )}

                    {request.status === 'PUBLISHED' && (
                      <button 
                        className="premium-btn-primary" 
                        disabled
                        style={{ flex: 1, padding: '10px', background: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0', minWidth: '120px', cursor: 'default', boxShadow: 'none' }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          Already Published to Students
                        </span>
                      </button>
                    )}

                    {request.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleStatusUpdate(request.id, 'ACCEPTED')}
                          style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                          style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ background: '#f1f5f9', padding: '10px 24px', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sent on {new Date(request.created_at).toLocaleDateString()}</span>
                  <span>ID: #{request.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CollegePlacementRequests;

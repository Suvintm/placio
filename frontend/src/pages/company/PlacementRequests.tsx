import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';
import './CompanyStyles.css';

interface PlacementRequest {
  id: number;
  college_id: number;
  job_id: number;
  test_id: number;
  status: string;
  message: string | null;
  created_at: string;
}

const PlacementRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PlacementRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/company/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'premium-badge-warning';
      case 'ACCEPTED': return 'premium-badge-success';
      case 'REJECTED': return 'premium-badge-danger';
      default: return 'premium-badge-neutral';
    }
  };

  return (
    <DashboardLayout>
      {loading && <WaterBubbleLoader fullScreen={true} text="Fetching Requests..." />}
      <div className="premium-container">
        <div style={{ marginBottom: '32px' }}>
          <h2 className="premium-header-title">Placement Requests</h2>
          <p className="premium-header-subtitle">Track the status of placement drives you have initiated with colleges.</p>
        </div>

        {!loading && requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #d1d5db', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '20px' }}>No Requests Sent</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>You haven't initiated any placement drives yet. Go to Discover Colleges to get started.</p>
          </div>
        ) : !loading && (
          <div className="premium-table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>College ID</th>
                  <th>Job ID</th>
                  <th>Test ID</th>
                  <th>Date Initiated</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 500 }}>#{req.id}</td>
                    <td>{req.college_id}</td>
                    <td>{req.job_id}</td>
                    <td>{req.test_id}</td>
                    <td>{new Date(req.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`premium-badge ${getStatusColorClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlacementRequests;

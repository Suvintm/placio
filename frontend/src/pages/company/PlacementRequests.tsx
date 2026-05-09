import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: '#fef9c3', text: '#854d0e' };
      case 'ACCEPTED': return { bg: '#dcfce7', text: '#166534' };
      case 'REJECTED': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <DashboardLayout>
      {loading && <WaterBubbleLoader fullScreen={true} text="Fetching Requests..." />}
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2>Placement Requests</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Track the status of placement drives you have initiated with colleges.</p>
        </div>

        {!loading && requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#4b5563' }}>No Requests Sent</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>You haven't initiated any placement drives yet. Go to Discover Colleges to get started.</p>
          </div>
        ) : !loading && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', fontSize: '14px' }}>Request ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', fontSize: '14px' }}>College ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', fontSize: '14px' }}>Job ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', fontSize: '14px' }}>Test ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', fontSize: '14px' }}>Date Sent</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#374151', fontSize: '14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => {
                  const statusColors = getStatusColor(request.status);
                  return (
                    <tr key={request.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>#{request.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4b5563' }}>{request.college_id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4b5563' }}>{request.job_id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4b5563' }}>{request.test_id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4b5563' }}>{new Date(request.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '9999px', 
                          fontSize: '12px', 
                          fontWeight: 500,
                          backgroundColor: statusColors.bg,
                          color: statusColors.text
                        }}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlacementRequests;

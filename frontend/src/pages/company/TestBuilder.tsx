import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';
import './CompanyStyles.css';

interface Question {
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface AptitudeTest {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const TestBuilder: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<AptitudeTest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [isLoadingTestDetails, setIsLoadingTestDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question_text: '', options: ['', '', '', ''], correct_answer: '' }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const token = localStorage.getItem('placio_token');

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/company/tests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const openCreateModal = () => {
    setEditingTestId(null);
    setTitle('');
    setDescription('');
    setQuestions([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
    setShowModal(true);
  };

  const openEditModal = async (test: AptitudeTest) => {
    setIsLoadingTestDetails(true);
    setEditingTestId(test.id);
    setTitle(test.title);
    setDescription(test.description);
    
    try {
      const response = await fetch(`${API_URL}/company/tests/${test.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const testDetails = await response.json();
        if (testDetails.questions && testDetails.questions.length > 0) {
          setQuestions(testDetails.questions);
        } else {
          setQuestions([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
        }
        setShowModal(true);
      } else {
        alert('Failed to load test details.');
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      alert('Error fetching test details.');
    } finally {
      setIsLoadingTestDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text || q.options.some(o => !o) || !q.correct_answer) {
        alert(`Please complete Question ${i + 1} completely before saving.`);
        return;
      }
      if (!q.options.includes(q.correct_answer)) {
        alert(`Question ${i + 1}'s correct answer must exactly match one of the options.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = { title, description, questions };
      const isEditing = editingTestId !== null;
      const url = isEditing ? `${API_URL}/company/tests/${editingTestId}` : `${API_URL}/company/tests`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setQuestions([{ question_text: '', options: ['', '', '', ''], correct_answer: '' }]);
        setEditingTestId(null);
        fetchTests();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error saving test:', error);
      alert('Failed to save test');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {loading && <WaterBubbleLoader fullScreen={true} text="Loading Tests..." />}
      <div className="premium-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="premium-header-title">Test Builder</h2>
            <p className="premium-header-subtitle">Design custom aptitude tests for your placement drives.</p>
          </div>
          <button onClick={openCreateModal} className="premium-btn-primary">
            + Create New Test
          </button>
        </div>

        {!loading && (
          <div className="premium-grid">
            {tests.length === 0 ? (
              <p>No tests created yet.</p>
            ) : (
            tests.map(test => (
              <div key={test.id} className="premium-card">
                <h3 className="premium-card-title">{test.title}</h3>
                <p style={{ margin: '12px 0 16px 0', color: '#4b5563', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1, lineHeight: '1.5' }}>
                  {test.description}
                </p>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                  Created: {new Date(test.created_at).toLocaleDateString()}
                </div>
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => openEditModal(test)}
                    disabled={isLoadingTestDetails}
                    className="premium-btn-secondary"
                  >
                    {isLoadingTestDetails && editingTestId === test.id ? 'Loading...' : 'Edit Test'}
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
            <div className="premium-modal-content" style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 className="premium-header-title" style={{ fontSize: '24px' }}>{editingTestId ? 'Edit Aptitude Test' : 'Create Aptitude Test'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>&times;</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '24px' }}>
                  <div className="premium-input-group">
                    <label className="premium-label">Test Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="premium-input" placeholder="e.g. Software Engineer Pre-Screening" />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label className="premium-label">Description & Instructions</label>
                    <textarea required value={description} onChange={e => setDescription(e.target.value)} className="premium-textarea" placeholder="Instructions for candidates..." />
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#1e293b' }}>Questions ({questions.length})</h4>
                  
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '20px', position: 'relative', background: '#ffffff' }}>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIndex)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Remove</button>
                      )}
                      
                      <div className="premium-input-group">
                        <label className="premium-label">Question {qIndex + 1}</label>
                        <input type="text" required value={q.question_text} onChange={e => handleQuestionChange(qIndex, 'question_text', e.target.value)} className="premium-input" placeholder="Enter question..." />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex}>
                            <label className="premium-label" style={{ fontSize: '12px', color: '#64748b' }}>Option {oIndex + 1}</label>
                            <input type="text" required value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="premium-input" placeholder={`Option ${oIndex + 1}`} />
                          </div>
                        ))}
                      </div>

                      <div className="premium-input-group" style={{ marginBottom: 0 }}>
                        <label className="premium-label" style={{ color: '#059669' }}>Correct Answer</label>
                        <select required value={q.correct_answer} onChange={e => handleQuestionChange(qIndex, 'correct_answer', e.target.value)} className="premium-select" style={{ backgroundColor: '#ecfdf5', borderColor: '#34d399' }}>
                          <option value="">Select the correct option</option>
                          {q.options.filter(o => o.trim() !== '').map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addQuestion} className="premium-btn-secondary" style={{ width: '100%', borderStyle: 'dashed', background: 'transparent' }}>
                    + Add Another Question
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="premium-btn-secondary">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="premium-btn-primary" style={{ width: '160px' }}>
                    {isSubmitting ? 'Saving...' : (editingTestId ? 'Save Changes' : 'Save Test')}
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

export default TestBuilder;

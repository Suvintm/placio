import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import WaterBubbleLoader from '../../components/common/WaterBubbleLoader';

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
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Test Builder</h2>
          <button 
            onClick={openCreateModal}
            style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            + Create New Test
          </button>
        </div>

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {tests.length === 0 ? (
              <p>No tests created yet.</p>
            ) : (
            tests.map(test => (
              <div key={test.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>{test.title}</h3>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                  {test.description}
                </p>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
                  Created on: {new Date(test.created_at).toLocaleDateString()}
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => openEditModal(test)}
                    disabled={isLoadingTestDetails}
                    style={{ padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', cursor: isLoadingTestDetails ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
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
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>{editingTestId ? 'Edit Aptitude Test' : 'Create Aptitude Test'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Test Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="e.g. Software Engineer Pre-Screening" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Description & Instructions</label>
                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', resize: 'vertical' }} placeholder="Instructions for candidates..." />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <h4 style={{ margin: '0 0 16px 0' }}>Questions ({questions.length})</h4>
                  
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px', position: 'relative' }}>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIndex)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>Remove</button>
                      )}
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px' }}>Question {qIndex + 1}</label>
                        <input type="text" required value={q.question_text} onChange={e => handleQuestionChange(qIndex, 'question_text', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder="Enter question..." />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>Option {oIndex + 1}</label>
                            <input type="text" required value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} placeholder={`Option ${oIndex + 1}`} />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: '#16a34a' }}>Correct Answer</label>
                        <select required value={q.correct_answer} onChange={e => handleQuestionChange(qIndex, 'correct_answer', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f0fdf4' }}>
                          <option value="">Select the correct option</option>
                          {q.options.filter(o => o.trim() !== '').map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={addQuestion} style={{ padding: '10px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px dashed #d1d5db', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 500 }}>
                    + Add Another Question
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 16px', backgroundColor: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                  <button type="submit" disabled={isSubmitting} style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
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

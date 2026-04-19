import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('/api/feedback');
        setFeedbacks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/feedback/${id}`, { status });
      setFeedbacks(feedbacks.map(fb => fb._id === id ? { ...fb, status } : fb));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResponseSubmit = async (id) => {
    try {
      await axios.put(`/api/feedback/${id}`, { adminResponse: response });
      setFeedbacks(feedbacks.map(fb => fb._id === id ? { ...fb, adminResponse: response } : fb));
      setSelectedFeedback(null);
      setResponse('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Admin Dashboard</h2>
        <p className="welcome-message">Manage and respond to student feedback</p>
        <h3 style={{ color: '#555', marginTop: '30px' }}>All Feedbacks</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="loading" style={{ width: '40px', height: '40px' }}></span>
          </div>
        ) : feedbacks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No feedbacks found.</p>
        ) : (
          <div>
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="feedback-item" style={{ marginBottom: '25px' }}>
                <h4>{feedback.subject}</h4>
                <p><strong>Student:</strong> {feedback.student.name} ({feedback.student.email})</p>
                <p><strong>Category:</strong> {feedback.category}</p>
                <p><strong>Rating:</strong> {feedback.rating}/5 ⭐</p>
                <p><strong>Message:</strong> {feedback.message}</p>
                <p><strong>Status:</strong>
                  <select
                    value={feedback.status}
                    onChange={(e) => handleStatusChange(feedback._id, e.target.value)}
                    style={{ marginLeft: '10px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </p>
                {feedback.adminResponse && (
                  <div style={{ background: '#e9ecef', padding: '10px', borderRadius: '6px', margin: '10px 0' }}>
                    <strong>Admin Response:</strong> {feedback.adminResponse}
                  </div>
                )}
                <div style={{ marginTop: '15px' }}>
                  <button
                    onClick={() => setSelectedFeedback(feedback._id)}
                    className="btn"
                    style={{ padding: '8px 16px', width: 'auto', margin: 0 }}
                  >
                    {feedback.adminResponse ? 'Update Response' : 'Respond'}
                  </button>
                </div>
                {selectedFeedback === feedback._id && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Enter your response..."
                      rows="4"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '10px' }}
                    />
                    <div>
                      <button
                        onClick={() => handleResponseSubmit(feedback._id)}
                        className="btn btn-success"
                        style={{ padding: '8px 16px', width: 'auto', margin: 0, marginRight: '10px' }}
                      >
                        Submit Response
                      </button>
                      <button
                        onClick={() => { setSelectedFeedback(null); setResponse(''); }}
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', width: 'auto', margin: 0 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                  Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
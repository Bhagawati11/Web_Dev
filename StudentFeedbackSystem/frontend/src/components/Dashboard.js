import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('/api/feedback/my');
        setFeedbacks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'reviewed': return 'status-reviewed';
      case 'resolved': return 'status-resolved';
      default: return 'status-pending';
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Dashboard</h2>
        <p className="welcome-message">Welcome back, {user?.name}!</p>
        <h3 style={{ color: '#555', marginTop: '30px' }}>Your Feedbacks</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="loading" style={{ width: '40px', height: '40px' }}></span>
          </div>
        ) : feedbacks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No feedbacks submitted yet.</p>
        ) : (
          <div>
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="feedback-item">
                <h4>{feedback.subject}</h4>
                <p><strong>Category:</strong> {feedback.category}</p>
                <p><strong>Rating:</strong> {feedback.rating}/5 ⭐</p>
                <p><strong>Message:</strong> {feedback.message}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${getStatusClass(feedback.status)}`}>{feedback.status}</span></p>
                {feedback.adminResponse && <p><strong>Admin Response:</strong> {feedback.adminResponse}</p>}
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

export default Dashboard;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'course',
    rating: 5,
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/feedback', formData);
      setSuccess('Feedback submitted successfully!');
      setFormData({ subject: '', category: 'course', rating: 5, message: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Submit Feedback</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Brief title for your feedback"
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="course">Course</option>
              <option value="faculty">Faculty</option>
              <option value="facility">Facility</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Rating:</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value={1}>⭐ 1 - Very Poor</option>
              <option value={2}>⭐⭐ 2 - Poor</option>
              <option value={3}>⭐⭐⭐ 3 - Average</option>
              <option value={4}>⭐⭐⭐⭐ 4 - Good</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Please provide detailed feedback..."
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? <span className="loading"></span> : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
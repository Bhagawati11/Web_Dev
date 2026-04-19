import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Student Feedback System
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span style={{ color: '#666', fontWeight: '500' }}>
                Welcome, {user.name}
              </span>
              {user.role === 'admin' && (
                <Link to="/admin">Admin Dashboard</Link>
              )}
              <Link to="/feedback">Submit Feedback</Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', width: 'auto', margin: 0 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
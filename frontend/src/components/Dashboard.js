import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data from localStorage
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const handleLoginClick = () => {
    // This will be handled by the parent component
    console.log('Login clicked from navbar');
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <Navbar onLogout={onLogout} />
        <div className="dashboard-content">
          <div className="card">
            <div className="card-body">
              <p>Loading user data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar onLogout={onLogout} />
      <div className="dashboard-content">
        <div className="dashboard">
          <h1>Welcome to Highway Express</h1>
          
          <div className="dashboard-content">
            <p>You have successfully logged in to your account.</p>
          </div>
          
          <div className="user-info">
            <h3>User Information</h3>
            <p><strong>Email:</strong> {user.email || 'demo@example.com'}</p>
            <p><strong>Name:</strong> {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Demo User'}</p>
            <p><strong>User Type:</strong> {user.userType || 'User'}</p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p><strong>Login Time:</strong> {new Date().toLocaleString()}</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              This is your dashboard. You can add more features here like:
            </p>
            <ul style={{ 
              textAlign: 'left', 
              color: '#666', 
              marginBottom: '30px',
              paddingLeft: '20px'
            }}>
              <li>User profile management</li>
              <li>Settings and preferences</li>
              <li>Activity history</li>
              <li>Notifications</li>
              <li>Data analytics</li>
            </ul>
          </div>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

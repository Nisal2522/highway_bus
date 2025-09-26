import React, { useState, useEffect } from 'react';
import { FaUser, FaBus, FaRoute, FaUsers, FaChartLine, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Navbar from './Navbar';

const BusOwnerDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    console.log('BusOwnerDashboard: Logout button clicked');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    onLogout();
  };

  const handleLoginClick = () => {
    // This will be handled by the parent component
    console.log('Login clicked from navbar');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar onLoginClick={handleLoginClick} />
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <Navbar onLoginClick={handleLoginClick} />
        <div className="dashboard-error">
          <p>User data not found. Please login again.</p>
          <button onClick={handleLogout} className="btn btn-primary">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar onLoginClick={handleLoginClick} />
      <div className="bus-owner-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Bus Owner Dashboard</h1>
            <p>Welcome back, {user.firstName}!</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <FaUser className="user-icon" />
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-nav">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaBus />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'buses' ? 'active' : ''}`}
            onClick={() => setActiveTab('buses')}
          >
            <FaBus />
            <span>My Buses</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            <FaRoute />
            <span>Routes</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'passengers' ? 'active' : ''}`}
            onClick={() => setActiveTab('passengers')}
          >
            <FaUsers />
            <span>Passengers</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine />
            <span>Analytics</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog />
            <span>Settings</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Buses</h3>
                  <p className="stat-number">8</p>
                  <p className="stat-label">Active fleet</p>
                </div>
                <div className="stat-card">
                  <h3>Active Routes</h3>
                  <p className="stat-number">12</p>
                  <p className="stat-label">Operating routes</p>
                </div>
                <div className="stat-card">
                  <h3>Today's Revenue</h3>
                  <p className="stat-number">$2,450</p>
                  <p className="stat-label">From bookings</p>
                </div>
                <div className="stat-card">
                  <h3>Total Passengers</h3>
                  <p className="stat-number">156</p>
                  <p className="stat-label">Today's bookings</p>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary">
                    <FaPlus />
                    <span>Add New Bus</span>
                  </button>
                  <button className="action-btn secondary">
                    <FaRoute />
                    <span>Create Route</span>
                  </button>
                  <button className="action-btn secondary">
                    <FaChartLine />
                    <span>View Reports</span>
                  </button>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <FaBus />
                    </div>
                    <div className="activity-content">
                      <h4>New Bus Added</h4>
                      <p>Bus #124 - Colombo Express</p>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <FaUsers />
                    </div>
                    <div className="activity-content">
                      <h4>High Booking Volume</h4>
                      <p>Route: Colombo to Kandy - 45 bookings</p>
                      <span className="activity-time">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buses' && (
            <div className="buses-section">
              <div className="section-header">
                <h3>My Buses</h3>
                <button className="btn btn-primary">
                  <FaPlus />
                  <span>Add New Bus</span>
                </button>
              </div>
              <div className="buses-grid">
                <div className="bus-card">
                  <div className="bus-header">
                    <h4>Bus #121</h4>
                    <span className="bus-status active">Active</span>
                  </div>
                  <div className="bus-details">
                    <p><strong>Model:</strong> Volvo B7R</p>
                    <p><strong>Capacity:</strong> 45 seats</p>
                    <p><strong>Route:</strong> Colombo → Kandy</p>
                    <p><strong>Driver:</strong> John Smith</p>
                  </div>
                  <div className="bus-actions">
                    <button className="btn btn-secondary">
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button className="btn btn-danger">
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="bus-card">
                  <div className="bus-header">
                    <h4>Bus #122</h4>
                    <span className="bus-status maintenance">Maintenance</span>
                  </div>
                  <div className="bus-details">
                    <p><strong>Model:</strong> Mercedes O500</p>
                    <p><strong>Capacity:</strong> 50 seats</p>
                    <p><strong>Route:</strong> Colombo → Galle</p>
                    <p><strong>Driver:</strong> Mike Johnson</p>
                  </div>
                  <div className="bus-actions">
                    <button className="btn btn-secondary">
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button className="btn btn-danger">
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="routes-section">
              <div className="section-header">
                <h3>Routes</h3>
                <button className="btn btn-primary">
                  <FaPlus />
                  <span>Add New Route</span>
                </button>
              </div>
              <div className="routes-list">
                <div className="route-card">
                  <div className="route-header">
                    <h4>Colombo → Kandy</h4>
                    <span className="route-status active">Active</span>
                  </div>
                  <div className="route-details">
                    <p><strong>Distance:</strong> 115 km</p>
                    <p><strong>Duration:</strong> 3 hours</p>
                    <p><strong>Price:</strong> $25</p>
                    <p><strong>Schedule:</strong> Every 2 hours</p>
                  </div>
                  <div className="route-actions">
                    <button className="btn btn-secondary">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>Account Settings</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={user.firstName} readOnly />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={user.lastName} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={user.phone} readOnly />
                </div>
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" value={user.companyName || 'N/A'} readOnly />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusOwnerDashboard;

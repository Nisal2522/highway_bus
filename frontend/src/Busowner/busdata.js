import React, { useState, useEffect } from 'react';
import { Bus, Download, Eye, Trash2, Edit, Plus, Search, Filter, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import './busdata.css';

const BusData = ({ onLogout }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchBusData();
  }, []);

  const fetchBusData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching bus data from backend...');
      
      const response = await fetch('http://localhost:8081/api/buses');
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📦 Bus data received:', result);
      
      if (result.success) {
        setBuses(result.data);
        console.log('✅ Bus data loaded successfully:', result.data.length, 'buses');
      } else {
        throw new Error(result.message || 'Failed to fetch bus data');
      }
    } catch (error) {
      console.error('💥 Error fetching bus data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBus = (bus) => {
    setSelectedBus(bus);
    setShowModal(true);
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        console.log('🗑️ Deleting bus with ID:', busId);
        
        const response = await fetch(`http://localhost:8081/api/buses/${busId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('✅ Bus deleted successfully');
          alert('Bus deleted successfully!');
          fetchBusData(); // Refresh the data
        } else {
          const result = await response.json();
          throw new Error(result.message || 'Failed to delete bus');
        }
      } catch (error) {
        console.error('💥 Error deleting bus:', error);
        alert('Failed to delete bus: ' + error.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'PENDING':
        return 'status-pending';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={16} />;
      case 'PENDING':
        return <Clock size={16} />;
      case 'REJECTED':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and sort buses
  const filteredAndSortedBuses = buses
    .filter(bus => {
      const matchesSearch = bus.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || bus.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const approvedCount = buses.filter(bus => bus.status === 'APPROVED').length;
  const pendingCount = buses.filter(bus => bus.status === 'PENDING').length;
  const rejectedCount = buses.filter(bus => bus.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="bus-data-container">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your bus fleet...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bus-data-container">
        <Navbar onLogout={onLogout} />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchBusData} className="btn-primary">
            <Download size={20} />
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bus-data-container">
      <Navbar onLogout={onLogout} />
      
      <div className="bus-data-content">
        {/* Enhanced Page Header */}
        <div className="page-header">
          <div className="header-info">
            <div className="header-icon">
              <Bus size={40} />
            </div>
            <div>
              <h1>Bus Fleet Management</h1>
              <p>Manage and monitor all your registered buses in one place</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => window.location.href = '/add-bus'}>
              <Plus size={20} />
              Add New Bus
            </button>
            <button className="btn-secondary" onClick={fetchBusData}>
              <Download size={20} />
              Refresh
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card stat-total">
            <div className="stat-icon">
              <Bus size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Buses</h3>
              <p className="stat-number">{buses.length}</p>
              <p className="stat-description">in your fleet</p>
            </div>
          </div>
          <div className="stat-card stat-approved">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Approved</h3>
              <p className="stat-number">{approvedCount}</p>
              <p className="stat-description">ready to operate</p>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-number">{pendingCount}</p>
              <p className="stat-description">awaiting approval</p>
            </div>
          </div>
          <div className="stat-card stat-rejected">
            <div className="stat-icon">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Rejected</h3>
              <p className="stat-number">{rejectedCount}</p>
              <p className="stat-description">needs attention</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search buses by name, registration, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <TrendingUp size={16} />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="filter-select"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="busName-asc">Name A-Z</option>
                <option value="busName-desc">Name Z-A</option>
                <option value="seatingCapacity-desc">Capacity High-Low</option>
                <option value="seatingCapacity-asc">Capacity Low-High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Bus Table Container */}
        <div className="bus-table-container">
          {filteredAndSortedBuses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Bus size={60} />
              </div>
              <h3>No Buses Found</h3>
              <p>
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'No buses match your current search criteria. Try adjusting your filters.'
                  : "You haven't registered any buses yet. Start by adding your first bus!"
                }
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <button className="btn-primary" onClick={() => window.location.href = '/add-bus'}>
                  <Plus size={20} />
                  Add Your First Bus
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <div className="table-header">
                <p>Showing {filteredAndSortedBuses.length} of {buses.length} buses</p>
              </div>
              <table className="bus-table">
                <thead>
                  <tr>
                    <th>Bus Details</th>
                    <th>Registration</th>
                    <th>Capacity</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedBuses.map((bus, index) => (
                    <tr key={bus.id} className="bus-row" style={{ animationDelay: `${index * 0.1}s` }}>
                      <td>
                        <div className="bus-name-cell">
                          <div className="bus-icon">
                            <Bus size={16} />
                          </div>
                          <div className="bus-info">
                            <span className="bus-name">{bus.busName}</span>
                            <span className="bus-id">ID: {bus.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="registration-number">{bus.registrationNumber}</span>
                      </td>
                      <td>
                        <div className="capacity-info">
                          <span className="seating-capacity">{bus.seatingCapacity}</span>
                          <span className="capacity-label">seats</span>
                        </div>
                      </td>
                      <td>
                        <span className="owner-name">{bus.ownerName}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusColor(bus.status)}`}>
                          {getStatusIcon(bus.status)}
                          {bus.status}
                        </span>
                      </td>
                      <td>
                        <div className="date-info">
                          <span className="date">{formatDate(bus.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => handleViewBus(bus)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => window.location.href = `/edit-bus/${bus.id}`}
                            title="Edit Bus"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteBus(bus.id)}
                            title="Delete Bus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bus Details Modal */}
      {showModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-icon">
                  <Bus size={24} />
                </div>
                <div>
                  <h2>{selectedBus.busName}</h2>
                  <p>Bus Details & Information</p>
                </div>
              </div>
              <button className="close-button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="bus-details-grid">
                <div className="detail-item">
                  <label>Bus Name:</label>
                  <span>{selectedBus.busName}</span>
                </div>
                <div className="detail-item">
                  <label>Registration Number:</label>
                  <span className="highlight-text">{selectedBus.registrationNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Seating Capacity:</label>
                  <span className="highlight-text">{selectedBus.seatingCapacity} seats</span>
                </div>
                <div className="detail-item">
                  <label>Owner:</label>
                  <span>{selectedBus.ownerName}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusColor(selectedBus.status)}`}>
                    {getStatusIcon(selectedBus.status)}
                    {selectedBus.status}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Registered Date:</label>
                  <span>{formatDate(selectedBus.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <label>Last Updated:</label>
                  <span>{formatDate(selectedBus.updatedAt)}</span>
                </div>
              </div>
              
              {(selectedBus.busBookCopyUrl || selectedBus.ownerIdCopyUrl) && (
                <div className="documents-section">
                  <h3>📄 Documents</h3>
                  <div className="document-links">
                    {selectedBus.busBookCopyUrl && (
                      <a
                        href={selectedBus.busBookCopyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        <Download size={16} />
                        View Bus Book Copy
                      </a>
                    )}
                    {selectedBus.ownerIdCopyUrl && (
                      <a
                        href={selectedBus.ownerIdCopyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-link"
                      >
                        <Download size={16} />
                        View Owner ID Copy
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowModal(false);
                  window.location.href = `/edit-bus/${selectedBus.id}`;
                }}
              >
                <Edit size={16} />
                Edit Bus
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BusData;

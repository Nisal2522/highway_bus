
import React, { useState, useEffect } from 'react';
import { Bus, Upload, Save, ArrowLeft, X, Download, Eye, Trash2, Edit, Plus } from 'lucide-react';
import busImage from '../assets/nightSeats.png';
import './HeroSection.css';

const HeroSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBusData, setShowBusData] = useState(false);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    busName: '',
    registrationNumber: '',
    seatingCapacity: '',
    busBookCopy: null,
    ownerIdCopy: null
  });

  const [dragActive, setDragActive] = useState({
    busBook: false,
    ownerId: false
  });

  const handleAddBusClick = () => {
    setShowForm(true);
    setShowBusData(false);
    // Scroll to the form after a short delay to ensure it's rendered
    setTimeout(() => {
      const formElement = document.querySelector('.inline-form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewBusDataClick = async () => {
    if (showBusData) {
      // If bus data is already shown, close it
      setShowBusData(false);
    } else {
      // If bus data is not shown, open it and close form
      setShowBusData(true);
      setShowForm(false);
      await fetchBusData();
      // Scroll to the bus data after a short delay
      setTimeout(() => {
        const busDataElement = document.querySelector('.bus-data-section');
        if (busDataElement) {
          busDataElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      busName: '',
      registrationNumber: '',
      seatingCapacity: '',
      busBookCopy: null,
      ownerIdCopy: null
    });
  };

  const handleCloseBusData = () => {
    setShowBusData(false);
  };

  const fetchBusData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching bus data from backend...');
      
      // Get owner ID from localStorage
      const ownerId = localStorage.getItem('userId') || 1; // Default to 1 for testing
      console.log('👤 Owner ID:', ownerId);
      
      const response = await fetch(`http://localhost:8081/api/buses/owner/${ownerId}`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleDrag = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [field]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [field]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({
        ...prev,
        [field]: e.dataTransfer.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting form submission...');
    console.log('📋 Form data:', formData);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('busName', formData.busName);
      formDataToSend.append('registrationNumber', formData.registrationNumber);
      formDataToSend.append('seatingCapacity', formData.seatingCapacity);
      
      if (formData.busBookCopy) {
        formDataToSend.append('busBookCopy', formData.busBookCopy);
        console.log('📄 Bus book file:', formData.busBookCopy.name, 'Size:', formData.busBookCopy.size);
      }
      
      if (formData.ownerIdCopy) {
        formDataToSend.append('ownerIdCopy', formData.ownerIdCopy);
        console.log('🆔 Owner ID file:', formData.ownerIdCopy.name, 'Size:', formData.ownerIdCopy.size);
      }
      
      // Get owner ID from localStorage or context (you may need to adjust this based on your auth system)
      const ownerId = localStorage.getItem('userId') || 1; // Default to 1 for testing
      formDataToSend.append('ownerId', ownerId);
      console.log('👤 Owner ID:', ownerId);
      
      console.log('🌐 Sending request to: http://localhost:8081/api/buses');
      
      // Send request to backend
      const response = await fetch('http://localhost:8081/api/buses', {
        method: 'POST',
        body: formDataToSend,
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      const result = await response.json();
      console.log('📦 Response data:', result);
      
      if (result.success) {
        console.log('✅ Bus registered successfully!');
        alert('Bus registered successfully!');
        handleCloseForm();
        // Optionally refresh the page or update the UI
        window.location.reload();
      } else {
        console.log('❌ Error:', result.message);
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('💥 Error submitting form:', error);
      console.error('💥 Error details:', error.message);
      alert('Failed to register bus. Please try again.');
    }
  };

    return (
    <div className="hero-section" style={{ backgroundImage: `url(${busImage})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Bus Owner Dashboard</h1>
          <p className="hero-subtitle">
            Manage your fleet, routes, and bookings with ease
          </p>
          <div className="hero-stats">
            <div className="stat-item add-bus-item" onClick={handleAddBusClick}>
              <h3>+</h3>
              <p>Add New Bus</p>
            </div>
            <div className={`stat-item view-bus-item ${showBusData ? 'active' : ''}`} onClick={handleViewBusDataClick}>
              <h3>{showBusData ? '✕' : '📊'}</h3>
              <p>{showBusData ? 'Close Bus Data' : 'View Bus Data'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="inline-form-container">
          <div className="inline-form">
            <div className="form-header">
              <div className="header-icon">
                <Bus size={40} />
              </div>
              <h1>Add New Bus</h1>
              <p>Register your new bus to the fleet</p>
              <button className="close-button" onClick={handleCloseForm}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bus-form">
              <div className="form-grid">
                {/* Bus Name */}
                <div className="form-group">
                  <label htmlFor="busName">
                    <Bus size={20} />
                    Bus Name
                  </label>
                  <input
                    type="text"
                    id="busName"
                    name="busName"
                    value={formData.busName}
                    onChange={handleInputChange}
                    placeholder="Enter bus name (e.g., Express Deluxe)"
                    required
                  />
                </div>

                {/* Registration Number */}
                <div className="form-group">
                  <label htmlFor="registrationNumber">
                    <Bus size={20} />
                    Registration Number
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="Enter registration number"
                    required
                  />
                </div>

                {/* Seating Capacity */}
                <div className="form-group">
                  <label htmlFor="seatingCapacity">
                    <Bus size={20} />
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    id="seatingCapacity"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleInputChange}
                    placeholder="Enter number of seats"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                {/* Bus Book Copy Upload */}
                <div className="form-group file-upload-group">
                  <label>
                    <Upload size={20} />
                    Bus Book Copy
                  </label>
                  <div
                    className={`file-upload-area ${dragActive.busBook ? 'drag-active' : ''} ${formData.busBookCopy ? 'has-file' : ''}`}
                    onDragEnter={(e) => handleDrag(e, 'busBook')}
                    onDragLeave={(e) => handleDrag(e, 'busBook')}
                    onDragOver={(e) => handleDrag(e, 'busBook')}
                    onDrop={(e) => handleDrop(e, 'busBook')}
                  >
                    <input
                      type="file"
                      id="busBookCopy"
                      name="busBookCopy"
                      onChange={(e) => handleFileChange(e, 'busBookCopy')}
                      accept="image/*,.pdf"
                      required
                    />
                    <div className="upload-content">
                      <Upload size={40} />
                      <p>
                        {formData.busBookCopy 
                          ? formData.busBookCopy.name 
                          : 'Drag & drop bus book copy here or click to browse'
                        }
                      </p>
                      <span>Supports: JPG, PNG, PDF</span>
                    </div>
                  </div>
                </div>

                {/* Owner ID Copy Upload */}
                <div className="form-group file-upload-group">
                  <label>
                    <Upload size={20} />
                    ID Copy of Owner
                  </label>
                  <div
                    className={`file-upload-area ${dragActive.ownerId ? 'drag-active' : ''} ${formData.ownerIdCopy ? 'has-file' : ''}`}
                    onDragEnter={(e) => handleDrag(e, 'ownerId')}
                    onDragLeave={(e) => handleDrag(e, 'ownerId')}
                    onDragOver={(e) => handleDrag(e, 'ownerId')}
                    onDrop={(e) => handleDrop(e, 'ownerId')}
                  >
                    <input
                      type="file"
                      id="ownerIdCopy"
                      name="ownerIdCopy"
                      onChange={(e) => handleFileChange(e, 'ownerIdCopy')}
                      accept="image/*,.pdf"
                      required
                    />
                    <div className="upload-content">
                      <Upload size={40} />
                      <p>
                        {formData.ownerIdCopy 
                          ? formData.ownerIdCopy.name 
                          : 'Drag & drop owner ID copy here or click to browse'
                        }
                      </p>
                      <span>Supports: JPG, PNG, PDF</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseForm}>
                  <ArrowLeft size={20} />
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save size={20} />
                  Register Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bus Data Section */}
      {showBusData && (
        <div className="bus-data-section">
          <div className="bus-data-content">
            <div className="section-header">
              <div className="header-info">
                <div className="header-icon">
                  <Bus size={40} />
                </div>
                <div>
                  <h1>Bus Fleet Management</h1>
                  <p>View and manage all registered buses in your fleet</p>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn-primary" onClick={handleAddBusClick}>
                  <Plus size={20} />
                  Add New Bus
                </button>
                <button className="btn-secondary" onClick={fetchBusData}>
                  <Download size={20} />
                  Refresh
                </button>
                <button className="btn-secondary" onClick={handleCloseBusData}>
                  <ArrowLeft size={20} />
                  Close
                </button>
              </div>
            </div>

            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Buses</h3>
                <p className="stat-number">{buses.length}</p>
              </div>
              <div className="stat-card">
                <h3>Approved</h3>
                <p className="stat-number">{buses.filter(bus => bus.status === 'APPROVED').length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <p className="stat-number">{buses.filter(bus => bus.status === 'PENDING').length}</p>
              </div>
              <div className="stat-card">
                <h3>Rejected</h3>
                <p className="stat-number">{buses.filter(bus => bus.status === 'REJECTED').length}</p>
              </div>
            </div>

            <div className="bus-table-container">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading bus data...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <h2>Error Loading Bus Data</h2>
                  <p>{error}</p>
                  <button onClick={fetchBusData} className="btn-primary">
                    Try Again
                  </button>
                </div>
              ) : buses.length === 0 ? (
                <div className="empty-state">
                  <Bus size={60} />
                  <h3>No Buses Found</h3>
                  <p>You haven't registered any buses yet. Start by adding your first bus!</p>
                  <button className="btn-primary" onClick={handleAddBusClick}>
                    <Plus size={20} />
                    Add Your First Bus
                  </button>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="bus-table">
                    <thead>
                      <tr>
                        <th>Bus Name</th>
                        <th>Registration Number</th>
                        <th>Seating Capacity</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buses.map((bus) => (
                        <tr key={bus.id}>
                          <td>
                            <div className="bus-name-cell">
                              <Bus size={16} />
                              <span>{bus.busName}</span>
                            </div>
                          </td>
                          <td>
                            <span className="registration-number">{bus.registrationNumber}</span>
                          </td>
                          <td>
                            <span className="seating-capacity">{bus.seatingCapacity} seats</span>
                          </td>
                          <td>
                            <span className="owner-name">{bus.ownerName}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusColor(bus.status)}`}>
                              {bus.status}
                            </span>
                          </td>
                          <td>
                            <span className="date">{formatDate(bus.createdAt)}</span>
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
        </div>
      )}

      {/* Bus Details Modal */}
      {showModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bus Details</h2>
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
                  <span>{selectedBus.registrationNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Seating Capacity:</label>
                  <span>{selectedBus.seatingCapacity} seats</span>
                </div>
                <div className="detail-item">
                  <label>Owner:</label>
                  <span>{selectedBus.ownerName}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusColor(selectedBus.status)}`}>
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
                  <h3>Documents</h3>
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
    </div>
  );
};

export default HeroSection;

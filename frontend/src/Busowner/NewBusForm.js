import React, { useState } from 'react';
import { Bus, Upload, Save, ArrowLeft, X } from 'lucide-react';
import './NewBusForm.css';

const NewBusForm = ({ onClose, onSuccess }) => {
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

  const [loading, setLoading] = useState(false);

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
    
    setLoading(true);
    
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
      
      // Get owner ID from localStorage or context
      const ownerId = localStorage.getItem('userId') || 1;
      formDataToSend.append('ownerId', ownerId);
      console.log('👤 Owner ID:', ownerId);
      
      console.log('🌐 Sending request to: http://localhost:8081/api/buses');
      
      // Send request to backend
      const response = await fetch('http://localhost:8081/api/buses', {
        method: 'POST',
        body: formDataToSend,
      });
      
      console.log('📡 Response status:', response.status);
      
      const result = await response.json();
      console.log('📦 Response data:', result);
      
      if (result.success) {
        console.log('✅ Bus registered successfully!');
        alert('Bus registered successfully!');
        
        // Reset form
        setFormData({
          busName: '',
          registrationNumber: '',
          seatingCapacity: '',
          busBookCopy: null,
          ownerIdCopy: null
        });
        
        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
        
        // Close form
        onClose();
      } else {
        console.log('❌ Error:', result.message);
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('💥 Error submitting form:', error);
      alert('Failed to register bus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      busName: '',
      registrationNumber: '',
      seatingCapacity: '',
      busBookCopy: null,
      ownerIdCopy: null
    });
    onClose();
  };

  return (
    <div className="new-bus-form-overlay">
      <div className="new-bus-form-container">
        <div className="form-header">
          <div className="header-icon">
            <Bus size={40} />
          </div>
          <h1>Add New Bus</h1>
          <p>Register your new bus to the fleet</p>
          <button className="close-button" onClick={handleClose}>
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
            <button type="button" className="btn-secondary" onClick={handleClose}>
              <ArrowLeft size={20} />
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Registering...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Register Bus
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBusForm;

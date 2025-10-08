import React, { useState, useEffect } from 'react';
import './AdminTourManagement.css';

const AdminTourManagement = () => {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // Package management state
  const [activeTab, setActiveTab] = useState('tours'); // 'tours' or 'packages'
  const [packages, setPackages] = useState([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedPackageForOptions, setSelectedPackageForOptions] = useState(null);

  // Sample data - replace with API calls later
  const sampleTours = [
    {
      id: 1,
      title: "Galle Fort Heritage Tour",
      basePrice: 8500,
      availableSeats: 25,
      rating: 4.8,
      imageUrl: require("../assets/hero-galle.jpg"),
      description: "Explore the historic Galle Fort, a UNESCO World Heritage site with Dutch colonial architecture, museums, and stunning ocean views.",
      category: "heritage",
      isActive: true
    },
    {
      id: 2,
      title: "Sigiriya Rock Fortress Adventure",
      basePrice: 6200,
      availableSeats: 30,
      rating: 4.9,
      imageUrl: require("../assets/hero-sigiriya.jpg"),
      description: "Climb the ancient rock fortress of Sigiriya, marvel at the frescoes, and enjoy panoramic views of the surrounding landscape.",
      category: "heritage",
      isActive: true
    },
    {
      id: 3,
      title: "Ella Scenic Railway Journey",
      basePrice: 12000,
      availableSeats: 20,
      rating: 4.7,
      imageUrl: require("../assets/hero-ella.webp"),
      description: "Experience the famous Nine Arch Bridge, tea plantations, and breathtaking mountain views in the hill country.",
      category: "nature",
      isActive: true
    },
    {
      id: 4,
      title: "Nuwara Eliya Hill Station",
      basePrice: 9500,
      availableSeats: 15,
      rating: 4.6,
      imageUrl: require("../assets/hero-nuwara-eliya.jpg"),
      description: "Visit the 'Little England' of Sri Lanka with tea plantations, cool climate, and colonial architecture.",
      category: "nature",
      isActive: true
    },
    {
      id: 5,
      title: "Bentota Beach Paradise",
      basePrice: 7500,
      availableSeats: 35,
      rating: 4.5,
      imageUrl: require("../assets/hero-beach.jpg"),
      description: "Relax on pristine beaches, enjoy water sports, and experience the coastal beauty of Sri Lanka.",
      category: "beaches",
      isActive: true
    }
  ];

  const sampleCategories = [
    { id: 1, name: "Heritage", description: "Historical and cultural sites" },
    { id: 2, name: "Nature", description: "Natural landscapes and wildlife" },
    { id: 3, name: "Beaches", description: "Coastal destinations and water activities" },
    { id: 4, name: "Adventure", description: "Thrilling outdoor activities" }
  ];

  // Sample tour packages data
  const samplePackages = [
    {
      id: 1,
      name: "basic",
      displayName: "Basic Package",
      description: "Essential tour experience with basic amenities",
      basePrice: 5000,
      isActive: true,
      options: [
        { id: 1, optionType: "BREAKFAST", name: "Continental Breakfast", price: 0, isDefault: true },
        { id: 2, optionType: "HOTEL", name: "Budget Hotel", price: 2000, isDefault: true },
        { id: 3, optionType: "TRANSPORT", name: "Public Transport", price: 0, isDefault: true }
      ]
    },
    {
      id: 2,
      name: "standard",
      displayName: "Standard Package",
      description: "Comfortable tour with good amenities and services",
      basePrice: 8000,
      isActive: true,
      options: [
        { id: 4, optionType: "BREAKFAST", name: "Full Breakfast", price: 500, isDefault: true },
        { id: 5, optionType: "HOTEL", name: "3-Star Hotel", price: 3500, isDefault: true },
        { id: 6, optionType: "TRANSPORT", name: "Private Vehicle", price: 2000, isDefault: true }
      ]
    },
    {
      id: 3,
      name: "premium",
      displayName: "Premium Package",
      description: "Luxury tour experience with premium amenities",
      basePrice: 12000,
      isActive: true,
      options: [
        { id: 7, optionType: "BREAKFAST", name: "Gourmet Breakfast", price: 1000, isDefault: true },
        { id: 8, optionType: "HOTEL", name: "5-Star Hotel", price: 6000, isDefault: true },
        { id: 9, optionType: "TRANSPORT", name: "Luxury Vehicle", price: 3000, isDefault: true }
      ]
    }
  ];

  useEffect(() => {
    // Load tours, categories, and packages
    // Try to load from localStorage first, fallback to sample data
    const savedTours = localStorage.getItem('adminTours');
    const savedPackages = localStorage.getItem('adminPackages');
    
    if (savedTours) {
      try {
        setTours(JSON.parse(savedTours));
      } catch (error) {
        console.error('Error loading saved tours:', error);
        setTours(sampleTours);
      }
    } else {
      setTours(sampleTours);
    }
    
    if (savedPackages) {
      try {
        setPackages(JSON.parse(savedPackages));
      } catch (error) {
        console.error('Error loading saved packages:', error);
        setPackages(samplePackages);
      }
    } else {
      setPackages(samplePackages);
    }
    
    setCategories(sampleCategories);
  }, []);

  const handleAddTour = () => {
    setEditingTour(null);
    setShowAddForm(true);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setShowAddForm(true);
  };

  const handleDeleteTour = (tourId) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      const updatedTours = tours.filter(tour => tour.id !== tourId);
      setTours(updatedTours);
      localStorage.setItem('adminTours', JSON.stringify(updatedTours));
      // Dispatch custom event to notify passenger view
      window.dispatchEvent(new CustomEvent('tourUpdated'));
    }
  };

  const handleToggleStatus = (tourId) => {
    const updatedTours = tours.map(tour => 
      tour.id === tourId ? { ...tour, isActive: !tour.isActive } : tour
    );
    setTours(updatedTours);
    localStorage.setItem('adminTours', JSON.stringify(updatedTours));
    // Dispatch custom event to notify passenger view
    window.dispatchEvent(new CustomEvent('tourUpdated'));
  };

  const handleSaveTour = (tourData) => {
    let updatedTours;
    
    if (editingTour) {
      // Update existing tour
      updatedTours = tours.map(tour => 
        tour.id === editingTour.id ? { ...tour, ...tourData } : tour
      );
    } else {
      // Add new tour
      const newTour = {
        ...tourData,
        id: Math.max(...tours.map(t => t.id)) + 1,
        rating: 0,
        isActive: true
      };
      updatedTours = [...tours, newTour];
    }
    
    setTours(updatedTours);
    // Save to localStorage
    localStorage.setItem('adminTours', JSON.stringify(updatedTours));
    // Dispatch custom event to notify passenger view
    window.dispatchEvent(new CustomEvent('tourUpdated'));
    
    setShowAddForm(false);
    setEditingTour(null);
  };

  // Package management functions
  const handleAddPackage = () => {
    setEditingPackage(null);
    setShowPackageForm(true);
  };

  const handleEditPackage = (packageData) => {
    setEditingPackage(packageData);
    setShowPackageForm(true);
  };

  const handleDeletePackage = (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      const updatedPackages = packages.filter(pkg => pkg.id !== packageId);
      setPackages(updatedPackages);
      localStorage.setItem('adminPackages', JSON.stringify(updatedPackages));
      // Dispatch custom event to notify passenger view
      window.dispatchEvent(new CustomEvent('packageUpdated'));
    }
  };

  const handleTogglePackageStatus = (packageId) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === packageId ? { ...pkg, isActive: !pkg.isActive } : pkg
    );
    setPackages(updatedPackages);
    localStorage.setItem('adminPackages', JSON.stringify(updatedPackages));
    // Dispatch custom event to notify passenger view
    window.dispatchEvent(new CustomEvent('packageUpdated'));
  };

  const handleSavePackage = (packageData) => {
    let updatedPackages;
    
    if (editingPackage) {
      // Update existing package
      updatedPackages = packages.map(pkg => 
        pkg.id === editingPackage.id ? { ...pkg, ...packageData } : pkg
      );
    } else {
      // Add new package
      const newPackage = {
        ...packageData,
        id: Math.max(...packages.map(p => p.id)) + 1,
        isActive: true,
        options: []
      };
      updatedPackages = [...packages, newPackage];
    }
    
    setPackages(updatedPackages);
    localStorage.setItem('adminPackages', JSON.stringify(updatedPackages));
    // Dispatch custom event to notify passenger view
    window.dispatchEvent(new CustomEvent('packageUpdated'));
    
    setShowPackageForm(false);
    setEditingPackage(null);
  };

  // Package options management functions
  const handleManageOptions = (packageData) => {
    setSelectedPackageForOptions(packageData);
    setShowOptionsModal(true);
  };

  const handleSavePackageOptions = (packageId, updatedOptions) => {
    setPackages(packages.map(pkg => 
      pkg.id === packageId ? { ...pkg, options: updatedOptions } : pkg
    ));
    setShowOptionsModal(false);
    setSelectedPackageForOptions(null);
  };

  const handleCloseOptionsModal = () => {
    setShowOptionsModal(false);
    setSelectedPackageForOptions(null);
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-tour-management">
      <div className="admin-header">
        <h1>Tour Management</h1>
        <p className="admin-subtitle">Manage tour packages and routes</p>
        
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'tours' ? 'active' : ''}`}
            onClick={() => setActiveTab('tours')}
          >
            Tours & Routes
          </button>
          <button 
            className={`tab-button ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            Tour Packages
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="admin-actions">
          {activeTab === 'tours' ? (
            <button className="btn-primary" onClick={handleAddTour}>
              + Add New Tour
            </button>
          ) : (
            <button className="btn-primary" onClick={handleAddPackage}>
              + Add New Package
            </button>
          )}
        </div>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name.toLowerCase()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'tours' ? (
        <div className="tours-table-container">
          <table className="tours-table">
            <thead>
              <tr>
                <th>Tour Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map(tour => (
                <tr key={tour.id}>
                  <td>
                    <div className="tour-info">
                      <img src={tour.imageUrl} alt={tour.title} className="tour-thumbnail" />
                      <div>
                        <div className="tour-title">{tour.title}</div>
                        <div className="tour-description">{tour.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`category-badge category-${tour.category}`}>
                      {tour.category}
                    </span>
                  </td>
                  <td>Rs. {tour.basePrice.toLocaleString()}</td>
                  <td>{tour.availableSeats}</td>
                  <td>
                    <button
                      className={`status-btn ${tour.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(tour.id)}
                    >
                      {tour.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditTour(tour)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteTour(tour.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="packages-table-container">
          <table className="packages-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Description</th>
                <th>Base Price</th>
                <th>Options</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>
                    <div className="package-info">
                      <div className="package-name">{pkg.displayName}</div>
                      <div className="package-type">{pkg.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="package-description">
                      {pkg.description}
                    </div>
                  </td>
                  <td>Rs. {pkg.basePrice.toLocaleString()}</td>
                  <td>
                    <div className="package-options">
                      {pkg.options && pkg.options.length > 0 ? (
                        <div className="options-list">
                          {pkg.options.map(option => (
                            <span key={option.id} className="option-badge">
                              {option.optionType}: {option.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-options">No options</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`status-btn ${pkg.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleTogglePackageStatus(pkg.id)}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditPackage(pkg)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-options"
                        onClick={() => handleManageOptions(pkg)}
                      >
                        Manage Options
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <TourForm
          tour={editingTour}
          categories={categories}
          onSave={handleSaveTour}
          onCancel={() => {
            setShowAddForm(false);
            setEditingTour(null);
          }}
        />
      )}

      {showPackageForm && (
        <PackageForm
          package={editingPackage}
          onSave={handleSavePackage}
          onCancel={() => {
            setShowPackageForm(false);
            setEditingPackage(null);
          }}
        />
      )}

      {showOptionsModal && selectedPackageForOptions && (
        <PackageOptionsModal
          package={selectedPackageForOptions}
          onSave={handleSavePackageOptions}
          onCancel={handleCloseOptionsModal}
        />
      )}
    </div>
  );
};

// Tour Form Component
const TourForm = ({ tour, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    basePrice: tour?.basePrice || '',
    availableSeats: tour?.availableSeats || '',
    description: tour?.description || '',
    category: tour?.category || 'heritage',
    imageUrl: tour?.imageUrl || ''
  });

  const [imagePreview, setImagePreview] = useState(tour?.imageUrl || '');
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'file'
  const [imageLoading, setImageLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update image preview when URL changes
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageLoading(true);
      
      // Convert file to Base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          imageUrl: base64String
        }));
        setImageLoading(false);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="tour-form-modal">
        <div className="modal-header">
          <h2>{tour ? 'Edit Tour' : 'Add New Tour'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="tour-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tour Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div className="form-row">
            <div className="form-group">
              <label>Base Price (Rs.)</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Available Seats</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tour Image</label>
              
              {/* Image Input Type Toggle */}
              <div className="image-input-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${imageInputType === 'url' ? 'active' : ''}`}
                  onClick={() => setImageInputType('url')}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${imageInputType === 'file' ? 'active' : ''}`}
                  onClick={() => setImageInputType('file')}
                >
                  Upload File
                </button>
              </div>

              {/* URL Input */}
              {imageInputType === 'url' && (
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              )}

              {/* File Upload */}
              {imageInputType === 'file' && (
                <div className="file-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                    id="tour-image-upload"
                  />
                  <label htmlFor="tour-image-upload" className="file-upload-label">
                    {imageLoading ? (
                      <>
                        <span className="upload-icon">⏳</span>
                        Processing Image...
                      </>
                    ) : (
                      <>
                        <span className="upload-icon">📁</span>
                        Choose Image File
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="image-preview-container">
                  <img 
                    src={imagePreview} 
                    alt="Tour preview" 
                    className="image-preview"
                    onError={() => setImagePreview('')}
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {tour ? 'Update Tour' : 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Package Form Component
const PackageForm = ({ package: packageData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: packageData?.name || '',
    displayName: packageData?.displayName || '',
    description: packageData?.description || '',
    basePrice: packageData?.basePrice || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="tour-form-modal">
        <div className="modal-header">
          <h2>{packageData ? 'Edit Package' : 'Add New Package'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="tour-form">
          <div className="form-row">
            <div className="form-group">
              <label>Package Name (ID)</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., basic, standard, premium"
                required
              />
            </div>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="e.g., Basic Package"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Base Price (Rs.)</label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {packageData ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Package Options Modal Component
const PackageOptionsModal = ({ package: packageData, onSave, onCancel }) => {
  const [options, setOptions] = useState(packageData.options || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  const handleAddOption = () => {
    setEditingOption(null);
    setShowAddForm(true);
  };

  const handleEditOption = (option) => {
    setEditingOption(option);
    setShowAddForm(true);
  };

  const handleDeleteOption = (optionId) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      setOptions(options.filter(opt => opt.id !== optionId));
    }
  };

  const handleSaveOption = (optionData) => {
    if (editingOption) {
      // Update existing option
      setOptions(options.map(opt => 
        opt.id === editingOption.id ? { ...opt, ...optionData } : opt
      ));
    } else {
      // Add new option
      const newOption = {
        ...optionData,
        id: Math.max(...options.map(o => o.id || 0)) + 1,
        isDefault: false,
        isActive: true
      };
      setOptions([...options, newOption]);
    }
    setShowAddForm(false);
    setEditingOption(null);
  };

  const handleSaveAll = () => {
    onSave(packageData.id, options);
  };

  const optionTypes = ['BREAKFAST', 'HOTEL', 'TRANSPORT'];

  return (
    <div className="modal-overlay">
      <div className="package-options-modal">
        <div className="modal-header">
          <h2>Manage Options - {packageData.displayName}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="options-content">
          <div className="options-header">
            <h3>Package Options</h3>
            <button className="btn-primary" onClick={handleAddOption}>
              + Add Option
            </button>
          </div>

          <div className="options-list">
            {options.length === 0 ? (
              <div className="no-options">
                <p>No options configured for this package.</p>
                <p>Click "Add Option" to get started.</p>
              </div>
            ) : (
              <div className="options-table">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Default</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {options.map(option => (
                      <tr key={option.id}>
                        <td>
                          <span className={`option-type-badge ${option.optionType.toLowerCase()}`}>
                            {option.optionType}
                          </span>
                        </td>
                        <td>{option.name}</td>
                        <td>Rs. {option.price.toLocaleString()}</td>
                        <td>
                          <span className={`default-badge ${option.isDefault ? 'yes' : 'no'}`}>
                            {option.isDefault ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => handleEditOption(option)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteOption(option.id)}
                            >
                              Delete
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

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSaveAll}>
            Save Changes
          </button>
        </div>

        {showAddForm && (
          <OptionForm
            option={editingOption}
            onSave={handleSaveOption}
            onCancel={() => {
              setShowAddForm(false);
              setEditingOption(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Option Form Component
const OptionForm = ({ option, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    optionType: option?.optionType || 'BREAKFAST',
    name: option?.name || '',
    description: option?.description || '',
    price: option?.price || 0,
    isDefault: option?.isDefault || false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="option-form-overlay">
      <div className="option-form-modal">
        <div className="modal-header">
          <h3>{option ? 'Edit Option' : 'Add New Option'}</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="option-form">
          <div className="form-group">
            <label>Option Type</label>
            <select
              name="optionType"
              value={formData.optionType}
              onChange={handleInputChange}
              required
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="HOTEL">Hotel</option>
              <option value="TRANSPORT">Transport</option>
            </select>
          </div>

          <div className="form-group">
            <label>Option Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Continental Breakfast"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="2"
              placeholder="Optional description"
            />
          </div>

          <div className="form-group">
            <label>Price (Rs.)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
              Set as default option for this type
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {option ? 'Update Option' : 'Add Option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTourManagement;

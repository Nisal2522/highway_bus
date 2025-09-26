import React, { useState, useEffect, useRef } from "react";
import { SunIcon, MoonIcon, Menu, X, Search, MapPin, Clock, Bus, User, Edit3, Check, X as XIcon, ChevronDown, ChevronUp, Phone, Mail, Building, IdCard, Eye, EyeOff, Calendar } from "lucide-react";
import "./Navbar.css";
import TouristaLogo from "../assets/Tourista Logo.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isEditingInDropdown, setIsEditingInDropdown] = useState(false);
  const [dropdownEditFormData, setDropdownEditFormData] = useState({});
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Sample search data - replace with your actual data
  const searchData = [
    { id: 1, type: 'route', title: 'Colombo to Kandy', description: 'Daily bus service', icon: Bus },
    { id: 2, type: 'route', title: 'Colombo to Galle', description: 'Express service', icon: Bus },
    { id: 3, type: 'route', title: 'Kandy to Jaffna', description: 'Night service', icon: Bus },
    { id: 4, type: 'location', title: 'Colombo Central', description: 'Main bus terminal', icon: MapPin },
    { id: 5, type: 'location', title: 'Kandy City', description: 'Central bus station', icon: MapPin },
    { id: 6, type: 'schedule', title: 'Morning Schedule', description: '6:00 AM - 12:00 PM', icon: Clock },
    { id: 7, type: 'schedule', title: 'Evening Schedule', description: '2:00 PM - 8:00 PM', icon: Clock },
  ];

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        setEditFormData({
          firstName: userObj.firstName || '',
          lastName: userObj.lastName || '',
          email: userObj.email || '',
          phone: userObj.phone || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        closeUserDropdown();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
      if (event.key === 'Escape' && showUserDropdown) {
        closeUserDropdown();
      }
    };

    if (isSearchOpen || showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      if (isSearchOpen) {
        searchInputRef.current?.focus();
        // Prevent body scroll when search is open
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      // Restore body scroll when search is closed
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen, showUserDropdown]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const filteredResults = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filteredResults);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setSearchQuery("");
    setSearchResults([]);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchResultClick = (result) => {
    console.log('Selected:', result);
    // Handle search result click - navigate or perform action
    closeSearch();
  };

  const getIconComponent = (iconType) => {
    switch (iconType) {
      case Bus: return <Bus size={16} />;
      case MapPin: return <MapPin size={16} />;
      case Clock: return <Clock size={16} />;
      default: return <Search size={16} />;
    }
  };

  const handleLogout = () => {
    // Clear any user session/tokens here if needed
    if (onLogout) {
      onLogout();
    } else {
      // Fallback: clear localStorage manually
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    // Navigate to login page
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Toggle dark mode class on body
    document.body.classList.toggle('dark-mode');
  };

  const handleEditUser = () => {
    setIsEditingUser(true);
  };

  const handleCancelEdit = () => {
    setIsEditingUser(false);
    // Reset form data to original values
    setEditFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleSaveUser = () => {
    // Update user data in localStorage
    const updatedUser = { ...user, ...editFormData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditingUser(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // User dropdown functionality
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    if (!showUserDropdown) {
      setIsEditingInDropdown(false);
      setDropdownEditFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        idNumber: user?.idNumber || '',
        companyName: user?.companyName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });
    }
  };

  const closeUserDropdown = () => {
    setShowUserDropdown(false);
    setIsEditingInDropdown(false);
  };

  const handleDropdownEdit = () => {
    setIsEditingInDropdown(true);
  };

  const handleDropdownCancelEdit = () => {
    setIsEditingInDropdown(false);
    setDropdownEditFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      idNumber: user?.idNumber || '',
      companyName: user?.companyName || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false
    });
  };

  const handleDropdownSave = async () => {
    setIsUpdatingUser(true);
    setUpdateError('');
    setUpdateSuccess('');
    
    // Password validation
    if (dropdownEditFormData.newPassword || dropdownEditFormData.confirmPassword) {
      if (!dropdownEditFormData.currentPassword) {
        setUpdateError('Current password is required to change password');
        setIsUpdatingUser(false);
        return;
      }
      
      if (dropdownEditFormData.newPassword !== dropdownEditFormData.confirmPassword) {
        setUpdateError('New passwords do not match');
        setIsUpdatingUser(false);
        return;
      }
      
      if (dropdownEditFormData.newPassword && dropdownEditFormData.newPassword.length < 6) {
        setUpdateError('New password must be at least 6 characters long');
        setIsUpdatingUser(false);
        return;
      }
    }
    
    // If only current password is provided, still validate it
    if (dropdownEditFormData.currentPassword && !dropdownEditFormData.newPassword) {
      // This is just for verification, no need to validate further
    }
    
    try {
      // Prepare update data
      const updateData = {
        userId: user.id,
        firstName: dropdownEditFormData.firstName,
        lastName: dropdownEditFormData.lastName,
        phone: dropdownEditFormData.phone,
        idNumber: dropdownEditFormData.idNumber,
        companyName: dropdownEditFormData.companyName
      };
      
      // Add password fields if provided
      if (dropdownEditFormData.currentPassword) {
        updateData.currentPassword = dropdownEditFormData.currentPassword;
      }
      if (dropdownEditFormData.newPassword) {
        updateData.newPassword = dropdownEditFormData.newPassword;
      }

      // Call backend API to update user
      const response = await axios.put('http://localhost:8081/api/users/update', updateData);

      if (response.data.success) {
        // Update local storage and state with new data
        const updatedUser = { ...user, ...response.data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditingInDropdown(false);
        
        // Clear password fields
        setDropdownEditFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        // Show success message
        setUpdateSuccess('Profile updated successfully!');
        setTimeout(() => setUpdateSuccess(''), 3000); // Clear after 3 seconds
      } else {
        setUpdateError('Failed to update user');
        console.error('Failed to update user:', response.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).join(', ');
        setUpdateError(errorMessages);
      } else {
        setUpdateError('Failed to update user. Please try again.');
      }
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleDropdownFormChange = (e) => {
    const { name, value } = e.target;
    setDropdownEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
        {/* Logo */}
          <a href="/" className="navbar__brand" aria-label="Tourista Home">
            <img src={TouristaLogo} alt="Tourista" className="navbar__logo" />
          </a>

        {/* User Details Section */}
        {user && (
          <div className="navbar__user-section" ref={userDropdownRef}>
            <div className="navbar__user-icon">
              <User size={20} />
            </div>
            <div className="navbar__user-name">
              {user.firstName}
            </div>
            <button 
              className="navbar__user-dropdown-btn"
              onClick={toggleUserDropdown}
              aria-label="Toggle user dropdown"
            >
              {showUserDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="navbar__user-dropdown">
                <div className="navbar__user-dropdown-content">
                  <button 
                    className="navbar__user-dropdown-close"
                    onClick={closeUserDropdown}
                    aria-label="Close user details"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="navbar__user-dropdown-header">
                    <div className="navbar__user-dropdown-avatar">
                      <User size={24} />
                    </div>
                    <div className="navbar__user-dropdown-info">
                      <div className="navbar__user-dropdown-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="navbar__user-dropdown-email">
                        {user.email}
                      </div>
                    </div>
                  </div>

                <div className="navbar__user-dropdown-divider"></div>

                {isEditingInDropdown ? (
                  <div className="navbar__user-dropdown-edit">
                    <div className="navbar__user-dropdown-form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={dropdownEditFormData.firstName}
                        onChange={handleDropdownFormChange}
                        className="navbar__user-dropdown-input"
                      />
                    </div>
                    <div className="navbar__user-dropdown-form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={dropdownEditFormData.lastName}
                        onChange={handleDropdownFormChange}
                        className="navbar__user-dropdown-input"
                      />
                    </div>
                    <div className="navbar__user-dropdown-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={dropdownEditFormData.email}
                        onChange={handleDropdownFormChange}
                        className="navbar__user-dropdown-input"
                      />
                    </div>
                    <div className="navbar__user-dropdown-form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={dropdownEditFormData.phone}
                        onChange={handleDropdownFormChange}
                        className="navbar__user-dropdown-input"
                      />
                    </div>
                    {user?.userType === 'PASSENGER' && (
                      <div className="navbar__user-dropdown-form-group">
                        <label>ID Number</label>
                        <input
                          type="text"
                          name="idNumber"
                          value={dropdownEditFormData.idNumber}
                          onChange={handleDropdownFormChange}
                          className="navbar__user-dropdown-input"
                        />
                      </div>
                    )}
                    {user?.userType === 'OWNER' && (
                      <div className="navbar__user-dropdown-form-group">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={dropdownEditFormData.companyName}
                          onChange={handleDropdownFormChange}
                          className="navbar__user-dropdown-input"
                        />
                      </div>
                    )}
                    <div className="navbar__user-dropdown-form-group">
                      <label>Current Password</label>
                      <div className="navbar__user-dropdown-input-wrapper">
                        <input
                          type={showPasswords.currentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={dropdownEditFormData.currentPassword || ''}
                          onChange={handleDropdownFormChange}
                          className="navbar__user-dropdown-input"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="navbar__user-dropdown-password-toggle"
                          onClick={() => togglePasswordVisibility('currentPassword')}
                        >
                          {showPasswords.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="navbar__user-dropdown-form-group">
                      <label>New Password</label>
                      <div className="navbar__user-dropdown-input-wrapper">
                        <input
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={dropdownEditFormData.newPassword || ''}
                          onChange={handleDropdownFormChange}
                          className="navbar__user-dropdown-input"
                          placeholder="Enter new password (optional)"
                        />
                        <button
                          type="button"
                          className="navbar__user-dropdown-password-toggle"
                          onClick={() => togglePasswordVisibility('newPassword')}
                        >
                          {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="navbar__user-dropdown-form-group">
                      <label>Confirm New Password</label>
                      <div className="navbar__user-dropdown-input-wrapper">
                        <input
                          type={showPasswords.confirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={dropdownEditFormData.confirmPassword || ''}
                          onChange={handleDropdownFormChange}
                          className="navbar__user-dropdown-input"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="navbar__user-dropdown-password-toggle"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                          {showPasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    {updateError && (
                      <div className="navbar__user-dropdown-error">
                        <span>{updateError}</span>
                      </div>
                    )}
                    {updateSuccess && (
                      <div className="navbar__user-dropdown-success">
                        <span>{updateSuccess}</span>
                      </div>
                    )}
                    <div className="navbar__user-dropdown-form-actions">
                      <button 
                        onClick={handleDropdownSave} 
                        className="navbar__user-dropdown-save-btn"
                        disabled={isUpdatingUser}
                      >
                        {isUpdatingUser ? (
                          <>
                            <div className="navbar__user-dropdown-spinner"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            Save
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleDropdownCancelEdit} 
                        className="navbar__user-dropdown-cancel-btn"
                        disabled={isUpdatingUser}
                      >
                        <XIcon size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="navbar__user-dropdown-details">
                    <div className="navbar__user-dropdown-detail-item">
                      <div className="navbar__user-dropdown-detail-icon">
                        <Phone size={16} />
                      </div>
                      <span>{user?.phone}</span>
                    </div>
                    {user?.userType === 'PASSENGER' && user?.idNumber && (
                      <div className="navbar__user-dropdown-detail-item">
                        <div className="navbar__user-dropdown-detail-icon">
                          <IdCard size={16} />
                        </div>
                        <span>{user?.idNumber}</span>
                      </div>
                    )}
                    {user?.userType === 'OWNER' && user?.companyName && (
                      <div className="navbar__user-dropdown-detail-item">
                        <div className="navbar__user-dropdown-detail-icon">
                          <Building size={16} />
                        </div>
                        <span>{user?.companyName}</span>
                      </div>
                    )}
                    <div className="navbar__user-dropdown-detail-item">
                      <div className="navbar__user-dropdown-detail-icon">
                        <User size={16} />
                      </div>
                      <span className="navbar__user-dropdown-user-type">
                        {user?.userType === 'PASSENGER' ? 'Passenger' : 'Bus Owner'}
                      </span>
                    </div>
                    <div className="navbar__user-dropdown-actions">
                      <button onClick={handleDropdownEdit} className="navbar__user-dropdown-edit-btn">
                        <Edit3 size={14} />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}


              </div>
                </div>
            )}
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="navbar__nav" aria-label="Primary">
          <a href="/" className="navbar__nav-link">
            <span className="navbar__nav-text">Home</span>
            <span className="navbar__nav-underline"></span>
          </a>
          <a href="/about" className="navbar__nav-link">
            <span className="navbar__nav-text">About Us</span>
            <span className="navbar__nav-underline"></span>
          </a>
          <a href="/faq" className="navbar__nav-link">
            <span className="navbar__nav-text">FAQ</span>
            <span className="navbar__nav-underline"></span>
          </a>
          <a href="/contact" className="navbar__nav-link">
            <span className="navbar__nav-text">Contact</span>
            <span className="navbar__nav-underline"></span>
          </a>
          </nav>

        {/* Actions */}
          <div className="navbar__actions">
          {/* Search Button */}
          <button 
            className="navbar__action-btn navbar__search-btn" 
            aria-label="Search"
            onClick={toggleSearch}
          >
            <Search size={20} />
          </button>

          {/* Booking Button - Only for Passengers */}
          {user && user.userType === 'PASSENGER' && (
            <button 
              className="navbar__action-btn navbar__booking-btn" 
              aria-label="View Bookings"
              onClick={() => navigate('/my-bookings')}
            >
              <Calendar size={20} />
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            className="navbar__action-btn navbar__theme-btn" 
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </button>

          {/* Logout Button */}
          <button onClick={handleLogout} className="navbar__login-btn">
            <span className="navbar__login-text">Logout</span>
            <span className="navbar__login-icon">→</span>
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="navbar__mobile-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-modal">
          <div className="search-modal__overlay" onClick={closeSearch} />
          <div className="search-modal__content" ref={searchRef}>
            <div className="search-modal__header">
              <div className="search-modal__input-container">
                <Search size={20} className="search-modal__search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for routes, locations, schedules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-modal__input"
                />
                {searchQuery && (
                  <button 
                    className="search-modal__clear-btn"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {/* Close Button */}
              <button 
                className="search-modal__close-btn"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            <div className="search-modal__body">
              {isLoading ? (
                <div className="search-modal__loading">
                  <div className="search-modal__spinner"></div>
                  <span>Searching...</span>
                </div>
              ) : searchQuery.trim().length > 0 ? (
                searchResults.length > 0 ? (
                  <div className="search-modal__results">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="search-modal__result-item"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="search-modal__result-icon">
                          {getIconComponent(result.icon)}
                        </div>
                        <div className="search-modal__result-content">
                          <h4 className="search-modal__result-title">{result.title}</h4>
                          <p className="search-modal__result-description">{result.description}</p>
                        </div>
                        <div className="search-modal__result-type">
                          {result.type}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-modal__no-results">
                    <Search size={48} />
                    <h3>No results found</h3>
                    <p>Try searching for different keywords</p>
                    <button 
                      className="search-modal__cancel-btn"
                      onClick={closeSearch}
                    >
                      Cancel Search
                    </button>
                  </div>
                )
              ) : (
                <div className="search-modal__suggestions">
                  <h3>Popular Searches</h3>
                  <div className="search-modal__suggestion-tags">
                    <button 
                      className="search-modal__suggestion-tag"
                      onClick={() => setSearchQuery("Colombo to Kandy")}
                    >
                      Colombo to Kandy
                    </button>
                    <button 
                      className="search-modal__suggestion-tag"
                      onClick={() => setSearchQuery("Galle")}
                    >
                      Galle
                    </button>
                    <button 
                      className="search-modal__suggestion-tag"
                      onClick={() => setSearchQuery("Morning Schedule")}
                    >
                      Morning Schedule
                    </button>
                    <button 
                      className="search-modal__suggestion-tag"
                      onClick={() => setSearchQuery("Express Service")}
                    >
                      Express Service
                    </button>
                  </div>
                  <div className="search-modal__cancel-section">
                    <button 
                      className="search-modal__cancel-btn"
                      onClick={closeSearch}
                    >
                      Cancel Search
            </button>
                  </div>
                </div>
              )}
          </div>
        </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <nav className="navbar__mobile-nav">
          {user && (
            <>
              <div className="navbar__mobile-user-section">
                <div className="navbar__mobile-user-icon">
                  <User size={20} />
                </div>
                <div className="navbar__mobile-user-details">
                  <div className="navbar__mobile-user-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="navbar__mobile-user-email">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="navbar__mobile-divider"></div>
            </>
          )}
          <a href="/" className="navbar__mobile-link">Home</a>
          <a href="/about" className="navbar__mobile-link">About Us</a>
          <a href="/faq" className="navbar__mobile-link">FAQ</a>
          <a href="/contact" className="navbar__mobile-link">Contact</a>
          <div className="navbar__mobile-divider"></div>
          <button onClick={handleLogout} className="navbar__mobile-login">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

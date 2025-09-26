import React, { useState } from 'react';
import axios from 'axios';
import busImage from '../assets/bus.jpg';
import { FaUser, FaBus, FaUserTie, FaIdCard, FaBuilding, FaArrowRight, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';

const SignupPage = ({ onSignup }) => {
  const [userType, setUserType] = useState('passenger'); // 'passenger' or 'owner'
  const [currentStep, setCurrentStep] = useState(1); // 1 or 2
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (userType === 'passenger') {
      if (!formData.idNumber) {
        newErrors.idNumber = 'ID number is required';
      }
    } else {
      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        setErrors({});
        setSuccessMessage('');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Prepare data for backend - remove confirmPassword and handle conditional fields
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: userType.toUpperCase()
      };

      // Add conditional fields based on user type
      if (userType === 'passenger') {
        submitData.idNumber = formData.idNumber;
        // Don't send companyName for passengers
      } else {
        submitData.companyName = formData.companyName;
        // Don't send idNumber for owners
      }
      
      console.log('Sending data to backend:', submitData);
      console.log('Full JSON being sent:', JSON.stringify(submitData, null, 2));
      
      // Add timeout and better error handling
      const response = await axios.post('http://localhost:8081/api/users/register', submitData, {
        timeout: 10000 // 10 second timeout
      });
      
      if (response.data.message) {
        setSuccessMessage(`${userType === 'passenger' ? 'Passenger' : 'Bus Owner'} registration successful! Redirecting to login...`);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
      
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setErrors({ general: 'Backend server is not running. Please start the backend server first.' });
      } else if (error.response?.data) {
        const errorData = error.response.data;
        console.log('Error data type:', typeof errorData);
        console.log('Error data keys:', Object.keys(errorData));
        
        // If it's a validation error with field names
        if (typeof errorData === 'object' && !errorData.message) {
          const fieldErrors = {};
          Object.keys(errorData).forEach(field => {
            fieldErrors[field] = errorData[field];
          });
          setErrors(fieldErrors);
        } else if (errorData.error) {
          // If it's a business logic error
          setErrors({ general: errorData.error });
        } else if (errorData.message) {
          // If it's a general error message
          setErrors({ general: errorData.message });
        } else {
          setErrors({ general: 'Registration failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      {/* Left Side - Background Image */}
      <div className="signup-left-side">
        <div className="signup-bg-wrapper">
          <img 
            src={busImage} 
            alt="Highway Express Bus" 
            className="signup-bg-image"
          />
          <div className="signup-bg-overlay"></div>
        </div>
        <div className="signup-left-content">
          <h1 className="signup-hero-title">Welcome to Tourista</h1>
          <p className="signup-hero-subtitle">Your journey begins with a simple registration</p>
          <div className="signup-features">
            <div className="feature-item">
              <FaUser className="feature-icon" />
              <span>Easy Passenger Registration</span>
            </div>
            <div className="feature-item">
              <FaBus className="feature-icon" />
              <span>Bus Owner Management</span>
            </div>
            <div className="feature-item">
              <FaUserTie className="feature-icon" />
              <span>Quick & Simple</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="signup-right-side">
        <div className="signup-form-wrapper">
          <div className="signup-header">
            <h2 className="signup-title">Create Your Account</h2>
            <p className="signup-subtitle">Step {currentStep} of 2 - Choose your account type and start your journey</p>
          </div>

          {currentStep === 1 && (
            <div className="user-type-selector">
              <button
                className={`type-btn ${userType === 'passenger' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('passenger');
                  setErrors({}); // Clear errors when user type changes
                }}
              >
                <FaUser className="type-icon" />
                <span>Passenger</span>
              </button>
              <button
                className={`type-btn ${userType === 'owner' ? 'active' : ''}`}
                onClick={() => {
                  setUserType('owner');
                  setErrors({}); // Clear errors when user type changes
                }}
              >
                <FaBus className="type-icon" />
                <span>Bus Owner</span>
              </button>
            </div>
          )}
          
          {successMessage && (
            <div className="signup-success-message">
              {successMessage}
            </div>
          )}
          
          {errors.general && (
            <div className="signup-error-message">
              {errors.general}
            </div>
          )}
          
          {/* Display field-specific errors */}
          {(errors.firstName || errors.lastName || errors.email || errors.phone || errors.password || errors.idNumber || errors.companyName) && (
            <div className="signup-error-message">
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {errors.firstName && <li>First Name: {errors.firstName}</li>}
                {errors.lastName && <li>Last Name: {errors.lastName}</li>}
                {errors.email && <li>Email: {errors.email}</li>}
                {errors.phone && <li>Phone: {errors.phone}</li>}
                {errors.password && <li>Password: {errors.password}</li>}
                {errors.idNumber && <li>ID Number: {errors.idNumber}</li>}
                {errors.companyName && <li>Company Name: {errors.companyName}</li>}
              </ul>
            </div>
          )}
          
          <form onSubmit={currentStep === 1 ? handleNext : handleSubmit} className="signup-form">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="form-section">
                <h3 className="section-title">
                  {userType === 'passenger' ? <FaUser /> : <FaBuilding />}
                  {userType === 'passenger' ? 'Passenger Information' : 'Business Information'}
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      <FaUserTie />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'input-error' : 'form-input'}
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <span className="error-text">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      <FaUserTie />
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'input-error' : 'form-input'}
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <span className="error-text">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                {userType === 'passenger' ? (
                  <div className="form-group">
                    <label htmlFor="idNumber">
                      <FaIdCard />
                      ID Number
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className={errors.idNumber ? 'input-error' : 'form-input'}
                      placeholder="Enter your ID number"
                      disabled={isLoading}
                    />
                    {errors.idNumber && (
                      <span className="error-text">{errors.idNumber}</span>
                    )}
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="companyName">
                      <FaBuilding />
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={errors.companyName ? 'input-error' : 'form-input'}
                      placeholder="Enter your company name"
                      disabled={isLoading}
                    />
                    {errors.companyName && (
                      <span className="error-text">{errors.companyName}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Contact & Security Information */}
            {currentStep === 2 && (
              <>
                <div className="form-section">
                  <h3 className="section-title">
                    <FaEnvelope />
                    Contact Information
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">
                        <FaEnvelope />
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'input-error' : 'form-input'}
                        placeholder="Enter your email address"
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <span className="error-text">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">
                        <FaPhone />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'input-error' : 'form-input'}
                        placeholder="Enter your phone number"
                        disabled={isLoading}
                      />
                      {errors.phone && (
                        <span className="error-text">{errors.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    <FaLock />
                    Security
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password">
                        <FaLock />
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'input-error' : 'form-input'}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      {errors.password && (
                        <span className="error-text">{errors.password}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">
                        <FaLock />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'input-error' : 'form-input'}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      {errors.confirmPassword && (
                        <span className="error-text">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep === 2 && (
                <button 
                  type="button" 
                  className="back-button" 
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <FaArrowLeft className="back-icon" />
                  Back
                </button>
              )}
              
              <button 
                type="submit" 
                className={currentStep === 1 ? "next-button" : "signup-button"} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Processing...
                  </>
                ) : currentStep === 1 ? (
                  <>
                    Next Step
                    <FaArrowRight className="next-icon" />
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight className="next-icon" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="signup-footer">
            <p className="login-text">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="login-link"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/login';
                }}
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

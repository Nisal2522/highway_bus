import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaBus, FaArrowRight, FaEnvelope, FaShieldAlt, FaRocket, FaCheckCircle, FaStar, FaHeart, FaUserTie } from 'react-icons/fa';
import busImage from '../assets/bus.jpg';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Check if this is admin login with dummy credentials
      const dummyAdminCredentials = {
        email: 'admin@highwayexpress.com',
        password: 'admin123'
      };

      if (formData.email === dummyAdminCredentials.email && formData.password === dummyAdminCredentials.password) {
        console.log('✅ Admin login successful with dummy credentials');
        
        // Create dummy admin data
        const adminData = {
          id: 'admin-001',
          email: formData.email,
          firstName: 'System',
          lastName: 'Administrator',
          userType: 'ADMIN',
          phone: '+1234567890',
          isAuthenticated: true
        };

        // Store admin data in localStorage
        localStorage.setItem('user', JSON.stringify(adminData));
        localStorage.setItem('token', 'dummy-admin-token-' + Date.now());
        localStorage.setItem('userType', 'ADMIN');
        localStorage.setItem('userId', adminData.id);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer dummy-admin-token`;
        
        // Pass admin data to parent component
        onLogin(adminData);
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
        
      } else {
        // Regular user login (PASSENGER or OWNER)
        console.log('🔐 Attempting regular user login...');
        
        const response = await axios.post('http://localhost:8081/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.data.success) {
          const loginData = response.data.data;
          
          console.log('✅ Regular user login successful:', loginData);
          
          // Store user data and token in localStorage
          localStorage.setItem('user', JSON.stringify({
            id: loginData.userId,
            email: loginData.email,
            firstName: loginData.firstName,
            lastName: loginData.lastName,
            userType: loginData.userType,
            phone: loginData.phone,
            isAuthenticated: true
          }));
          
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('userId', loginData.userId);
          localStorage.setItem('userType', loginData.userType);
          
          // Set default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;
          
          // Pass user data to parent component
          onLogin({
            id: loginData.userId,
            email: loginData.email,
            firstName: loginData.firstName,
            lastName: loginData.lastName,
            userType: loginData.userType,
            phone: loginData.phone,
            isAuthenticated: true
          });
        } else {
          setErrors({ general: response.data.message || 'Login failed' });
        }
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      
      if (error.code === 'ECONNABORTED') {
        setErrors({ general: 'Request timeout. Please check your connection and try again.' });
      } else if (error.code === 'ERR_NETWORK') {
        setErrors({ general: 'Network error. Please check if the server is running and try again.' });
      } else if (error.response) {
        // Server responded with error status
        console.log('📡 Error response status:', error.response.status);
        console.log('📦 Error response data:', error.response.data);
        
        if (error.response.status === 400) {
          setErrors({ general: error.response.data.message || 'Invalid email or password. Please check your credentials.' });
        } else if (error.response.status === 401) {
          setErrors({ general: 'Invalid credentials. Please check your email and password.' });
        } else if (error.response.status === 404) {
          setErrors({ general: 'Login service not found. Please contact support.' });
        } else if (error.response.status === 500) {
          setErrors({ general: 'Server error. Please try again later.' });
        } else {
          setErrors({ general: error.response.data.message || 'Login failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Login failed. Please check your connection and try again.' });
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
              <span>Welcome Back Passenger</span>
            </div>
            <div className="feature-item">
              <FaBus className="feature-icon" />
              <span>Manage Your Bus Services</span>
            </div>
            <div className="feature-item">
              <FaUserTie className="feature-icon" />
              <span>Secure & Fast Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Professional Login Form */}
      <div className="signup-right-side">
        <div className="signup-form-wrapper">
          {/* Professional Header */}
          <div className="signup-header">
            <div className="login-welcome-badge">
              <FaCheckCircle className="welcome-icon" />
              <span>Welcome Back!</span>
            </div>
            <h2 className="signup-title">Sign In to Your Account</h2>
            <p className="signup-subtitle">Enter your credentials to continue your journey</p>
            <div className="login-underline"></div>
          </div>

          {errors.general && (
            <div className="signup-error-message">
              <div className="error-icon">⚠</div>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="label-icon" />
                <span>EMAIL ADDRESS</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`signup-input ${errors.email ? 'signup-input-error' : ''}`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
                <div className="input-focus-border"></div>
              </div>
              {errors.email && (
                <div className="error-message">
                  <span className="error-dot">•</span>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="label-icon" />
                <span>PASSWORD</span>
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`signup-input password-input ${errors.password ? 'signup-input-error' : ''}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="input-focus-border"></div>
              </div>
              {errors.password && (
                <div className="error-message">
                  <span className="error-dot">•</span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Form Options */}
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" />
                <span className="checkmark"></span>
                <span className="checkbox-text">Remember me for 30 days</span>
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            {/* Professional Submit Button */}
            <button
              type="submit"
              className="signup-button login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="signup-loading"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight className="btn-icon" />
                </>
              )}
            </button>
          </form>



          {/* Professional Footer */}
          <div className="signup-footer">
            <p className="signup-login-text">
              Don't have an account?{' '}
              <a href="/signup" className="signup-login-link">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

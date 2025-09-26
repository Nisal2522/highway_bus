import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Bus, User, Phone, Mail, CreditCard, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './ViewBooking.css';

const ViewBooking = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user bookings
  const fetchUserBookings = async () => {
    if (!isAuthenticated || !user) {
      setError('Please log in to view your bookings');
      setLoading(false);
      return;
    }

    if (!user.id) {
      setError('User ID not available. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching bookings for user:', user.id);
      
      const response = await fetch(`http://localhost:8081/api/bookings/user/${user.id}`);
      
      if (!response.ok) {
        let errorMessage = 'Failed to fetch bookings';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      
      const userBookings = await response.json();
      console.log('User bookings loaded:', userBookings);
      setBookings(userBookings);
      
    } catch (err) {
      console.error('Error fetching user bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserBookings();
    setRefreshing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format booking status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle size={16} className="status-confirmed" />;
      case 'CANCELLED':
        return <AlertCircle size={16} className="status-cancelled" />;
      case 'COMPLETED':
        return <CheckCircle size={16} className="status-completed" />;
      case 'PENDING_PAYMENT':
        return <AlertCircle size={16} className="status-pending" />;
      default:
        return <AlertCircle size={16} className="status-unknown" />;
    }
  };

  // Parse selected seats
  const parseSelectedSeats = (selectedSeatsString) => {
    try {
      if (!selectedSeatsString) return [];
      const seats = JSON.parse(selectedSeatsString);
      return Array.isArray(seats) ? seats : [];
    } catch (error) {
      console.error('Error parsing selected seats:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="view-booking-error">
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your bookings.</p>
          <button onClick={() => navigate('/login')} className="login-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-booking">
      <div className="view-booking-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-content">
          <h1>My Bookings</h1>
          <p>View and manage your bus bookings</p>
        </div>
        <button 
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="view-booking-container">
        {loading ? (
          <div className="loading-container">
            <RefreshCw size={32} className="spinning" />
            <p>Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertCircle size={48} className="error-icon" />
            <h2>Error Loading Bookings</h2>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-button">
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-container">
            <Calendar size={48} className="empty-icon" />
            <h2>No Bookings Found</h2>
            <p>You haven't made any bookings yet.</p>
            <button onClick={() => navigate('/passenger-home')} className="book-now-button">
              Book a Bus
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-id">
                    <span className="label">Booking ID:</span>
                    <span className="value">#{booking.id}</span>
                  </div>
                  <div className="booking-status">
                    {getStatusIcon(booking.bookingStatus)}
                    <span className={`status ${booking.bookingStatus.toLowerCase()}`}>
                      {booking.bookingStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="booking-content">
                  <div className="booking-details">
                    <div className="detail-section">
                      <h3>Route Information</h3>
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{booking.fromLocation} → {booking.toLocation}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <span>Departure: {booking.departureTime}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <span>Arrival: {booking.arrivalTime}</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Bus Information</h3>
                      <div className="detail-item">
                        <Bus size={16} />
                        <span>{booking.busName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Registration:</span>
                        <span>{booking.registrationNumber}</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Passenger Information</h3>
                      <div className="detail-item">
                        <User size={16} />
                        <span>{booking.passengerName}</span>
                      </div>
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{booking.passengerEmail}</span>
                      </div>
                      <div className="detail-item">
                        <Phone size={16} />
                        <span>{booking.passengerPhone}</span>
                      </div>
                      {booking.passengerNic && (
                        <div className="detail-item">
                          <span className="label">NIC:</span>
                          <span>{booking.passengerNic}</span>
                        </div>
                      )}
                    </div>

                    <div className="detail-section">
                      <h3>Seat Information</h3>
                      <div className="detail-item">
                        <span className="label">Selected Seats:</span>
                        <span className="seats">
                          {parseSelectedSeats(booking.selectedSeats).join(', ') || 'N/A'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Number of Seats:</span>
                        <span>{booking.numberOfSeats}</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-summary">
                    <div className="summary-item">
                      <CreditCard size={16} />
                      <span>Total Price:</span>
                      <span className="price">Rs. {booking.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="summary-item">
                      <Calendar size={16} />
                      <span>Booking Date:</span>
                      <span>{formatDate(booking.bookingDate)}</span>
                    </div>
                    {booking.travelDate && (
                      <div className="summary-item">
                        <Calendar size={16} />
                        <span>Travel Date:</span>
                        <span>{formatDate(booking.travelDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBooking;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Bus, CreditCard, Edit, Trash2, Eye, RefreshCw, AlertCircle, CheckCircle, XCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import './MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        const userObj = JSON.parse(userData);
        
        if (userObj.id) {
          setUser(userObj);
          fetchBookings(userObj.id);
        } else {
          setError('User ID not found. Please login again.');
          setLoading(false);
        }
      } catch (error) {
        setError('Error loading user data');
        setLoading(false);
      }
    } else {
      setError('User not authenticated. Please login first.');
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8081/api/bookings/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle different response formats
        let bookingsArray = [];
        if (Array.isArray(data)) {
          bookingsArray = data;
        } else if (data.bookings && Array.isArray(data.bookings)) {
          bookingsArray = data.bookings;
        } else if (data.data && Array.isArray(data.data)) {
          bookingsArray = data.data;
        }
        
        setBookings(bookingsArray);
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to fetch bookings (Status: ${response.status})`);
      }
    } catch (error) {
      setError(`Network error: ${error.message}. Please check if the backend server is running.`);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user || !user.id) return;
    
    try {
      const response = await fetch(`http://localhost:8081/api/users/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(userData));
        // Update the user state
        setUser(userData);
        return userData;
      }
    } catch (error) {
      // Silently handle error - user data refresh is not critical
    }
  };

  const handleRefresh = async () => {
    if (user) {
      // First refresh user data, then fetch bookings
      await refreshUserData();
      fetchBookings(user.id);
    }
  };

  const handleViewBooking = (booking) => {
    // Navigate to booking details page or show modal
    alert(`Booking Details:\n\nBooking ID: ${booking.id}\nRoute: ${booking.fromLocation} → ${booking.toLocation}\nBus: ${booking.busName} (${booking.registrationNumber})\nSeats: ${booking.selectedSeats}\nTotal: Rs. ${booking.totalPrice}\nStatus: ${booking.bookingStatus}\nPayment: ${booking.paymentStatus}`);
  };

  const handleEditBooking = (booking) => {
    // Navigate to edit booking page
    navigate('/edit-booking', {
      state: { booking: booking }
    });
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove booking from local state
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
        // Show success message without blocking alert
        console.log('Booking deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete booking: ${errorData.message}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleDownloadTicket = (booking) => {
    const doc = new jsPDF();
    
    // Header with background color
    doc.setFillColor(30, 58, 138); // Navy blue
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company name in white
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('HIGHWAY EXPRESS', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('BUS TICKET', 105, 30, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Decorative line with color
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(2);
    doc.line(20, 45, 190, 45);
    
    // Add a decorative box around the ticket
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.rect(15, 50, 180, 200);
    
    // Booking ID in a highlighted box
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(20, 55, 170, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`BOOKING ID: #${booking.id}`, 105, 65, { align: 'center' });
    
    // Reset colors
    doc.setTextColor(0, 0, 0);
    
    // Passenger details section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PASSENGER INFORMATION', 25, 85);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Name: ${booking.passengerName}`, 25, 95);
    doc.text(`Email: ${booking.passengerEmail}`, 25, 105);
    doc.text(`Phone: ${booking.passengerPhone}`, 25, 115);
    
    // Route information with colored background
    doc.setFillColor(240, 249, 255); // Light blue
    doc.rect(20, 125, 170, 35, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ROUTE INFORMATION', 25, 135);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`From: ${booking.fromLocation}`, 25, 145);
    doc.text(`To: ${booking.toLocation}`, 25, 155);
    doc.text(`Departure: ${booking.departureTime}`, 100, 145);
    doc.text(`Arrival: ${booking.arrivalTime}`, 100, 155);
    
    // Bus information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('BUS INFORMATION', 25, 175);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Bus: ${booking.busName}`, 25, 185);
    doc.text(`Registration: ${booking.registrationNumber}`, 25, 195);
    
    // Seat and payment with colored background
    doc.setFillColor(240, 249, 255);
    doc.rect(20, 205, 170, 35, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('SEAT & PAYMENT DETAILS', 25, 215);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const seats = JSON.parse(booking.selectedSeats || '[]');
    doc.text(`Seats: ${seats.join(', ')}`, 25, 225);
    doc.text(`Total Amount: Rs. ${booking.totalPrice}`, 25, 235);
    doc.text(`Status: ${booking.bookingStatus}`, 100, 225);
    doc.text(`Payment: ${booking.paymentStatus}`, 100, 235);
    
    // Booking date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Booking Date: ${formatDate(booking.bookingDate)}`, 25, 250);
    
    // Add decorative elements
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.line(20, 255, 190, 255);
    
    // Footer with background
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 260, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing Highway Express!', 105, 275, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Safe travels and have a great journey!', 105, 285, { align: 'center' });
    
    // Add a small decorative element
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(2);
    doc.line(80, 290, 130, 290);
    
    // Save the PDF
    doc.save(`ticket-${booking.id}.pdf`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle size={16} className="status-icon confirmed" />;
      case 'PENDING':
        return <Clock size={16} className="status-icon pending" />;
      case 'CANCELLED':
        return <XCircle size={16} className="status-icon cancelled" />;
      default:
        return <AlertCircle size={16} className="status-icon unknown" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="my-bookings">
        <div className="my-bookings-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="header-content">
            <h1>My Bookings</h1>
            {user && (
              <div className="user-info">
                <span className="user-name">{user.firstName} {user.lastName}</span>
                <span className="user-id">ID: {user.id}</span>
              </div>
            )}
          </div>
          <button className="refresh-button" disabled>
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>

        <div className="bookings-container">
          <div className="bookings-table-container">
            <div className="skeleton-table">
              <div className="skeleton-header">
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
                <div className="skeleton-cell"></div>
              </div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="skeleton-row">
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                  <div className="skeleton-cell"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings">
        <div className="my-bookings-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>My Bookings</h1>
        </div>
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <h2>Error Loading Bookings</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <div className="my-bookings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-content">
          <h1>My Bookings</h1>
          {user && (
            <div className="user-info">
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span className="user-id">ID: {user.id}</span>
            </div>
          )}
        </div>
        <button className="refresh-button" onClick={handleRefresh}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>


      <div className="bookings-container">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <Calendar size={64} className="no-bookings-icon" />
            <h2>No Bookings Found</h2>
            <p>You haven't made any bookings yet.</p>
            <button className="book-now-button" onClick={() => navigate('/passenger-home')}>
              <Bus size={16} />
              Book a Trip
            </button>
          </div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Route</th>
                  <th>Bus</th>
                  <th>Seats</th>
                  <th>Passenger</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="booking-row">
                    <td className="booking-id-cell">
                      <span className="booking-id">#{booking.id}</span>
                    </td>
                    <td className="route-cell">
                      <div className="route-info">
                        <MapPin size={14} />
                        <span>{booking.fromLocation} → {booking.toLocation}</span>
                      </div>
                      <div className="route-times">
                        <div className="time-info">
                          <Clock size={12} />
                          <span>{booking.departureTime}</span>
                        </div>
                        <div className="time-info">
                          <Clock size={12} />
                          <span>{booking.arrivalTime}</span>
                        </div>
                      </div>
                    </td>
                    <td className="bus-cell">
                      <div className="bus-info">
                        <Bus size={14} />
                        <span>{booking.busName}</span>
                      </div>
                      <div className="bus-registration">
                        {booking.registrationNumber}
                      </div>
                    </td>
                    <td className="seats-cell">
                      <div className="seats-list">
                        {JSON.parse(booking.selectedSeats || '[]').map((seat, index) => (
                          <span key={index} className="seat-badge">{seat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="passenger-cell">
                      <span>{booking.passengerName}</span>
                    </td>
                    <td className="amount-cell">
                      <div className="payment-info">
                        <CreditCard size={14} />
                        <span>Rs. {booking.totalPrice}</span>
                      </div>
                      <div className="payment-status">
                        {booking.paymentStatus}
                      </div>
                    </td>
                    <td className="status-cell">
                      <div className="booking-status">
                        {getStatusIcon(booking.bookingStatus)}
                        <span 
                          className="status-text"
                          style={{ color: getStatusColor(booking.bookingStatus) }}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </td>
                    <td className="date-cell">
                      <div className="booking-date">
                        <Calendar size={12} />
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div className="booking-actions">
                        <button 
                          className="action-button view-button"
                          onClick={() => handleViewBooking(booking)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        
                        <button 
                          className="action-button download-button"
                          onClick={() => handleDownloadTicket(booking)}
                          title="Download Ticket"
                        >
                          <Download size={14} />
                        </button>
                        
                        {booking.bookingStatus === 'CONFIRMED' && (
                          <button 
                            className="action-button edit-button"
                            onClick={() => handleEditBooking(booking)}
                            title="Edit Booking"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        
                        {booking.bookingStatus !== 'CANCELLED' && (
                          <button 
                            className="action-button delete-button"
                            onClick={() => handleDeleteBooking(booking.id)}
                            title="Cancel Booking"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
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
  );
};

export default MyBookings;

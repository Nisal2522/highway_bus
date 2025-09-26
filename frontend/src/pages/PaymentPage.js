import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, CheckCircle, MapPin, Clock, Bus, CreditCard } from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get booking details from navigation state or use demo data
  const bookingDetails = location.state?.bookingDetails || {
    selectedSeats: [12, 13, 14],
    pricePerSeat: 1800,
    totalPrice: 5400,
    route: {
      fromLocation: 'Colombo',
      toLocation: 'Kandy',
      departureTime: '08:00 AM',
      arrivalTime: '11:00 AM'
    },
    bus: {
      busName: 'Express Bus 001',
      registrationNumber: 'WP-ABC-1234'
    },
    passenger: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+94 77 123 4567',
      nic: '123456789V'
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setPaymentSuccess(true);
    setShowPayment(false);
    
    // Process the booking after successful payment
    await processBooking(paymentData);
  };

  const processBooking = async (paymentData) => {
    try {
      // Validate required data
      if (!bookingDetails.route?.id || !bookingDetails.bus?.id) {
        throw new Error('Missing route or bus information');
      }

      if (!bookingDetails.selectedSeats || bookingDetails.selectedSeats.length === 0) {
        throw new Error('No seats selected for booking');
      }

      // Prepare booking data with payment information
      const bookingData = {
        userId: 1, // Default user ID
        routeId: bookingDetails.route.id,
        busId: bookingDetails.bus.id,
        passengerName: bookingDetails.passenger.name,
        passengerEmail: bookingDetails.passenger.email,
        passengerPhone: bookingDetails.passenger.phone,
        passengerNic: bookingDetails.passenger.nic || '',
        numberOfSeats: bookingDetails.selectedSeats.length,
        selectedSeats: JSON.stringify(bookingDetails.selectedSeats),
        totalPrice: bookingDetails.totalPrice,
        paymentMethod: paymentData.method,
        transactionId: paymentData.transactionId,
        paymentStatus: 'COMPLETED'
      };

      // Check if backend is running first
      try {
        const healthCheck = await fetch('http://localhost:8081/api/bookings/health', {
          method: 'GET',
          signal: AbortSignal.timeout(3000) // 3 second timeout for health check
        });
        if (!healthCheck.ok) {
          throw new Error('Backend server is not responding properly');
        }
      } catch (healthError) {
        throw new Error('Backend server is not running. Please start the backend server first.');
      }

      // Make API call to create booking with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('http://localhost:8081/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const bookingResult = await response.json();
        
        // Show success message with booking details
        setTimeout(() => {
          alert(`🎉 Booking & Payment Successful!\n\nBooking ID: ${bookingResult.id}\nTransaction ID: ${paymentData.transactionId}\nPayment Method: ${paymentData.method}\nSelected seats: ${bookingDetails.selectedSeats.join(', ')}\nTotal Paid: Rs. ${bookingDetails.totalPrice}\n\nYour booking has been confirmed and seats are now occupied!`);
          
          // Navigate back to seat booking to show updated seat status
          if (location.state?.fromSeatBooking) {
            navigate('/seat-booking', {
              state: {
                route: bookingDetails.route,
                selectedBus: bookingDetails.bus,
                bookingCompleted: true,
                bookedSeats: bookingDetails.selectedSeats
              }
            });
          } else {
            navigate('/passenger-home');
          }
        }, 1500);
      } else {
        let errorMessage = 'Server error occurred';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Show error but still show payment success
        setTimeout(() => {
          const isServerError = errorMessage.includes('HTTP 5') || errorMessage.includes('HTTP 4');
          const suggestion = isServerError ? '\n\n💡 Solution: Check if the backend server is running properly and the database is connected.' : '';
          
          alert(`⚠️ Payment successful but booking failed!\n\nPayment Method: ${paymentData.method}\nTransaction ID: ${paymentData.transactionId}\nAmount: Rs. ${paymentData.amount}\n\nError: ${errorMessage}${suggestion}\n\nPlease contact support with your transaction ID.`);
          
          // Navigate back anyway
          if (location.state?.fromSeatBooking) {
            navigate('/seat-booking', {
              state: {
                route: bookingDetails.route,
                selectedBus: bookingDetails.bus
              }
            });
          } else {
            navigate('/passenger-home');
          }
        }, 1500);
      }
    } catch (error) {
      // Handle different types of errors
      let errorMessage = 'Unknown error occurred';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - server is not responding (10 seconds)';
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error - cannot connect to server (check if backend is running)';
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Connection failed - backend server is not running';
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Error: ${error.name || 'Unknown'} - ${error.toString()}`;
      }
      
      // Show error but still show payment success
      setTimeout(() => {
        const isBackendError = errorMessage.includes('Backend server') || errorMessage.includes('Connection failed') || errorMessage.includes('Network error');
        const suggestion = isBackendError ? '\n\n💡 Solution: Please start the backend server by running "start-backend.bat" or "start-backend-universal.ps1" in the project root directory.' : '';
        
        alert(`⚠️ Payment successful but booking failed!\n\nPayment Method: ${paymentData.method}\nTransaction ID: ${paymentData.transactionId}\nAmount: Rs. ${paymentData.amount}\n\nError: ${errorMessage}${suggestion}\n\nPlease contact support with your transaction ID.`);
        
        // Navigate back anyway
        if (location.state?.fromSeatBooking) {
          navigate('/seat-booking', {
            state: {
              route: bookingDetails.route,
              selectedBus: bookingDetails.bus
            }
          });
        } else {
          navigate('/passenger-home');
        }
      }, 1500);
    }
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error}`);
  };

  const handleClose = () => {
    if (location.state?.fromSeatBooking) {
      navigate('/seat-booking');
    } else {
      navigate('/passenger-home');
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-page-header">
        <button className="back-to-booking" onClick={handleClose}>
          <ArrowLeft size={20} />
          Back to Booking
        </button>
        <h1>Secure Payment</h1>
        <div className="security-badges">
          <div className="security-badge">
            <Shield size={16} />
            <span>SSL Secured</span>
          </div>
          <div className="security-badge">
            <Lock size={16} />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>

      <div className="payment-page-content">
        <div className="booking-summary-card">
          <h2>Booking Summary</h2>
          <div className="summary-details">
            <div className="summary-section">
              <h3>Route Information</h3>
              
              {/* Main Route Display */}
              <div className="route-main-info">
                <div className="route-location">
                  <MapPin size={18} />
                  <span>{bookingDetails.route.fromLocation}</span>
                </div>
                <div className="route-arrow">→</div>
                <div className="route-location">
                  <MapPin size={18} />
                  <span>{bookingDetails.route.toLocation}</span>
                </div>
              </div>

              {/* Route Details Grid */}
              <div className="route-details-grid">
                <div className="route-detail-item">
                  <Clock size={18} className="route-detail-icon" />
                  <div>
                    <div className="route-detail-label">Departure</div>
                    <div className="route-detail-value">{bookingDetails.route.departureTime}</div>
                  </div>
                </div>
                
                <div className="route-detail-item">
                  <Clock size={18} className="route-detail-icon" />
                  <div>
                    <div className="route-detail-label">Arrival</div>
                    <div className="route-detail-value">{bookingDetails.route.arrivalTime}</div>
                  </div>
                </div>
                
                <div className="route-detail-item">
                  <Bus size={18} className="route-detail-icon" />
                  <div>
                    <div className="route-detail-label">Bus</div>
                    <div className="route-detail-value">{bookingDetails.bus.busName} ({bookingDetails.bus.registrationNumber})</div>
                  </div>
                </div>
                
                <div className="route-detail-item">
                  <CreditCard size={18} className="route-detail-icon" />
                  <div>
                    <div className="route-detail-label">Price</div>
                    <div className="route-detail-value">Rs. {bookingDetails.route.ticketPrice} per seat</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Passenger Details</h3>
              <div className="detail-row">
                <span>Name:</span>
                <span>{bookingDetails.passenger.name}</span>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <span>{bookingDetails.passenger.email}</span>
              </div>
              <div className="detail-row">
                <span>Phone:</span>
                <span>{bookingDetails.passenger.phone}</span>
              </div>
            </div>

            <div className="summary-section">
              <h3>Payment Summary</h3>
              <div className="detail-row">
                <span>Selected Seats:</span>
                <span>{bookingDetails.selectedSeats.join(', ')}</span>
              </div>
              <div className="detail-row">
                <span>Price per Seat:</span>
                <span>Rs. {bookingDetails.pricePerSeat.toLocaleString()}</span>
              </div>
              <div className="detail-row total">
                <span>Total Amount:</span>
                <span>Rs. {bookingDetails.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <PaymentGateway
            isOpen={showPayment}
            onClose={handleClose}
            bookingDetails={bookingDetails}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>

      {paymentSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <CheckCircle size={48} color="#10b981" />
            <h3>Payment Successful!</h3>
            <p>Your booking has been confirmed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
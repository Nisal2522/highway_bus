import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  CheckCircle, 
  Lock,
  Shield,
  Clock,
  ArrowRight,
  X,
  Star,
  Users,
  Zap,
  Bus,
  MapPin
} from 'lucide-react';
import PaymentGateway from '../components/PaymentGateway';
import './PaymentDemo.css';

const PaymentDemo = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState('bus');

  const demoBookings = {
    bus: {
      title: 'Bus Ticket Booking',
      description: 'Colombo to Kandy Express',
      details: {
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
      }
    },
    tour: {
      title: 'Tour Package Booking',
      description: '3-Day Cultural Tour',
      details: {
        selectedSeats: [1, 2],
        pricePerSeat: 25000,
        totalPrice: 50000,
        route: {
          fromLocation: 'Colombo',
          toLocation: 'Cultural Triangle',
          departureTime: '06:00 AM',
          arrivalTime: '06:00 PM'
        },
        bus: {
          busName: 'Tour Bus Premium',
          registrationNumber: 'WP-XYZ-5678'
        },
        passenger: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+94 71 987 6543',
          nic: '987654321V'
        }
      }
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={24} />,
      description: 'Visa, Mastercard, American Express',
      color: '#3B82F6',
      features: ['Secure encryption', 'Instant processing', 'Global acceptance'],
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet size={24} />,
      description: 'Pay with your PayPal account',
      color: '#0070BA',
      features: ['Buyer protection', 'No card details needed', 'International support'],
      popular: true
    },
    {
      id: 'mobile',
      name: 'Mobile Wallet',
      icon: <Smartphone size={24} />,
      description: 'Apple Pay, Google Pay, Samsung Pay',
      color: '#10B981',
      features: ['Biometric authentication', 'One-tap payment', 'Enhanced security'],
      popular: false
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 size={24} />,
      description: 'Direct bank transfer',
      color: '#8B5CF6',
      features: ['Low fees', 'Bank-level security', 'Direct from account'],
      popular: false
    },
    {
      id: 'cod',
      name: 'Cash on Board',
      icon: <Wallet size={24} />,
      description: 'Pay when you board the bus',
      color: '#F59E0B',
      features: ['No online payment', 'Pay on arrival', 'Traditional method'],
      popular: false
    }
  ];

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setPaymentSuccess(true);
    setShowPayment(false);
    
    // Show success message
    setTimeout(() => {
      alert(`🎉 Payment Successful!\n\nMethod: ${paymentData.method}\nTransaction ID: ${paymentData.transactionId}\nAmount: Rs. ${paymentData.amount}\n\nYour booking has been confirmed!`);
      setPaymentSuccess(false);
    }, 1000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error}`);
    setShowPayment(false);
  };

  const currentBooking = demoBookings[selectedDemo];

  return (
    <div className="payment-demo">
      <div className="demo-header">
        <h1>🚌 Highway Express Payment Demo</h1>
        <p>Experience our modern, secure payment system with multiple payment options</p>
      </div>

      <div className="demo-container">
        <div className="demo-sidebar">
          <div className="demo-selector">
            <h3>Demo Scenarios</h3>
            <div className="scenario-options">
              <button 
                className={`scenario-btn ${selectedDemo === 'bus' ? 'active' : ''}`}
                onClick={() => setSelectedDemo('bus')}
              >
                <Bus size={16} />
                Bus Booking
              </button>
              <button 
                className={`scenario-btn ${selectedDemo === 'tour' ? 'active' : ''}`}
                onClick={() => setSelectedDemo('tour')}
              >
                <MapPin size={16} />
                Tour Package
              </button>
            </div>
          </div>

          <div className="payment-methods-preview">
            <h3>Available Payment Methods</h3>
            <div className="methods-grid">
              {paymentMethods.map((method) => (
                <div key={method.id} className="method-card">
                  <div className="method-icon" style={{ color: method.color }}>
                    {method.icon}
                  </div>
                  <div className="method-info">
                    <div className="method-name">
                      {method.name}
                      {method.popular && <Star size={12} color="#fbbf24" />}
                    </div>
                    <div className="method-description">{method.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="security-features">
            <h3>Security Features</h3>
            <div className="features-list">
              <div className="feature-item">
                <Shield size={16} />
                <span>SSL Encryption</span>
              </div>
              <div className="feature-item">
                <Lock size={16} />
                <span>PCI Compliance</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>Fraud Protection</span>
              </div>
              <div className="feature-item">
                <Zap size={16} />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-main">
          <div className="booking-preview">
            <div className="booking-header">
              <h2>{currentBooking.title}</h2>
              <p>{currentBooking.description}</p>
            </div>

            <div className="booking-details">
              <div className="detail-section">
                <h4>Route Information</h4>
                <div className="detail-item">
                  <span>From:</span>
                  <span>{currentBooking.details.route.fromLocation}</span>
                </div>
                <div className="detail-item">
                  <span>To:</span>
                  <span>{currentBooking.details.route.toLocation}</span>
                </div>
                <div className="detail-item">
                  <span>Departure:</span>
                  <span>{currentBooking.details.route.departureTime}</span>
                </div>
                <div className="detail-item">
                  <span>Arrival:</span>
                  <span>{currentBooking.details.route.arrivalTime}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Bus Information</h4>
                <div className="detail-item">
                  <span>Bus Name:</span>
                  <span>{currentBooking.details.bus.busName}</span>
                </div>
                <div className="detail-item">
                  <span>Registration:</span>
                  <span>{currentBooking.details.bus.registrationNumber}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Passenger Details</h4>
                <div className="detail-item">
                  <span>Name:</span>
                  <span>{currentBooking.details.passenger.name}</span>
                </div>
                <div className="detail-item">
                  <span>Email:</span>
                  <span>{currentBooking.details.passenger.email}</span>
                </div>
                <div className="detail-item">
                  <span>Phone:</span>
                  <span>{currentBooking.details.passenger.phone}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Booking Summary</h4>
                <div className="detail-item">
                  <span>Selected Seats:</span>
                  <span>{currentBooking.details.selectedSeats.join(', ')}</span>
                </div>
                <div className="detail-item">
                  <span>Price per Seat:</span>
                  <span>Rs. {currentBooking.details.pricePerSeat.toLocaleString()}</span>
                </div>
                <div className="detail-item total">
                  <span>Total Amount:</span>
                  <span>Rs. {currentBooking.details.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="demo-actions">
              <button 
                className="demo-payment-btn"
                onClick={() => setShowPayment(true)}
              >
                <Lock size={16} />
                Try Payment System
                <ArrowRight size={16} />
              </button>
              <div className="demo-tips">
                <h4>💡 Testing Tips:</h4>
                <ul>
                  <li>Click "Demo Cards" in card payment to use test card numbers</li>
                  <li>Use <strong>4242 4242 4242 4242</strong> for successful Visa payment</li>
                  <li>Use <strong>4000 0000 0000 0002</strong> to test payment failure</li>
                  <li>All other payment methods are simulated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentGateway
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        bookingDetails={currentBooking.details}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />

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

export default PaymentDemo;

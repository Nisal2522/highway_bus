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
  ArrowLeft,
  X
} from 'lucide-react';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import MobileWalletPayment from './MobileWalletPayment';
import './PaymentGateway.css';

const PaymentGateway = ({ 
  isOpen, 
  onClose, 
  bookingDetails, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select'); // select, process, success, error
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={24} />,
      description: 'Visa, Mastercard, American Express',
      color: '#3B82F6',
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet size={24} />,
      description: 'Pay with your PayPal account',
      color: '#0070BA',
      popular: true
    },
    {
      id: 'mobile',
      name: 'Mobile Wallet',
      icon: <Smartphone size={24} />,
      description: 'Apple Pay, Google Pay, Samsung Pay',
      color: '#10B981',
      popular: false
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 size={24} />,
      description: 'Direct bank transfer',
      color: '#8B5CF6',
      popular: false
    },
    {
      id: 'cod',
      name: 'Cash on Board',
      icon: <Wallet size={24} />,
      description: 'Pay when you board the bus',
      color: '#F59E0B',
      popular: false
    }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handlePaymentFormSubmit = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentFormSuccess = (paymentData) => {
    onPaymentSuccess(paymentData);
  };

  const handlePaymentFormError = (error) => {
    onPaymentError(error);
  };

  const handleBackToSelection = () => {
    setShowPaymentForm(false);
    setSelectedMethod('');
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    // For card, paypal, and mobile wallet, show specific payment forms
    if (['card', 'paypal', 'mobile'].includes(selectedMethod)) {
      setShowPaymentForm(true);
      return;
    }
    
    // For other methods (bank transfer, COD), process directly
    setIsProcessing(true);
    setPaymentStep('process');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (in real app, this would call your payment API)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess({
            method: selectedMethod,
            transactionId: `TXN${Date.now()}`,
            amount: bookingDetails.totalPrice,
            timestamp: new Date().toISOString()
          });
        }, 1500);
      } else {
        setPaymentStep('error');
        setTimeout(() => {
          onPaymentError('Payment failed. Please try again.');
        }, 1500);
      }
    } catch (error) {
      setPaymentStep('error');
      onPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentSelection = () => (
    <div className="payment-selection">
      <div className="payment-header">
        <h2>Choose Payment Method</h2>
        <p>Select your preferred payment option</p>
      </div>

      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method ${selectedMethod === method.id ? 'selected' : ''} ${method.popular ? 'popular' : ''}`}
            onClick={() => handlePaymentMethodSelect(method.id)}
          >
            <div className="method-icon" style={{ color: method.color }}>
              {method.icon}
            </div>
            <div className="method-details">
              <div className="method-name">
                {method.name}
                {method.popular && <span className="popular-badge">Popular</span>}
              </div>
              <div className="method-description">{method.description}</div>
            </div>
            <div className="method-selector">
              {selectedMethod === method.id && <CheckCircle size={20} />}
            </div>
          </div>
        ))}
      </div>

      <div className="payment-summary">
        <div className="summary-row">
          <span>Selected Seats:</span>
          <span>{bookingDetails.selectedSeats?.join(', ')}</span>
        </div>
        <div className="summary-row">
          <span>Price per Seat:</span>
          <span>Rs. {bookingDetails.pricePerSeat}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span>Rs. {bookingDetails.totalPrice}</span>
        </div>
      </div>

      <div className="payment-actions">
        <button 
          className="pay-button"
          onClick={handlePayment}
          disabled={!selectedMethod}
        >
          <Lock size={16} />
          Pay Securely - Rs. {bookingDetails.totalPrice}
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="security-badges">
        <div className="security-item">
          <Shield size={16} />
          <span>SSL Encrypted</span>
        </div>
        <div className="security-item">
          <Lock size={16} />
          <span>Secure Payment</span>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="payment-processing">
      <div className="processing-animation">
        <div className="spinner"></div>
      </div>
      <h3>Processing Payment...</h3>
      <p>Please don't close this window</p>
      <div className="processing-steps">
        <div className="step completed">
          <CheckCircle size={16} />
          <span>Validating payment method</span>
        </div>
        <div className="step active">
          <Clock size={16} />
          <span>Processing transaction</span>
        </div>
        <div className="step">
          <Clock size={16} />
          <span>Confirming booking</span>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="payment-success">
      <div className="success-animation">
        <CheckCircle size={48} />
      </div>
      <h3>Payment Successful!</h3>
      <p>Your booking has been confirmed</p>
      <div className="success-details">
        <div className="detail-item">
          <span>Transaction ID:</span>
          <span>TXN{Date.now()}</span>
        </div>
        <div className="detail-item">
          <span>Amount Paid:</span>
          <span>Rs. {bookingDetails.totalPrice}</span>
        </div>
        <div className="detail-item">
          <span>Payment Method:</span>
          <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="payment-error">
      <div className="error-animation">
        <X size={48} />
      </div>
      <h3>Payment Failed</h3>
      <p>There was an issue processing your payment</p>
      <div className="error-actions">
        <button className="retry-button" onClick={() => setPaymentStep('select')}>
          Try Again
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header-bar">
          <div className="header-left">
            {showPaymentForm && (
              <button className="back-button" onClick={handleBackToSelection}>
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>Secure Payment</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="payment-content">
          {!showPaymentForm && paymentStep === 'select' && renderPaymentSelection()}
          {showPaymentForm && selectedMethod === 'card' && (
            <div className="payment-form-popup">
              <StripePayment
                amount={bookingDetails.totalPrice}
                onPaymentSuccess={handlePaymentFormSuccess}
                onPaymentError={handlePaymentFormError}
              />
            </div>
          )}
          {showPaymentForm && selectedMethod === 'paypal' && (
            <div className="payment-form-popup">
              <PayPalPayment
                amount={bookingDetails.totalPrice}
                onPaymentSuccess={handlePaymentFormSuccess}
                onPaymentError={handlePaymentFormError}
              />
            </div>
          )}
          {showPaymentForm && selectedMethod === 'mobile' && (
            <div className="payment-form-popup">
              <MobileWalletPayment
                amount={bookingDetails.totalPrice}
                onPaymentSuccess={handlePaymentFormSuccess}
                onPaymentError={handlePaymentFormError}
              />
            </div>
          )}
          {paymentStep === 'process' && renderProcessing()}
          {paymentStep === 'success' && renderSuccess()}
          {paymentStep === 'error' && renderError()}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;

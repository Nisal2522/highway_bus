import React, { useState } from 'react';
import { 
  Wallet, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import './PayPalPayment.css';

const PayPalPayment = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('ready'); // ready, processing, success, error

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Simulate PayPal API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success (85% success rate for demo)
      const success = Math.random() > 0.15;
      
      if (success) {
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess({
            method: 'paypal',
            transactionId: `paypal_${Date.now()}`,
            amount: amount,
            payerEmail: 'user@example.com',
            payerId: `PAYER_${Math.random().toString(36).substr(2, 9)}`
          });
        }, 1500);
      } else {
        setPaymentStep('error');
        setTimeout(() => {
          onPaymentError('PayPal payment was declined. Please try again or use a different payment method.');
        }, 1500);
      }
    } catch (error) {
      setPaymentStep('error');
      onPaymentError('PayPal payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderReady = () => (
    <div className="paypal-payment">
      <div className="payment-header">
        <div className="header-icon">
          <Wallet size={24} />
        </div>
        <div className="header-text">
          <h3>PayPal Payment</h3>
          <p>Pay securely with your PayPal account</p>
        </div>
      </div>

      <div className="paypal-info">
        <div className="paypal-logo">
          <div className="paypal-text">PayPal</div>
        </div>
        <div className="payment-amount">
          <span className="amount-label">Amount to pay:</span>
          <span className="amount-value">Rs. {amount}</span>
        </div>
      </div>

      <div className="paypal-benefits">
        <h4>Why choose PayPal?</h4>
        <div className="benefits-list">
          <div className="benefit-item">
            <CheckCircle size={16} />
            <span>No need to enter card details</span>
          </div>
          <div className="benefit-item">
            <CheckCircle size={16} />
            <span>Buyer protection included</span>
          </div>
          <div className="benefit-item">
            <CheckCircle size={16} />
            <span>Instant payment confirmation</span>
          </div>
          <div className="benefit-item">
            <CheckCircle size={16} />
            <span>Secure and encrypted</span>
          </div>
        </div>
      </div>

      <div className="payment-actions">
        <button
          className="paypal-button"
          onClick={handlePayPalPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <Wallet size={16} />
              Pay with PayPal - Rs. {amount}
            </>
          )}
        </button>
      </div>

      <div className="security-info">
        <div className="security-item">
          <Lock size={14} />
          <span>Your payment is secured by PayPal</span>
        </div>
        <div className="security-item">
          <ExternalLink size={14} />
          <span>You'll be redirected to PayPal for authentication</span>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="payment-processing">
      <div className="processing-animation">
        <div className="paypal-spinner"></div>
      </div>
      <h3>Processing PayPal Payment...</h3>
      <p>Please wait while we process your payment</p>
      <div className="processing-steps">
        <div className="step completed">
          <CheckCircle size={16} />
          <span>Redirecting to PayPal</span>
        </div>
        <div className="step active">
          <div className="spinner-small"></div>
          <span>Authenticating with PayPal</span>
        </div>
        <div className="step">
          <AlertCircle size={16} />
          <span>Processing payment</span>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="payment-success">
      <div className="success-animation">
        <CheckCircle size={48} />
      </div>
      <h3>PayPal Payment Successful!</h3>
      <p>Your payment has been processed successfully</p>
      <div className="success-details">
        <div className="detail-item">
          <span>Transaction ID:</span>
          <span>paypal_{Date.now()}</span>
        </div>
        <div className="detail-item">
          <span>Amount Paid:</span>
          <span>Rs. {amount}</span>
        </div>
        <div className="detail-item">
          <span>Payment Method:</span>
          <span>PayPal</span>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="payment-error">
      <div className="error-animation">
        <AlertCircle size={48} />
      </div>
      <h3>Payment Failed</h3>
      <p>There was an issue processing your PayPal payment</p>
      <div className="error-actions">
        <button className="retry-button" onClick={() => setPaymentStep('ready')}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="paypal-container">
      {paymentStep === 'ready' && renderReady()}
      {paymentStep === 'processing' && renderProcessing()}
      {paymentStep === 'success' && renderSuccess()}
      {paymentStep === 'error' && renderError()}
    </div>
  );
};

export default PayPalPayment;

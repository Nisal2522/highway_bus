import React, { useState } from 'react';
import { 
  Smartphone, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Fingerprint,
  Shield
} from 'lucide-react';
import './MobileWalletPayment.css';

const MobileWalletPayment = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('ready'); // ready, processing, success, error
  const [selectedWallet, setSelectedWallet] = useState('');

  const walletOptions = [
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: '🍎',
      color: '#000000',
      description: 'Pay with Touch ID or Face ID',
      available: true
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: 'G',
      color: '#4285F4',
      description: 'Pay with your Google account',
      available: true
    },
    {
      id: 'samsung',
      name: 'Samsung Pay',
      icon: 'S',
      color: '#1428A0',
      description: 'Pay with Samsung Pay',
      available: false
    }
  ];

  const handleWalletPayment = async (walletId) => {
    setSelectedWallet(walletId);
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Simulate mobile wallet API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate success (90% success rate for demo)
      const success = Math.random() > 0.1;
      
      if (success) {
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess({
            method: 'mobile_wallet',
            walletType: walletId,
            transactionId: `${walletId}_${Date.now()}`,
            amount: amount,
            deviceId: `DEVICE_${Math.random().toString(36).substr(2, 9)}`
          });
        }, 1500);
      } else {
        setPaymentStep('error');
        setTimeout(() => {
          onPaymentError(`${walletOptions.find(w => w.id === walletId)?.name} payment was declined. Please try again.`);
        }, 1500);
      }
    } catch (error) {
      setPaymentStep('error');
      onPaymentError('Mobile wallet payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderReady = () => (
    <div className="mobile-wallet-payment">
      <div className="payment-header">
        <div className="header-icon">
          <Smartphone size={24} />
        </div>
        <div className="header-text">
          <h3>Mobile Wallet</h3>
          <p>Pay securely with your mobile device</p>
        </div>
      </div>

      <div className="wallet-options">
        {walletOptions.map((wallet) => (
          <div
            key={wallet.id}
            className={`wallet-option ${!wallet.available ? 'unavailable' : ''}`}
            onClick={() => wallet.available && handleWalletPayment(wallet.id)}
          >
            <div className="wallet-icon" style={{ backgroundColor: wallet.color }}>
              {wallet.icon}
            </div>
            <div className="wallet-details">
              <div className="wallet-name">{wallet.name}</div>
              <div className="wallet-description">{wallet.description}</div>
            </div>
            <div className="wallet-status">
              {wallet.available ? (
                <CheckCircle size={20} color="#10b981" />
              ) : (
                <AlertCircle size={20} color="#ef4444" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="payment-amount">
        <span className="amount-label">Amount to pay:</span>
        <span className="amount-value">Rs. {amount}</span>
      </div>

      <div className="wallet-benefits">
        <h4>Mobile Wallet Benefits</h4>
        <div className="benefits-list">
          <div className="benefit-item">
            <Fingerprint size={16} />
            <span>Biometric authentication</span>
          </div>
          <div className="benefit-item">
            <Shield size={16} />
            <span>Enhanced security</span>
          </div>
          <div className="benefit-item">
            <CheckCircle size={16} />
            <span>One-tap payment</span>
          </div>
          <div className="benefit-item">
            <Lock size={16} />
            <span>Tokenized transactions</span>
          </div>
        </div>
      </div>

      <div className="security-info">
        <div className="security-item">
          <Lock size={14} />
          <span>Your payment is secured by device biometrics</span>
        </div>
        <div className="security-item">
          <Shield size={14} />
          <span>No card details stored on device</span>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="payment-processing">
      <div className="processing-animation">
        <div className="wallet-spinner"></div>
      </div>
      <h3>Processing {walletOptions.find(w => w.id === selectedWallet)?.name} Payment...</h3>
      <p>Please authenticate on your device</p>
      <div className="processing-steps">
        <div className="step completed">
          <CheckCircle size={16} />
          <span>Wallet selected</span>
        </div>
        <div className="step active">
          <Fingerprint size={16} />
          <span>Biometric authentication</span>
        </div>
        <div className="step">
          <Lock size={16} />
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
      <h3>Mobile Payment Successful!</h3>
      <p>Your payment has been processed securely</p>
      <div className="success-details">
        <div className="detail-item">
          <span>Transaction ID:</span>
          <span>{selectedWallet}_{Date.now()}</span>
        </div>
        <div className="detail-item">
          <span>Amount Paid:</span>
          <span>Rs. {amount}</span>
        </div>
        <div className="detail-item">
          <span>Payment Method:</span>
          <span>{walletOptions.find(w => w.id === selectedWallet)?.name}</span>
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
      <p>There was an issue processing your mobile payment</p>
      <div className="error-actions">
        <button className="retry-button" onClick={() => setPaymentStep('ready')}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="mobile-wallet-container">
      {paymentStep === 'ready' && renderReady()}
      {paymentStep === 'processing' && renderProcessing()}
      {paymentStep === 'success' && renderSuccess()}
      {paymentStep === 'error' && renderError()}
    </div>
  );
};

export default MobileWalletPayment;

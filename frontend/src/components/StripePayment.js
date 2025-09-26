import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import './StripePayment.css';

const StripePayment = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    zip: ''
  });
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDemoCards, setShowDemoCards] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const validateCard = () => {
    const newErrors = {};
    
    // Card number validation (basic Luhn algorithm)
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 13) {
      newErrors.number = 'Please enter a valid card number';
    }
    
    // Expiry validation
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = 'Please enter expiry in MM/YY format';
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiry = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }
    
    // CVV validation
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    // Name validation
    if (!cardDetails.name.trim()) {
      newErrors.name = 'Please enter cardholder name';
    }
    
    // ZIP validation
    if (!cardDetails.zip.trim()) {
      newErrors.zip = 'Please enter ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^6/.test(num)) return 'discover';
    return 'unknown';
  };

  const demoCards = [
    {
      name: 'Visa Test Card',
      number: '4242 4242 4242 4242',
      expiry: '12/25',
      cvv: '123',
      zip: '12345',
      type: 'visa'
    },
    {
      name: 'Mastercard Test Card',
      number: '5555 5555 5555 4444',
      expiry: '12/25',
      cvv: '123',
      zip: '12345',
      type: 'mastercard'
    },
    {
      name: 'American Express Test Card',
      number: '3782 822463 10005',
      expiry: '12/25',
      cvv: '1234',
      zip: '12345',
      type: 'amex'
    },
    {
      name: 'Declined Test Card',
      number: '4000 0000 0000 0002',
      expiry: '12/25',
      cvv: '123',
      zip: '12345',
      type: 'visa'
    }
  ];

  const fillDemoCard = (demoCard) => {
    setCardDetails({
      number: demoCard.number,
      expiry: demoCard.expiry,
      cvv: demoCard.cvv,
      name: demoCard.name,
      zip: demoCard.zip
    });
    setShowDemoCards(false);
    // Clear any existing errors
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      // Add typing animation for card number
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 300);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (field === 'zip') {
      formattedValue = value.replace(/\D/g, '').substring(0, 10);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateCard()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate Stripe API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if it's a declined test card
      const isDeclinedCard = cardDetails.number.includes('4000 0000 0000 0002');
      const success = !isDeclinedCard && Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        onPaymentSuccess({
          method: 'card',
          transactionId: `stripe_${Date.now()}`,
          amount: amount,
          cardType: getCardType(cardDetails.number),
          last4: cardDetails.number.slice(-4)
        });
      } else {
        onPaymentError('Payment declined. Please try a different card.');
      }
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardType = getCardType(cardDetails.number);

  // Function to display card number with proper formatting
  const displayCardNumber = () => {
    if (!cardDetails.number) return '•••• •••• •••• ••••';
    
    const formatted = formatCardNumber(cardDetails.number);
    // Show the actual typed number as it's being entered
    return formatted;
  };

  return (
    <div className="stripe-payment">
      <div className="payment-header">
        <div className="header-icon">
          <CreditCard size={24} />
        </div>
        <div className="header-text">
          <h3>Card Payment</h3>
          <p>Enter your card details securely</p>
        </div>
        <button 
          className="demo-cards-btn"
          onClick={() => setShowDemoCards(!showDemoCards)}
        >
          Demo Cards
        </button>
      </div>

      {showDemoCards && (
        <div className="demo-cards-section">
          <h4>Test Card Numbers</h4>
          <div className="demo-cards-grid">
            {demoCards.map((card, index) => (
              <div 
                key={index}
                className="demo-card"
                onClick={() => fillDemoCard(card)}
              >
                <div className="demo-card-type">{card.type.toUpperCase()}</div>
                <div className="demo-card-number">{card.number}</div>
                <div className="demo-card-name">{card.name}</div>
              </div>
            ))}
          </div>
          <p className="demo-note">
            💡 Click on any card to auto-fill the form. Use the declined card to test error handling.
          </p>
        </div>
      )}

      <div className="card-preview">
        <div className={`card ${cardType}`}>
          <div className="card-chip"></div>
          <div className={`card-number ${isTyping ? 'typing' : ''}`}>
            {displayCardNumber()}
          </div>
          <div className="card-details">
            <div className="card-name">
              {cardDetails.name || 'CARDHOLDER NAME'}
            </div>
            <div className="card-expiry">
              {cardDetails.expiry || 'MM/YY'}
            </div>
          </div>
          <div className="card-logo">
            {cardType === 'visa' && <div className="visa-logo">VISA</div>}
            {cardType === 'mastercard' && <div className="mastercard-logo">MC</div>}
            {cardType === 'amex' && <div className="amex-logo">AMEX</div>}
          </div>
          <div className="card-hologram"></div>
          <div className="card-signature-line"></div>
        </div>
      </div>

      <div className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              maxLength="19"
              className={errors.number ? 'error' : ''}
            />
            <div className="card-icons">
              <div className="card-icon visa"></div>
              <div className="card-icon mastercard"></div>
              <div className="card-icon amex"></div>
            </div>
          </div>
          {errors.number && <span className="error-message">{errors.number}</span>}
        </div>

        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardDetails.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => handleInputChange('expiry', e.target.value)}
              maxLength="5"
              className={errors.expiry ? 'error' : ''}
            />
            {errors.expiry && <span className="error-message">{errors.expiry}</span>}
          </div>

          <div className="form-group">
            <label>CVV</label>
            <div className="input-wrapper">
              <input
                type={showCvv ? 'text' : 'password'}
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                maxLength="4"
                className={errors.cvv ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowCvv(!showCvv)}
              >
                {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            placeholder="12345"
            value={cardDetails.zip}
            onChange={(e) => handleInputChange('zip', e.target.value)}
            className={errors.zip ? 'error' : ''}
          />
          {errors.zip && <span className="error-message">{errors.zip}</span>}
        </div>
      </div>

      <div className="payment-actions">
        <button
          className="pay-button"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <Lock size={16} />
              Pay Rs. {amount}
            </>
          )}
        </button>
      </div>

      <div className="security-info">
        <div className="security-item">
          <Lock size={14} />
          <span>Your payment information is secure and encrypted</span>
        </div>
        <div className="security-item">
          <CheckCircle size={14} />
          <span>Protected by Stripe's security standards</span>
        </div>
      </div>
    </div>
  );
};

export default StripePayment;

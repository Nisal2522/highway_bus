import React, { useState, useEffect } from 'react';
import './BookingPage.css';

const BookingPage = ({ selectedPackage, packageData, onBack, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    email: '',
    phone: '',
    breakfast: '',
    hotel: '',
    transport: '',
    startDate: '',
    endDate: ''
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Calculate number of days from date range
  const calculateNumberOfDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  // Package options based on selected package - use admin-managed data if available
  const packageOptions = packageData ? {
    [selectedPackage]: {
      basePrice: Number(packageData.price) || 0,
      packageTitle: `${packageData.name} Package`,
      packageDescription: packageData.description || 'A great package for your journey.',
      breakfast: [
        { name: 'Continental light breakfast (toast, butter, jam, tea/coffee)', price: 0 },
        { name: 'Vegetarian Sri Lankan breakfast (string hoppers, dhal curry, coconut sambol)', price: 200 },
        { name: 'Simple rice & curry set', price: 300 }
      ],
      hotels: [
        { name: 'Lake View Inn', price: 0 },
        { name: 'City Comfort Lodge', price: 1500 },
        { name: 'Green Palm Guesthouse', price: 2000 }
      ],
      transport: [
        { name: 'Sunshine Express', price: 0 },
        { name: 'GreenLine Coaches', price: 1000 },
        { name: 'CityRide Travels', price: 1500 }
      ]
    }
  } : {
    basic: {
      basePrice: 10000,
      packageTitle: 'Basic Package (Budget-Friendly)',
      packageDescription: 'Perfect for budget-conscious travelers who want to explore Sri Lanka without breaking the bank.',
      breakfast: [
        { name: 'Continental light breakfast (toast, butter, jam, tea/coffee)', price: 0 },
        { name: 'Vegetarian Sri Lankan breakfast (string hoppers, dhal curry, coconut sambol)', price: 200 },
        { name: 'Simple rice & curry set', price: 300 }
      ],
      hotels: [
        { name: 'Lake View Inn', price: 0 },
        { name: 'City Comfort Lodge', price: 1500 },
        { name: 'Green Palm Guesthouse', price: 2000 }
      ],
      transport: [
        { name: 'Sunshine Express', price: 0 },
        { name: 'GreenLine Coaches', price: 1000 },
        { name: 'CityRide Travels', price: 1500 }
      ]
    },
    standard: {
      basePrice: 30000,
      packageTitle: 'Standard Package (Mid-Range Comfort)',
      packageDescription: 'Ideal for travelers seeking comfort and quality without the luxury price tag.',
      breakfast: [
        { name: 'Sri Lankan buffet breakfast (hoppers, milk rice, sambols, curries)', price: 0 },
        { name: 'Western buffet (pancakes, eggs, sausages, cereals, juices)', price: 500 },
        { name: 'Healthy choice (fruits, smoothie bowl, herbal tea)', price: 300 }
      ],
      hotels: [
        { name: 'Ocean Breeze Resort', price: 0 },
        { name: 'Golden Sands Hotel', price: 3000 },
        { name: 'Mountain View Retreat', price: 5000 }
      ],
      transport: [
        { name: 'SilverLine Luxury Coaches', price: 0 },
        { name: 'BlueWave Travels', price: 2000 },
        { name: 'Golden Star Transport', price: 3000 }
      ]
    },
    premium: {
      basePrice: 50000,
      packageTitle: 'Premium Package (Luxury/VIP)',
      packageDescription: 'The ultimate luxury experience with premium accommodations, gourmet dining, and VIP treatment.',
      breakfast: [
        { name: 'International gourmet breakfast (eggs benedict, smoked salmon, fresh juice)', price: 0 },
        { name: 'Vegan/organic (chia pudding, quinoa, avocado toast)', price: 800 },
        { name: 'Premium Sri Lankan fusion (string hopper biryani, seafood curry, fruit platter)', price: 1000 }
      ],
      hotels: [
        { name: 'Grand Royal Palace Hotel', price: 0 },
        { name: 'Sapphire Bay Resort & Spa', price: 8000 },
        { name: 'The Imperial Heights', price: 15000 }
      ],
      transport: [
        { name: 'Royal Voyager Coaches', price: 0 },
        { name: 'Platinum Wheels', price: 3000 },
        { name: 'DiamondLine Tours', price: 5000 }
      ]
    }
  };

  // Calculate total price based on selections
  useEffect(() => {
    if (!selectedPackage) return;

    const options = packageOptions[selectedPackage];
    let total = Number(options.basePrice) || 0;

    // Add breakfast cost
    const selectedBreakfast = options.breakfast.find(b => b.name === formData.breakfast);
    if (selectedBreakfast) total += Number(selectedBreakfast.price) || 0;

    // Add hotel cost
    const selectedHotel = options.hotels.find(h => h.name === formData.hotel);
    if (selectedHotel) total += Number(selectedHotel.price) || 0;

    // Add transport cost
    const selectedTransport = options.transport.find(t => t.name === formData.transport);
    if (selectedTransport) total += Number(selectedTransport.price) || 0;

    // Multiply by number of days calculated from date range
    const numberOfDays = calculateNumberOfDays();
    total = total * numberOfDays;

    setCalculatedPrice(total);
  }, [selectedPackage, formData.breakfast, formData.hotel, formData.transport, formData.startDate, formData.endDate]);

  // Trigger slide-up animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      const scrollThreshold = 50; // Start hiding after 50px scroll
      
      if (scrollTop > scrollThreshold) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
    };

    // Add scroll listener to the booking page content
    const bookingContent = document.querySelector('.booking-page-content');
    if (bookingContent) {
      bookingContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (bookingContent) {
        bookingContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setFormData({
        fullName: '',
        address: '',
        email: '',
        phone: '',
        breakfast: '',
        hotel: '',
        transport: '',
        startDate: '',
        endDate: ''
      });
      setShowConfirmation(false);
      onClose();
    }, 300);
  };

  const options = packageOptions[selectedPackage] || packageOptions.basic;

  return (
    <div className={`booking-page-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="booking-page-container">
        {/* Package Info Header */}
        <div className={`booking-page-header ${headerVisible ? 'visible' : 'hidden'}`}>
          <div className="booking-page-header-content">
            <button className="booking-back-button" onClick={handleClose}>
              ← Back
            </button>
            <div className="booking-package-info">
              <h1>{options?.packageTitle}</h1>
              <p>{options?.packageDescription}</p>
              <div className="booking-package-price">
                From Rs. {options?.basePrice?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-page-content">
          {!showConfirmation ? (
            <form className="booking-page-form" onSubmit={handleSubmit}>
              <div className="booking-form-section">
                <h3>Personal Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="booking-form-section">
                <h3>Trip Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="date-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date *</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className="date-input"
                    />
                  </div>
                </div>
                {formData.startDate && formData.endDate && (
                  <div className="trip-duration-info">
                    <span className="duration-text">
                      Duration: {calculateNumberOfDays()} {calculateNumberOfDays() === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                )}
              </div>

              <div className="booking-form-section">
                <h3>Package Options</h3>
                
                <div className="form-group">
                  <label>Meal Options</label>
                  <div className="option-grid">
                    {options.breakfast.map((option, index) => (
                      <label key={index} className="option-card">
                        <input
                          type="radio"
                          name="breakfast"
                          value={option.name}
                          checked={formData.breakfast === option.name}
                          onChange={handleInputChange}
                        />
                        <div className="option-content">
                          <span className="option-name">{option.name}</span>
                          <span className="option-price">
                            {option.price > 0 ? `+Rs. ${option.price.toLocaleString()}` : 'Included'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Hotel Options</label>
                  <div className="option-grid">
                    {options.hotels.map((option, index) => (
                      <label key={index} className="option-card">
                        <input
                          type="radio"
                          name="hotel"
                          value={option.name}
                          checked={formData.hotel === option.name}
                          onChange={handleInputChange}
                        />
                        <div className="option-content">
                          <span className="option-name">{option.name}</span>
                          <span className="option-price">
                            {option.price > 0 ? `+Rs. ${option.price.toLocaleString()}` : 'Included'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>{selectedPackage === 'premium' ? 'Buses (Private Transport)' : 'Buses'}</label>
                  <div className="option-grid">
                    {options.transport.map((option, index) => (
                      <label key={index} className="option-card">
                        <input
                          type="radio"
                          name="transport"
                          value={option.name}
                          checked={formData.transport === option.name}
                          onChange={handleInputChange}
                        />
                        <div className="option-content">
                          <span className="option-name">{option.name}</span>
                          <span className="option-price">
                            {option.price > 0 ? `+Rs. ${option.price.toLocaleString()}` : 'Included'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="booking-form-section">
                <div className="price-summary">
                  <div className="price-breakdown">
                  <div className="price-item">
                    <span>Base Price ({selectedPackage?.charAt(0).toUpperCase() + selectedPackage?.slice(1)}) - {calculateNumberOfDays()} {calculateNumberOfDays() === 1 ? 'Day' : 'Days'}</span>
                    <span>Rs. {(options.basePrice * calculateNumberOfDays()).toLocaleString()}</span>
                  </div>
                    {formData.breakfast && (
                      <div className="price-item">
                        <span>Meal ({formData.breakfast}) - {calculateNumberOfDays()} {calculateNumberOfDays() === 1 ? 'Day' : 'Days'}</span>
                        <span>Rs. {((options.breakfast.find(b => b.name === formData.breakfast)?.price || 0) * calculateNumberOfDays()).toLocaleString()}</span>
                      </div>
                    )}
                    {formData.hotel && (
                      <div className="price-item">
                        <span>Hotel ({formData.hotel}) - {calculateNumberOfDays()} {calculateNumberOfDays() === 1 ? 'Day' : 'Days'}</span>
                        <span>Rs. {((options.hotels.find(h => h.name === formData.hotel)?.price || 0) * calculateNumberOfDays()).toLocaleString()}</span>
                      </div>
                    )}
                    {formData.transport && (
                      <div className="price-item">
                        <span>{selectedPackage === 'premium' ? 'Buses (Private Transport)' : 'Buses'} ({formData.transport}) - {calculateNumberOfDays()} {calculateNumberOfDays() === 1 ? 'Day' : 'Days'}</span>
                        <span>Rs. {((options.transport.find(t => t.name === formData.transport)?.price || 0) * calculateNumberOfDays()).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="total-price">
                    <span>Total Price</span>
                    <span>Rs. {calculatedPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="booking-form-actions">
                <button type="button" className="btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          ) : (
            <div className="booking-confirmation">
              <div className="confirmation-icon">✓</div>
              <h3>Booking Confirmed!</h3>
              <div className="confirmation-details">
                <div className="confirmation-section">
                  <h4>Personal Details</h4>
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Address:</strong> {formData.address}</p>
                </div>
                <div className="confirmation-section">
                  <h4>Package Details</h4>
                  <p><strong>Package:</strong> {selectedPackage?.charAt(0).toUpperCase() + selectedPackage?.slice(1)}</p>
                  <p><strong>Start Date:</strong> {formData.startDate}</p>
                  <p><strong>End Date:</strong> {formData.endDate}</p>
                  <p><strong>Duration:</strong> {calculateNumberOfDays()} {calculateNumberOfDays() === 1 ? 'Day' : 'Days'}</p>
                  <p><strong>Meal:</strong> {formData.breakfast}</p>
                  <p><strong>Hotel:</strong> {formData.hotel}</p>
                  <p><strong>{selectedPackage === 'premium' ? 'Buses (Private Transport)' : 'Buses'}:</strong> {formData.transport}</p>
                </div>
                <div className="confirmation-section">
                  <h4>Total Price</h4>
                  <p className="final-price">Rs. {calculatedPrice.toLocaleString()}</p>
                </div>
              </div>
              <button className="btn-primary" onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
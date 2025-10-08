import React, { useState, useEffect } from 'react';
import './RouteDetails.css';
import BookingPage from './BookingPage';
import busImage from '../assets/bustour.jpg';

const RouteDetails = ({ route, onBack }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [isBookingPageOpen, setIsBookingPageOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState(null);
  const [packages, setPackages] = useState({});

  // Function to get the specific background image for each destination
  const getRouteBackgroundImage = (city) => {
    switch (city) {
      case 'Galle':
        return require('../assets/galle2.jpg');
      case 'Sigiriya':
        return require('../assets/hero-sigiriya.jpg');
      case 'Ella':
        return require('../assets/ella.webp');
      case 'Kandy':
        return require('../assets/kandy.jpg');
      case 'Nuwara Eliya':
        return require('../assets/nuwaraeliya.jpg');
      case 'Mirissa':
        return require('../assets/mirissa.jpeg');
      case 'Bentota':
        return require('../assets/bentota.jpeg');
      case 'Anuradhapura':
        return require('../assets/anuradapura.jpeg');
      default:
        return route.imageUrl || require('../assets/Tourista.png');
    }
  };

  // Load packages from localStorage
  useEffect(() => {
    const loadPackages = () => {
      const adminPackages = localStorage.getItem('adminPackages');
      if (adminPackages && adminPackages !== 'null' && adminPackages !== 'undefined') {
        try {
          const parsedPackages = JSON.parse(adminPackages);
          // Filter out inactive packages and convert to the format expected by RouteDetails
          const activePackages = parsedPackages
            .filter(pkg => pkg.isActive === true)
            .reduce((acc, pkg) => {
              acc[pkg.name] = {
                price: pkg.basePrice,
                features: pkg.options ? pkg.options.map(opt => `${opt.optionType}: ${opt.name}`) : []
              };
              return acc;
            }, {});
          setPackages(activePackages);
        } catch (error) {
          console.error('Error parsing admin packages:', error);
          // Fallback to hardcoded packages
          setPackages({
            basic: { price: 10000, features: ["Standard transport", "Basic accommodation", "Breakfast included"] },
            standard: { price: 30000, features: ["Luxury transport", "4-star accommodation", "All meals included", "Professional guide"] },
            premium: { price: 50000, features: ["Private transport", "5-star accommodation", "All meals + drinks", "Personal guide", "VIP experiences"] }
          });
        }
      } else {
        // Fallback to hardcoded packages
        setPackages({
          basic: { price: 10000, features: ["Standard transport", "Basic accommodation", "Breakfast included"] },
          standard: { price: 30000, features: ["Luxury transport", "4-star accommodation", "All meals included", "Professional guide"] },
          premium: { price: 50000, features: ["Private transport", "5-star accommodation", "All meals + drinks", "Personal guide", "VIP experiences"] }
        });
      }
    };

    // Load packages on mount
    loadPackages();

    // Listen for package updates
    const handlePackageUpdate = () => {
      loadPackages();
    };

    window.addEventListener('packageUpdated', handlePackageUpdate);
    window.addEventListener('storage', handlePackageUpdate);

    return () => {
      window.removeEventListener('packageUpdated', handlePackageUpdate);
      window.removeEventListener('storage', handlePackageUpdate);
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleBookNow = (packageKey) => {
    setSelectedPackageForBooking(packageKey);
    setIsBookingPageOpen(true);
  };

  const handleCloseBookingPage = () => {
    setIsBookingPageOpen(false);
    setSelectedPackageForBooking(null);
  };

  if (!route) {
    return (
      <div className="route-details-page">
        <p>No route selected.</p>
        <button onClick={onBack} className="route-back-button">Back to Tours</button>
      </div>
    );
  }

  const itinerary = [
    {
      day: 1,
      title: "Arrival & City Exploration",
      activities: [
        { icon: "airplane", text: "Arrive at destination airport" },
        { icon: "hotel", text: "Check into luxury accommodation" },
        { icon: "monument", text: "Visit historic city center" },
        { icon: "restaurant", text: "Welcome dinner at local restaurant" }
      ]
    },
    {
      day: 2,
      title: "Cultural Heritage Tour",
      activities: [
        { icon: "temple", text: "Temple of the Sacred Tooth Relic" },
        { icon: "garden", text: "Royal Botanical Gardens" },
        { icon: "theater", text: "Traditional cultural show" },
        { icon: "shopping", text: "Local market shopping" }
      ]
    },
    {
      day: 3,
      title: "Nature & Departure",
      activities: [
        { icon: "sunrise", text: "Sunrise mountain view" },
        { icon: "train", text: "Scenic train journey" },
        { icon: "camera", text: "Photo opportunities" },
        { icon: "airplane", text: "Return journey" }
      ]
    }
  ];


  return (
    <div className="route-details-page">
      {/* Back Button */}
      <button onClick={onBack} className="route-back-button">
        <span className="route-back-icon">←</span>
        Back to Tours
      </button>

      {/* Hero Section */}
      <div className="route-hero-section" style={{ backgroundImage: `url(${getRouteBackgroundImage(route.arrivalCity)})` }}>
        <div className="route-hero-overlay">
          <div className="route-hero-content">
            <h1 className="route-hero-title">{route.arrivalCity}</h1>
            <p className="route-hero-tagline">{route.description}</p>
            <div className="route-hero-badges">
              <span className="route-rating-badge">
                <span className="star-icon"></span>
                {route.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Info Section */}
      <div className="route-key-info-section">
        <div className="route-info-card">
          <div className="route-info-icon bus-icon"></div>
          <h3>Transport Options</h3>
          <p>Luxury Bus</p>
          <p>Private Van</p>
          <p>Scenic Train</p>
        </div>
        <div className="route-info-card">
          <div className="route-info-icon hotel-icon"></div>
          <h3>Stay Details</h3>
          <p>4-Star Hotels</p>
          <p>Mountain Views</p>
          <p>City Center</p>
        </div>
        <div className="route-info-card">
          <div className="route-info-icon calendar-icon"></div>
          <h3>Tour Duration</h3>
          <p>2 Nights, 3 Days</p>
          <p>Full Itinerary</p>
          <p>Flexible Schedule</p>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="route-itinerary-section" style={{ backgroundImage: `url(${busImage})` }}>
        <div className="route-itinerary-overlay">
          <h2 className="route-section-title">Your Journey</h2>
          <div className="route-itinerary-timeline">
          {itinerary.map((day, index) => (
            <div key={day.day} className="route-day-card">
              <div className="route-day-header" onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}>
                <div className="route-day-number">Day {day.day}</div>
                <h3 className="route-day-title">{day.title}</h3>
                <span className="route-expand-icon">{expandedDay === day.day ? '−' : '+'}</span>
              </div>
              {expandedDay === day.day && (
                <div className="route-day-activities">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="route-activity-item">
                      <span className={`route-activity-icon ${activity.icon}-icon`}></span>
                      <span className="route-activity-text">{activity.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Booking Details Section */}
      <div className="route-booking-section">
        <div className="route-booking-card">
          <h3 className="route-booking-title">Choose Your Package</h3>
          <div className="route-package-options">
            {Object.entries(packages).map(([key, pkg]) => (
              <div 
                key={key} 
                className={`route-package-option ${selectedPackage === key ? 'selected' : ''}`}
                onClick={() => setSelectedPackage(key)}
              >
                <div className="route-package-header">
                  <h4 className="route-package-name">{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  <div className="route-package-price">From Rs. {pkg.price.toLocaleString()}</div>
                </div>
                <ul className="route-package-features">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="route-package-book-btn" onClick={() => handleBookNow(key)}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Page */}
      {isBookingPageOpen && (
        <BookingPage
          selectedPackage={selectedPackageForBooking}
          packageData={packages[selectedPackageForBooking]}
          onBack={onBack}
          onClose={handleCloseBookingPage}
        />
      )}
    </div>
  );
};

export default RouteDetails;
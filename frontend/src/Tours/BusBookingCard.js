import React from 'react';
import './BusBookingCard.css';

const BusBookingCard = ({
  departureCity,
  arrivalCity,
  explorationTime,
  price,
  availableSeats,
  rating,
  imageUrl,
  description,
  title,
  onBook,
  onViewDetails,
  isExpanded = false,
  onToggle,
  className = '',
}) => {
  // Use specific images for each destination
  const getBackgroundImage = (city) => {
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
        return imageUrl;
    }
  };

  const backgroundImage = getBackgroundImage(arrivalCity);

  const cardStyle = {
    backgroundImage: `url(${backgroundImage})`, /* removed dark overlay */
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-size 0.3s ease',
  };

  const handleCardClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <div 
      className={`bus-booking-card ${isExpanded ? 'expanded' : ''} ${className}`} 
      style={cardStyle}
      onClick={handleCardClick}
    >
      <div className="card-body">
        <h3 className="card-title">
          <span className="destination-name">{arrivalCity}</span>
          <span className="card-subtitle">{title}</span>
        </h3>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-footer">
        <div className="action-buttons">
          <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusBookingCard;

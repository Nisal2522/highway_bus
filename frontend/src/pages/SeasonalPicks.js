import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight as ChevronRightIcon,
  MapPin,
  Clock,
  Star,
  Users,
  Calendar,
  ArrowRight,
  Heart
} from "lucide-react";
import "./SeasonalPicks.css";
import jaffnaJpg from "../assets/jaffna.jpg";
import galle from "../assets/galle.png";
import ella from "../assets/ella.webp";

const DestinationCard = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  duration, 
  price, 
  rating, 
  passengers, 
  departure, 
  destination,
  season,
  isPopular,
  onExplore 
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="sp__card" style={{ backgroundImage: `url('${image}')` }}>
      <div className="sp__overlay" />
      
      {/* Season Badge */}
      <div className="sp__season-badge">
        <Calendar size={14} />
        <span>{season}</span>
      </div>

      {/* Popular Badge */}
      {isPopular && (
        <div className="sp__popular-badge">
          <Star size={14} />
          <span>Popular</span>
        </div>
      )}

      {/* Like Button */}
      <button 
        className={`sp__like-btn ${isLiked ? 'sp__like-btn--active' : ''}`}
        onClick={() => setIsLiked(!isLiked)}
      >
        <Heart size={18} />
      </button>
      
      <div className="sp__content">
        <div className="sp__header">
          <div className="sp__route">
            <div className="sp__route-point">
              <MapPin size={16} />
              <span>{departure}</span>
            </div>
            <div className="sp__route-line"></div>
            <div className="sp__route-point">
              <MapPin size={16} />
              <span>{destination}</span>
            </div>
          </div>
        </div>
        
        <div className="sp__details">
          <h3 className="sp__title">
            {title}
            <span className="sp__subtitle">{subtitle}</span>
          </h3>
          <p className="sp__desc">{description}</p>
          
          <div className="sp__meta">
            <div className="sp__meta-item">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            <div className="sp__meta-item">
              <Users size={14} />
              <span>{passengers} seats</span>
            </div>
            <div className="sp__meta-item">
              <Star size={14} />
              <span>{rating}</span>
            </div>
          </div>
          
          <div className="sp__footer">
            <div className="sp__price">
              <span className="sp__price-label">From</span>
              <span className="sp__price-amount">Rs. {price}</span>
            </div>
            <button className="sp__btn" onClick={() => onExplore && onExplore({
              route: `${departure} → ${destination}`,
              title: `${title} ${subtitle}`,
              description: description,
              duration: duration,
              price: price,
              rating: rating,
              seats: passengers,
              departure: departure,
              destination: destination,
              season: season
            })}>
              <span>Explore</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SeasonalPicks = ({ onExplore }) => {
  const destinations = [
    {
      title: "Moratuwa → Jaffna:",
      subtitle: "Northern Explorer",
      description: "Journey from the coastal calm of Moratuwa to the rich heritage of Jaffna. A seasonal ride perfect for long-distance comfort and cultural discovery.",
      image: jaffnaJpg,
      duration: "8h 15m",
      price: "4,500",
      rating: "4.8",
      passengers: "45",
      departure: "Moratuwa",
      destination: "Jaffna",
      season: "Winter",
      isPopular: true
    },
    {
      title: "Kandy → Galle:",
      subtitle: "Southern Escape",
      description: "From misty hills to sunny shores — a smooth trip that blends nature, heritage, and beach bliss.",
      image: galle,
      duration: "4h 30m",
      price: "2,200",
      rating: "4.9",
      passengers: "52",
      departure: "Kandy",
      destination: "Galle",
      season: "Summer",
      isPopular: false
    },
    {
      title: "Colombo → Ella:",
      subtitle: "Highland Scenic",
      description: "Breathtaking valleys, tea estates, and bridges — this route is a photographer's dream and a traveler's joy.",
      image: ella,
      duration: "6h 20m",
      price: "3,200",
      rating: "4.9",
      passengers: "40",
      departure: "Colombo",
      destination: "Ella",
      season: "Spring",
      isPopular: true
    }
  ];

  return (
    <section className="sp">
      <div className="sp__container">
        <div className="sp__header">
          <div className="sp__title-section">
            <div className="sp__badge">
              <Star size={16} />
              <span>Seasonal Special</span>
            </div>
            <h2 className="sp__heading">Seasonal Picks Just for You</h2>
            <p className="sp__lead">
              Experience Sri Lanka's top destinations this season with TOURISTA. Our
              featured routes are curated for comfort, convenience, and unforgettable
              memories — whether you're heading home for the holidays or chasing
              scenic adventures.
            </p>
          </div>
        </div>

        <div className="sp__grid">
          {destinations.map((destination, index) => (
            <DestinationCard key={index} {...destination} onExplore={onExplore} />
          ))}
        </div>

        <div className="sp__cta">
          <div className="sp__cta-content">
            <h3>Ready for Your Next Adventure?</h3>
            <p>Book your seasonal journey today and experience the best of Sri Lanka</p>
            <button className="sp__cta-btn">
              <span>View All Routes</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

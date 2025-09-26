import React, { useState, useRef, useEffect } from "react";
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  MapPin,
  Clock,
  Star,
  Users,
  ArrowRight
} from "lucide-react";
import "./ExclusiveJourneys.css";
import galleTwo from "../assets/galleTwo.png";
import jaffna from "../assets/jaffna.jpg";
import ella from "../assets/ella.webp";
import bus from "../assets/bus.jpg";

const JourneyCard = ({ 
  title, 
  description, 
  image, 
  duration, 
  price, 
  rating, 
  passengers, 
  departure, 
  destination,
  isActive 
}) => (
  <div className={`ej__card ${isActive ? 'ej__card--active' : ''}`} style={{ backgroundImage: `url('${image}')` }}>
    <div className="ej__overlay" />
    
    {/* Badge */}
    <div className="ej__badge">
      <Star size={14} />
      <span>Premium Route</span>
    </div>
    
    <div className="ej__content">
      <div className="ej__header">
        <div className="ej__route">
          <div className="ej__route-point">
            <MapPin size={16} />
            <span>{departure}</span>
          </div>
          <div className="ej__route-line"></div>
          <div className="ej__route-point">
            <MapPin size={16} />
            <span>{destination}</span>
          </div>
        </div>
      </div>
      
      <div className="ej__details">
        <h3 className="ej__title">{title}</h3>
        <p className="ej__desc">{description}</p>
        
        <div className="ej__meta">
          <div className="ej__meta-item">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className="ej__meta-item">
            <Users size={14} />
            <span>{passengers} seats</span>
          </div>
          <div className="ej__meta-item">
            <Star size={14} />
            <span>{rating}</span>
          </div>
        </div>
        
        <div className="ej__footer">
          <div className="ej__price">
            <span className="ej__price-label">From</span>
            <span className="ej__price-amount">Rs. {price}</span>
          </div>
          <button className="ej__btn">
            <span>View Seats</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const ExclusiveJourneys = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const journeys = [
    {
      title: "COLOMBO – ANURADHAPURA",
      description: "Travel to the sacred city of Anuradhapura, home to ancient temples and rich heritage. Experience the spiritual heart of Sri Lanka.",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
      duration: "4h 30m",
      price: "2,500",
      rating: "4.8",
      passengers: "45",
      departure: "Colombo",
      destination: "Anuradhapura"
    },
    {
      title: "COLOMBO – KANDY",
      description: "Scenic hills, tea estates, and cool weather — the ideal weekend escape. Discover the cultural capital of Sri Lanka.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
      duration: "3h 15m",
      price: "1,800",
      rating: "4.9",
      passengers: "52",
      departure: "Colombo",
      destination: "Kandy"
    },
    {
      title: "COLOMBO – GALLE",
      description: "Coastal forts, beaches, and vibrant streets — a relaxing seaside getaway. Explore the historic Dutch fort.",
      image: galleTwo,
      duration: "2h 45m",
      price: "1,200",
      rating: "4.7",
      passengers: "48",
      departure: "Colombo",
      destination: "Galle"
    },
    {
      title: "COLOMBO – ELLA",
      description: "Breathtaking valleys, tea estates, and bridges — this route is a photographer's dream and a traveler's joy.",
      image: ella,
      duration: "6h 20m",
      price: "3,200",
      rating: "4.9",
      passengers: "40",
      departure: "Colombo",
      destination: "Ella"
    },
    {
      title: "COLOMBO – JAFFNA",
      description: "Journey to the northern tip of Sri Lanka, rich in culture, history, and unique Tamil heritage.",
      image: jaffna,
      duration: "8h 15m",
      price: "4,500",
      rating: "4.6",
      passengers: "35",
      departure: "Colombo",
      destination: "Jaffna"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % journeys.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + journeys.length) % journeys.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  return (
    <section className="ej">
      <div className="ej__container">
        <div className="ej__header">
          <div className="ej__title-section">
            <h2 className="ej__heading">Exclusive Journeys</h2>
            <p className="ej__lead">
              Discover Sri Lanka's most popular routes with our premium bus services. 
              Comfort, safety, and unforgettable experiences await you.
            </p>
          </div>
          
          <div className="ej__controls">
            <button 
              className={`ej__control-btn ${!isAutoPlaying ? 'ej__control-btn--active' : ''}`}
              onClick={toggleAutoPlay}
            >
              {isAutoPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        <div className="ej__slider-container">
          <button className="ej__nav ej__nav--left" onClick={prevSlide}>
            <ChevronLeftIcon size={24} />
          </button>

          <div className="ej__slider">
            <div 
              className="ej__slider-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {journeys.map((journey, index) => (
                <div key={index} className="ej__slide">
                  <JourneyCard 
                    {...journey}
                    isActive={index === currentSlide}
                  />
                </div>
              ))}
            </div>
          </div>

          <button className="ej__nav ej__nav--right" onClick={nextSlide}>
            <ChevronRightIcon size={24} />
          </button>
        </div>

        <div className="ej__indicators">
          {journeys.map((_, index) => (
            <button
              key={index}
              className={`ej__indicator ${index === currentSlide ? 'ej__indicator--active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <div className="ej__features">
          <div className="ej__feature">
            <div className="ej__feature-icon">
              <Clock size={20} />
            </div>
            <div className="ej__feature-content">
              <h4>Punctual Service</h4>
              <p>We guarantee on-time departures and arrivals</p>
            </div>
          </div>
          
          <div className="ej__feature">
            <div className="ej__feature-icon">
              <Users size={20} />
            </div>
            <div className="ej__feature-content">
              <h4>Comfortable Seating</h4>
              <p>Spacious seats with ample legroom</p>
            </div>
          </div>
          
          <div className="ej__feature">
            <div className="ej__feature-icon">
              <Star size={20} />
            </div>
            <div className="ej__feature-content">
              <h4>Premium Experience</h4>
              <p>Top-rated service with excellent reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

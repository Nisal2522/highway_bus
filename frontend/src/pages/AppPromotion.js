import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Compass as CompassIcon,
  Calendar as CalendarIcon,
  Zap as ZapIcon,
  Accessibility as AccessibilityIcon,
  Shield as ShieldIcon,
  Download,
  Star,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Wifi,
  Battery,
  Signal
} from "lucide-react";
import "./AppPromotion.css";
import TouristaMobile from "../assets/TouristaMobile.png";

const FeatureItem = ({ icon, title, desc, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`ap__feature ${isVisible ? 'ap__feature--visible' : ''}`}>
      <div className="ap__feature-icon">
        {icon}
      </div>
      <div className="ap__feature-content">
        <h4 className="ap__feature-title">{title}</h4>
        <p className="ap__feature-desc">{desc}</p>
      </div>
    </div>
  );
};

const AppScreen = () => (
  <div className="ap__phone-container">
    <div className="ap__phone-frame">
      <div className="ap__phone-header">
        <div className="ap__phone-status">
          <Signal size={12} />
          <Wifi size={12} />
          <Battery size={12} />
        </div>
      </div>
      <div className="ap__phone-screen">
        <div className="ap__app-header">
          <div className="ap__app-logo">
            <Star size={20} />
            <span>TOURISTA</span>
          </div>
          <div className="ap__app-menu">
            <div className="ap__menu-dot"></div>
            <div className="ap__menu-dot"></div>
            <div className="ap__menu-dot"></div>
          </div>
        </div>
        <div className="ap__app-content">
          <div className="ap__search-bar">
            <CompassIcon size={16} />
            <span>Where to?</span>
          </div>
          <div className="ap__quick-actions">
            <div className="ap__action-btn">
              <CalendarIcon size={16} />
              <span>Book Now</span>
            </div>
            <div className="ap__action-btn">
              <UserIcon size={16} />
              <span>My Trips</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AppPromotion = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <UserIcon size={24} />,
      title: "Intuitive Design",
      desc: "Simple screens and clear steps guide you from start to finish, ensuring every interaction is pleasant and efficient."
    },
    {
      icon: <CompassIcon size={24} />,
      title: "Smart Discover",
      desc: "Find routes, stops, and times instantly with intelligent suggestions and saved preferences."
    },
    {
      icon: <CalendarIcon size={24} />,
      title: "One-Tap Booking",
      desc: "Pick a date, select your seats, and confirm — it's that fast."
    },
    {
      icon: <ZapIcon size={24} />,
      title: "Real-time Updates",
      desc: "Stay informed with live departure alerts and schedule changes."
    },
    {
      icon: <AccessibilityIcon size={24} />,
      title: "Accessible for Everyone",
      desc: "Designed with accessibility in mind to be usable by all passengers."
    },
    {
      icon: <ShieldIcon size={24} />,
      title: "Secure Payments",
      desc: "Pay with confidence using industry-standard encryption and trusted payment gateways."
    }
  ];

  return (
    <section className={`ap ${isVisible ? 'ap--visible' : ''}`}>
      <div className="ap__container">
        <div className="ap__header">
          <div className="ap__badge">
            <Smartphone size={16} />
            <span>Mobile App</span>
          </div>
          <h2 className="ap__heading">Get the TOURISTA App Today</h2>
          <p className="ap__lead">
            Your ticket to instant travel convenience. Download our app and experience 
            seamless booking, real-time updates, and exclusive mobile-only features.
          </p>
        </div>

        <div className="ap__content">
          <div className="ap__left">
            <div className="ap__features">
              {features.map((feature, index) => (
                <FeatureItem 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  desc={feature.desc}
                  delay={200 * (index + 1)}
                />
              ))}
            </div>

            <div className="ap__cta">
              <div className="ap__download-buttons">
                <button className="ap__download-btn ap__download-btn--primary">
                  <Download size={20} />
                  <div className="ap__download-text">
                    <span className="ap__download-label">Download on</span>
                    <span className="ap__download-platform">Google Play</span>
                  </div>
                </button>
                <button className="ap__download-btn ap__download-btn--secondary">
                  <Download size={20} />
                  <div className="ap__download-text">
                    <span className="ap__download-label">Download on</span>
                    <span className="ap__download-platform">App Store</span>
                  </div>
                </button>
              </div>
              
              <div className="ap__stats">
                <div className="ap__stat">
                  <span className="ap__stat-number">50K+</span>
                  <span className="ap__stat-label">Downloads</span>
                </div>
                <div className="ap__stat">
                  <span className="ap__stat-number">4.8</span>
                  <span className="ap__stat-label">Rating</span>
                </div>
                <div className="ap__stat">
                  <span className="ap__stat-number">24/7</span>
                  <span className="ap__stat-label">Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ap__right">
            <div className="ap__phone-section">
              <div className="ap__phone-glow"></div>
              <img
                src={TouristaMobile}
                alt="TOURISTA Mobile App"
                className="ap__phone-image"
              />
              <AppScreen />
            </div>
          </div>
        </div>

        <div className="ap__benefits">
          <div className="ap__benefit">
            <CheckCircle size={20} />
            <span>Free to download</span>
          </div>
          <div className="ap__benefit">
            <CheckCircle size={20} />
            <span>No hidden fees</span>
          </div>
          <div className="ap__benefit">
            <CheckCircle size={20} />
            <span>Works offline</span>
          </div>
          <div className="ap__benefit">
            <CheckCircle size={20} />
            <span>Instant booking</span>
          </div>
        </div>
      </div>
    </section>
  );
};

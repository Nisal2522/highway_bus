import React, { useState, useEffect, useRef } from 'react';
import './TourHeroSection.css';

// Import hero images
import heroSigiriya from '../assets/hero-sigiriya.jpg';
import heroElla from '../assets/hero-ella.webp';
import heroGalle from '../assets/hero-galle.jpg';
import heroNuwaraEliya from '../assets/hero-nuwara-eliya.jpg';

const HeroSection = ({ onCategorySelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef(null);
  
  const heroImages = [
    { 
      src: heroGalle, 
      alt: 'Galle Fort',
      subtitle: 'Sun, sand, and endless horizons'
    },
    { 
      src: heroSigiriya, 
      alt: 'Sigiriya Rock Fortress',
      subtitle: 'Step into stories of the past'
    },
    { 
      src: heroElla, 
      alt: 'Ella Nine Arch Bridge',
      subtitle: 'Journey through winding paths and breathtaking views'
    },
    { 
      src: heroNuwaraEliya, 
      alt: 'Nuwara Eliya Tea Plantations',
      subtitle: 'Where tranquility meets endless green'
    }
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Ensure page starts at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  // Handle hero section click
  const handleHeroClick = (e) => {
    // Don't do anything if clicking on category buttons
    if (e.target.closest('.category-btn')) {
      return;
    }
    // Just scroll to tour section smoothly
    const tourSection = document.querySelector('.tour-main');
    if (tourSection) {
      tourSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    onCategorySelect(category);
    // Scroll to tour section smoothly
    const tourSection = document.querySelector('.tour-main');
    if (tourSection) {
      tourSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div 
      className="hero-section"
      ref={heroRef}
      onClick={handleHeroClick}
    >
      {/* Background Slideshow */}
      <div className="hero-slideshow">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image.src})` }}
          />
        ))}
      </div>

      {/* Overlay Content */}
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">DISCOVER SRI LANKA</h1>
          <p 
            key={currentSlide}
            className="hero-subtitle"
          >
            {heroImages[currentSlide].subtitle}
          </p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="category-carousel">
        <div className="category-buttons">
          <button 
            className="category-btn beaches"
            onClick={() => handleCategoryClick('beaches')}
          >
            <span>BEACHES</span>
          </button>
          <button 
            className="category-btn heritage"
            onClick={() => handleCategoryClick('heritage')}
          >
            <span>HERITAGE</span>
          </button>
          <button 
            className="category-btn nature"
            onClick={() => handleCategoryClick('nature')}
          >
            <span>NATURE & ADVENTURE</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;

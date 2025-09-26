import React, { useState, useEffect } from "react";
import { SearchForm } from "./SearchForm";
import "./HeroSection.css";
import BusOne from "../assets/BusOne.png";
import nightSeats from "../assets/nightSeats.png";

export const HeroSection = ({ onSearchResults }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('in'); // 'in' or 'out'
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [BusOne, nightSeats];

  useEffect(() => {
    // Initial slide in
    setSlideDirection('in');
    setIsTransitioning(false);

    const slideInTimer = setTimeout(() => {
      setIsTransitioning(true);
      setSlideDirection('out');

      const slideOutTimer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setSlideDirection('in');
        setIsTransitioning(false);
      }, 800); // 800ms for slide out animation

      return () => clearTimeout(slideOutTimer);
    }, 4000); // Wait 4 seconds before sliding out

    return () => clearTimeout(slideInTimer);
  }, [currentImageIndex, images.length]);

  return (
    <section className="hero">
      {/* Image Slider Container */}
      <div className="hero__image-slider">
        {/* Current Image */}
        <div
          className={`hero__background ${slideDirection} ${isTransitioning ? 'transitioning' : ''}`}
          style={{
            backgroundImage: `linear-gradient(rgba(66, 68, 150, 0.5), rgba(0,0,0,0.65)), url(${images[currentImageIndex]})`,
          }}
        />
        
        {/* Next Image (for smooth transition) */}
        <div
          className={`hero__background-next ${slideDirection === 'out' ? 'visible' : ''}`}
          style={{
            backgroundImage: `linear-gradient(rgba(66, 68, 150, 0.5), rgba(0,0,0,0.65)), url(${images[(currentImageIndex + 1) % images.length]})`,
          }}
        />
      </div>

      {/* Image Indicators */}
      <div className="hero__image-indicators">
        {images.map((_, index) => (
          <div
            key={index}
            className={`hero__indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentImageIndex(index);
              setSlideDirection('in');
              setIsTransitioning(false);
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="hero__navigation">
        <button 
          className="hero__nav-button hero__nav-button--prev"
          onClick={() => {
            setCurrentImageIndex((prevIndex) => 
              prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
            setSlideDirection('in');
            setIsTransitioning(false);
          }}
        >
          ‹
        </button>
        <button 
          className="hero__nav-button hero__nav-button--next"
          onClick={() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            setSlideDirection('in');
            setIsTransitioning(false);
          }}
        >
          ›
        </button>
      </div>

      <div className="hero__container">
        <h1 className="hero__title">BOOK NOW</h1>
        <h2 className="hero__subtitle">Your Journey, Just a Click Away.</h2>
        <p className="hero__tag">Effortless travel starts with our trusted service</p>
        <SearchForm onSearchResults={onSearchResults} />
        <p className="hero__payments">Convenient payments with all major cards and methods.</p>
      </div>
    </section>
  );
};

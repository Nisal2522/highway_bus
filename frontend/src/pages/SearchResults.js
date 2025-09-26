import React from "react";
import { MapPin, Clock, DollarSign, Bus, Calendar } from "lucide-react";
import "./SearchResults.css";

export const SearchResults = ({ routes, onBookRoute }) => {
  if (!routes || routes.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results__empty">
          <Bus size={48} className="search-results__empty-icon" />
          <h3>No routes found</h3>
          <p>Try adjusting your search criteria or check back later for new routes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results__header">
        <h2>Available Routes</h2>
        <p>{routes.length} route{routes.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="search-results__list">
        {routes.map((route) => (
          <div key={route.id} className="search-results__item">
            <div className="search-results__route-info">
              <div className="search-results__route-header">
                <div className="search-results__locations">
                  <div className="search-results__location">
                    <MapPin size={16} />
                    <span className="search-results__location-text">{route.fromLocation}</span>
                  </div>
                  <div className="search-results__arrow">→</div>
                  <div className="search-results__location">
                    <MapPin size={16} />
                    <span className="search-results__location-text">{route.toLocation}</span>
                  </div>
                </div>
                <div className="search-results__price">
                  <DollarSign size={16} />
                  <span>LKR {route.ticketPrice}</span>
                </div>
              </div>
              
              <div className="search-results__route-details">
                <div className="search-results__detail">
                  <Clock size={16} />
                  <span>
                    {route.departureTime ? route.departureTime : 'N/A'} - 
                    {route.arrivalTime ? route.arrivalTime : 'N/A'}
                  </span>
                </div>
                <div className="search-results__detail">
                  <Calendar size={16} />
                  <span>Available daily</span>
                </div>
              </div>
              
              {route.description && (
                <div className="search-results__description">
                  <p>{route.description}</p>
                </div>
              )}
            </div>
            
            <div className="search-results__actions">
              <button 
                className="search-results__book-button"
                onClick={() => onBookRoute && onBookRoute(route)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

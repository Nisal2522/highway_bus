import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { TopBar } from './TopBar';
import { HeroSection } from './HeroSection';
import { SearchResults } from './SearchResults';
import { SeasonalPicks } from './SeasonalPicks';
import { ExclusiveJourneys } from './ExclusiveJourneys';
import { AppPromotion } from './AppPromotion';
import { Footer } from '../components/Footer';
import './PassengerHome.css';

const PassengerHome = ({ onLogout }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearchResults = (routes) => {
    setSearchResults(routes);
    setShowSearchResults(true);
    // Scroll to search results
    setTimeout(() => {
      const resultsElement = document.getElementById('search-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBookRoute = (route) => {
    console.log('Booking route:', route);
    
    // For now, we'll use the first assigned bus or create a mock bus
    // In a real application, you'd let the user select from available buses
    const selectedBus = route.busAssignments && route.busAssignments.length > 0 
      ? route.busAssignments[0] 
      : {
          id: 1,
          busName: 'Express Bus',
          registrationNumber: 'ABC-1234',
          seatCount: 40
        };
    
    // Save route and bus to localStorage as fallback
    try {
      localStorage.setItem('selectedRoute', JSON.stringify(route));
      localStorage.setItem('selectedBus', JSON.stringify(selectedBus));
    } catch (error) {
      // Ignore localStorage errors
    }

    // Navigate to seat booking page with route and bus data
    navigate('/seat-booking', {
      state: {
        route: route,
        selectedBus: selectedBus
      }
    });
  };

  const handleExplorePackage = (tripData) => {
    console.log('Exploring package:', tripData);
    navigate('/package-booking', {
      state: {
        tripData: tripData
      }
    });
  };

  return (
    <div className="passenger-home">
      <Navbar onLogout={onLogout} />
      <TopBar />
      <main>
        <HeroSection onSearchResults={handleSearchResults} />
        
        {showSearchResults && (
          <div id="search-results">
            <SearchResults 
              routes={searchResults} 
              onBookRoute={handleBookRoute}
            />
          </div>
        )}
        
        {!showSearchResults && (
          <>
            <SeasonalPicks onExplore={handleExplorePackage} />
            <ExclusiveJourneys />
            <AppPromotion />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PassengerHome;

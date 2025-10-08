import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from './TourHeroSection';
import TourMain from './TourMain';
import RouteDetails from './RouteDetails';
import AdminTourManagement from './AdminTourManagement';
import { Footer } from '../components/Footer';
import './TourHeroSection.css';
import './TourMain.css';

const TourHome = ({ onLogout }) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tripData, setTripData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);

  // Get user data from localStorage (same pattern as App.js)
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  });

  // Check user role
  const isAdmin = user?.userType === 'ADMIN';
  const isPassenger = user?.userType === 'PASSENGER';

  // Load tours from localStorage (admin-created tours) or use sample data as fallback
  const [sampleRoutes, setSampleRoutes] = useState(() => {
    // Try to load admin-created tours from localStorage
    const adminTours = localStorage.getItem('adminTours');
    if (adminTours && adminTours !== 'null' && adminTours !== 'undefined') {
      try {
        const parsedTours = JSON.parse(adminTours);
        // Filter out inactive tours and convert admin tour format to passenger view format
        return parsedTours
          .filter(tour => tour.isActive === true) // Only show active tours
          .map(tour => ({
            id: tour.id,
            title: tour.title,
            departureCity: "Colombo", // Default departure city
            arrivalCity: tour.title.split(' ')[0], // Extract city from title
            explorationTime: "2 days", // Default exploration time
            price: tour.basePrice?.toString() || "0",
            availableSeats: tour.availableSeats || 0,
            rating: tour.rating?.toString() || "0",
            imageUrl: tour.imageUrl || "/api/placeholder/400/300",
            description: tour.description || "",
            category: tour.category || "general"
          }));
      } catch (error) {
        console.error('Error parsing admin tours:', error);
      }
    }
    
    // Fallback to sample data if no admin tours found
    return [
    {
      id: 1,
      title: "Galle Fort Heritage Tour",
      departureCity: "Colombo",
      arrivalCity: "Galle",
      explorationTime: "2 days",
      price: "8,500",
      availableSeats: 25,
      rating: "4.8",
      imageUrl: "/api/placeholder/400/300",
      description: "Explore the historic Galle Fort, a UNESCO World Heritage site with Dutch colonial architecture, museums, and stunning ocean views.",
      category: "heritage"
    },
    {
      id: 2,
      title: "Sigiriya Rock Fortress Adventure",
      departureCity: "Colombo",
      arrivalCity: "Sigiriya",
      explorationTime: "1 day",
      price: "6,200",
      availableSeats: 30,
      rating: "4.9",
      imageUrl: "/api/placeholder/400/300",
      description: "Climb the ancient rock fortress of Sigiriya, marvel at the frescoes, and enjoy panoramic views of the surrounding landscape.",
      category: "heritage"
    },
    {
      id: 3,
      title: "Ella Scenic Railway Journey",
      departureCity: "Colombo",
      arrivalCity: "Ella",
      explorationTime: "3 days",
      price: "12,000",
      availableSeats: 20,
      rating: "4.7",
      imageUrl: "/api/placeholder/400/300",
      description: "Experience the famous Nine Arch Bridge, tea plantations, and breathtaking mountain views in the hill country.",
      category: "nature"
    },
    {
      id: 4,
      title: "Nuwara Eliya Tea Country",
      departureCity: "Colombo",
      arrivalCity: "Nuwara Eliya",
      explorationTime: "2 days",
      price: "9,800",
      availableSeats: 28,
      rating: "4.6",
      imageUrl: "/api/placeholder/400/300",
      description: "Visit tea plantations, enjoy cool climate, and experience the 'Little England' of Sri Lanka.",
      category: "nature"
    },
    {
      id: 5,
      title: "Mirissa Beach Paradise",
      departureCity: "Colombo",
      arrivalCity: "Mirissa",
      explorationTime: "2 days",
      price: "7,500",
      availableSeats: 35,
      rating: "4.5",
      imageUrl: "/api/placeholder/400/300",
      description: "Relax on pristine beaches, go whale watching, and enjoy fresh seafood in this coastal paradise.",
      category: "beaches"
    },
    {
      id: 6,
      title: "Bentota Water Sports Adventure",
      departureCity: "Colombo",
      arrivalCity: "Bentota",
      explorationTime: "1 day",
      price: "5,500",
      availableSeats: 40,
      rating: "4.4",
      imageUrl: "/api/placeholder/400/300",
      description: "Enjoy water sports, river safaris, and beach activities in this popular coastal destination.",
      category: "beaches"
    },
    {
      id: 7,
      title: "Anuradhapura Ancient City",
      departureCity: "Colombo",
      arrivalCity: "Anuradhapura",
      explorationTime: "2 days",
      price: "8,200",
      availableSeats: 22,
      rating: "4.7",
      imageUrl: "/api/placeholder/400/300",
      description: "Explore the ancient capital with its sacred Bodhi tree, stupas, and archaeological wonders.",
      category: "heritage"
    },
    {
      id: 8,
      title: "Kandy Cultural Triangle",
      departureCity: "Colombo",
      arrivalCity: "Kandy",
      explorationTime: "2 days",
      price: "7,800",
      availableSeats: 32,
      rating: "4.6",
      imageUrl: "/api/placeholder/400/300",
      description: "Visit the Temple of the Tooth, cultural shows, and the beautiful Kandy Lake.",
      category: "heritage"
    }
    ];
  });

  // Add useEffect to refresh tours when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const adminTours = localStorage.getItem('adminTours');
      if (adminTours && adminTours !== 'null' && adminTours !== 'undefined') {
        try {
          const parsedTours = JSON.parse(adminTours);
          // Filter out inactive tours and convert to passenger view format
          const convertedTours = parsedTours
            .filter(tour => tour.isActive === true) // Only show active tours
            .map(tour => ({
              id: tour.id,
              title: tour.title,
              departureCity: "Colombo",
              arrivalCity: tour.title.split(' ')[0],
              explorationTime: "2 days",
              price: tour.basePrice?.toString() || "0",
              availableSeats: tour.availableSeats || 0,
              rating: tour.rating?.toString() || "0",
              imageUrl: tour.imageUrl || "/api/placeholder/400/300",
              description: tour.description || "",
              category: tour.category || "general"
            }));
          setSampleRoutes(convertedTours);
        } catch (error) {
          console.error('Error parsing admin tours:', error);
        }
      }
    };

    // Listen for storage changes (works across tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom tour update events (works within same tab)
    window.addEventListener('tourUpdated', handleStorageChange);
    
    // Also check on component mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tourUpdated', handleStorageChange);
    };
  }, []);


  // Handle category selection from HeroSection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Handle tour details view
  const handleViewDetails = (routeId) => {
    console.log('Viewing details for route:', routeId);
    // Find the selected route from sampleRoutes
    const selectedRouteData = sampleRoutes.find(route => route.id === routeId);
    
    if (selectedRouteData) {
      setSelectedRoute(selectedRouteData);
      setShowRouteDetails(true);
    }
  };

  // Handle back to tours
  const handleBackToTours = () => {
    setShowRouteDetails(false);
    setSelectedRoute(null);
  };

  // Get trip data from navigation state if available
  useEffect(() => {
    if (location.state && location.state.tripData) {
      setTripData(location.state.tripData);
      console.log('Received trip data:', location.state.tripData);
    }
  }, [location.state]);

  // If showing route details, render RouteDetails component
  if (showRouteDetails && selectedRoute) {
    return (
      <div className="tours-page">
        <Navbar onLogout={onLogout} />
        <RouteDetails 
          route={selectedRoute} 
          onBack={handleBackToTours}
        />
        <Footer />
      </div>
    );
  }

  // Render different content based on user role
  const renderContent = () => {
    if (isAdmin) {
      // Admin view: Tour management interface
      return <AdminTourManagement />;
    } else if (isPassenger) {
      // Passenger view: Tour browsing interface
      return (
        <>
          <HeroSection onCategorySelect={handleCategorySelect} />
          <TourMain 
            onViewDetails={handleViewDetails}
            sampleRoutes={sampleRoutes}
            selectedCategory={selectedCategory}
          />
        </>
      );
    } else {
      // Fallback for other user types
      return (
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      );
    }
  };

  return (
    <div className="tours-page">
      <Navbar onLogout={onLogout} />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default TourHome;
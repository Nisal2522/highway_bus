import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Bus, CreditCard, UserCheck, Lock, RefreshCw } from 'lucide-react';
import './SeatBooking.css';

// Safe authentication hook that doesn't require AuthProvider
const useSafeAuth = () => {
  const [authState, setAuthState] = useState({ user: null, isAuthenticated: false });
  
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
        const userData = JSON.parse(savedUser);
        if (userData && userData.isAuthenticated === true) {
          setAuthState({ user: userData, isAuthenticated: true });
        }
      }
    } catch (error) {
      // No authentication data available
    }
  }, []);
  
  const setUser = (userData) => {
    setAuthState({ user: userData, isAuthenticated: true });
  };
  
  return { ...authState, setUser };
};

const SeatBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { route, selectedBus, bookingCompleted, bookedSeats } = location.state || {};
  
  // Fallback: Try to get route and bus from localStorage if not in state
  const [fallbackRoute, setFallbackRoute] = useState(null);
  const [fallbackBus, setFallbackBus] = useState(null);
  
  useEffect(() => {
    if (!route || !selectedBus) {
      try {
        const savedRoute = localStorage.getItem('selectedRoute');
        const savedBus = localStorage.getItem('selectedBus');
        
        if (savedRoute && savedBus) {
          setFallbackRoute(JSON.parse(savedRoute));
          setFallbackBus(JSON.parse(savedBus));
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    } else {
      // Save current route and bus to localStorage for future use
      try {
        localStorage.setItem('selectedRoute', JSON.stringify(route));
        localStorage.setItem('selectedBus', JSON.stringify(selectedBus));
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }, [route, selectedBus]);
  
  // Use fallback data if main data is not available
  const currentRoute = route || fallbackRoute;
  const currentBus = selectedBus || fallbackBus;
  
  // Use safe authentication hook
  const { user, isAuthenticated, setUser } = useSafeAuth();
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    nic: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);

  // Generate seat layout based on bus capacity and occupied seats
  const generateSeatLayout = (capacity, occupiedSeats = []) => {
    const seats = [];
    const rows = Math.ceil(capacity / 4); // 4 seats per row (2+2 layout)
    
    for (let i = 1; i <= capacity; i++) {
      const row = Math.ceil(i / 4);
      const position = ((i - 1) % 4) + 1;
      const isWindow = position === 1 || position === 4;
      const isAisle = position === 2 || position === 3;
      
      // Check if seat is occupied from backend data
      const isOccupied = occupiedSeats.includes(i.toString());
      
      seats.push({
        id: i,
        number: i,
        row: row,
        position: position,
        isWindow: isWindow,
        isAisle: isAisle,
        isAvailable: !isOccupied, // Use real occupied data instead of random
        isSelected: false
      });
    }
    
    return seats;
  };

  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(0);
  const [recentlyBookedSeats, setRecentlyBookedSeats] = useState([]);

  // Function to fetch occupied seats from backend
  const fetchOccupiedSeats = async (busId, routeId) => {
    try {
      setLoadingSeats(true);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`http://localhost:8081/api/bookings/occupied-seats?busId=${busId}&routeId=${routeId}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setBackendConnected(true);
        return data.occupiedSeats || [];
      } else {
        setBackendConnected(false);
        return getFallbackOccupiedSeats();
      }
    } catch (error) {
      setBackendConnected(false);
      return getFallbackOccupiedSeats();
    } finally {
      setLoadingSeats(false);
    }
  };

  // Fallback function to provide some occupied seats when backend is not available
  const getFallbackOccupiedSeats = () => {
    // Return a consistent set of occupied seats for demo purposes
    // These will remain the same across refreshes
    return ['3', '11', '12', '13', '16', '21', '24', '25', '33', '35', '37'];
  };

  const loadSeats = async () => {
    try {
      if (currentBus && currentRoute) {
        // Fetch occupied seats from backend
        const occupiedSeats = await fetchOccupiedSeats(currentBus.id, currentRoute.id);
        
        // Generate seat layout with real occupied data
        const seatLayout = generateSeatLayout(currentBus.seatCount || 40, occupiedSeats);
        setSeats(seatLayout);
      }
    } catch (error) {
      // Fallback to empty seat layout if everything fails
      const fallbackLayout = generateSeatLayout(40, []);
      setSeats(fallbackLayout);
    }
  };

  useEffect(() => {
    loadSeats();
  }, [currentBus, currentRoute]);

  // Show booking completion message when returning from payment
  useEffect(() => {
    if (bookingCompleted && bookedSeats) {
      // Clear any selected seats since booking is completed
      setSelectedSeats([]);
      
      // Mark seats as recently booked for visual indication
      setRecentlyBookedSeats(bookedSeats);
      
      // Show success message
      setTimeout(() => {
        alert(`✅ Booking Completed Successfully!\n\nSeats ${bookedSeats.join(', ')} have been booked and are now occupied.\n\nYou can see the updated seat map below.`);
      }, 500);
      
      // Clear recently booked indicator after 5 seconds
      setTimeout(() => {
        setRecentlyBookedSeats([]);
      }, 5000);
    }
  }, [bookingCompleted, bookedSeats]);

  useEffect(() => {
    setTotalPrice(selectedSeats.length * (currentRoute?.ticketPrice || 0));
  }, [selectedSeats, currentRoute]);

  const handleSeatClick = (seatId) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    );

    setSelectedSeats(prev => {
      const seat = seats.find(s => s.id === seatId);
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-fill passenger details from logged-in user
  const autoFillPassengerDetails = () => {
    if (user && isAuthenticated) {
      // Debug: Log complete user data structure
      console.log('=== USER DATA DEBUG ===');
      console.log('Full user object:', JSON.stringify(user, null, 2));
      console.log('User keys:', Object.keys(user));
      console.log('User type:', typeof user);
      
      // Try multiple possible field names for each field
      const name = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.name || user.fullName || user.firstName || '';
      
      const email = user.email || user.emailAddress || '';
      
      const phone = user.phone || user.phoneNumber || user.mobile || user.contactNumber || '';
      
      // Enhanced NIC field checking with comprehensive debugging
      console.log('=== NIC FIELD DEBUG ===');
      console.log('user.idNumber:', user.idNumber);
      console.log('user.nic:', user.nic);
      console.log('user.nicNumber:', user.nicNumber);
      console.log('user.nationalId:', user.nationalId);
      console.log('user.id_number:', user.id_number);
      console.log('user.national_id:', user.national_id);
      console.log('user.identityNumber:', user.identityNumber);
      console.log('user.identity_number:', user.identity_number);
      console.log('user.passportNumber:', user.passportNumber);
      console.log('user.passport_number:', user.passport_number);
      
      // Check all possible NIC field variations
      const nicFields = [
        'idNumber', 'nic', 'nicNumber', 'nationalId', 'id_number', 
        'national_id', 'identityNumber', 'identity_number', 
        'passportNumber', 'passport_number', 'nationalIdNumber',
        'id', 'ID', 'NIC', 'NIC_NUMBER', 'IDENTITY_NUMBER'
      ];
      
      let nic = '';
      for (const field of nicFields) {
        if (user[field] && user[field].toString().trim() !== '') {
          nic = user[field].toString().trim();
          console.log(`Found NIC in field '${field}':`, nic);
          break;
        }
      }
      
      console.log('Final NIC value:', nic);
      console.log('=== END DEBUG ===');
      
      setPassengerDetails({
        name: name,
        email: email,
        phone: phone,
        nic: nic
      });
      
      // Show which fields were successfully filled
      const filledFields = [];
      if (name) filledFields.push('Name');
      if (email) filledFields.push('Email');
      if (phone) filledFields.push('Phone');
      if (nic) filledFields.push('NIC');
      
      if (filledFields.length > 0) {
        console.log(`✅ Auto-filled fields: ${filledFields.join(', ')}`);
        if (nic) {
          console.log(`✅ NIC successfully filled: ${nic}`);
        } else {
          console.log('❌ NIC field is empty - no NIC data found in user profile');
        }
      } else {
        console.log('❌ No user data found for auto-fill');
      }
    } else {
      console.log('❌ User not authenticated or user data not available');
    }
  };

  // Function to fetch complete user data from backend
  const fetchUserData = async () => {
    try {
      setIsFetchingUserData(true);
      console.log('🔄 Fetching user data from backend...');
      
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      const response = await fetch('http://localhost:8081/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Backend response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Fetched user data from backend:', JSON.stringify(userData, null, 2));
        console.log('Backend user keys:', Object.keys(userData));
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else {
        console.log('❌ Backend response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.log('Error response:', errorText);
      }
    } catch (error) {
      console.log('❌ Could not fetch user data from backend:', error);
    } finally {
      setIsFetchingUserData(false);
    }
    return null;
  };

  // Direct function to fetch and set NIC data
  const fetchAndSetNIC = async () => {
    try {
      console.log('🔍 Attempting to fetch NIC data...');
      
      // First check local storage thoroughly
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const parsedUser = JSON.parse(localUser);
        console.log('Local user data:', parsedUser);
        console.log('Available fields in local user:', Object.keys(parsedUser));
        
        // Check for NIC in local data with more comprehensive field checking
        const nicFields = [
          'idNumber', 'nic', 'nicNumber', 'nationalId', 'id_number', 'national_id',
          'identityNumber', 'identity_number', 'passportNumber', 'passport_number',
          'id', 'ID', 'NIC', 'NIC_NUMBER', 'IDENTITY_NUMBER', 'nationalIdNumber'
        ];
        
        for (const field of nicFields) {
          if (parsedUser[field] && parsedUser[field].toString().trim() !== '') {
            console.log(`✅ Found NIC in local data (${field}):`, parsedUser[field]);
            setPassengerDetails(prev => ({
              ...prev,
              nic: parsedUser[field].toString().trim()
            }));
            return;
          }
        }
        
        // If still not found, log all available fields for debugging
        console.log('❌ NIC not found in local data. Available fields:');
        Object.keys(parsedUser).forEach(key => {
          console.log(`  ${key}: ${parsedUser[key]} (type: ${typeof parsedUser[key]})`);
        });
      }
      
      // Try backend only if local data doesn't have NIC
      console.log('🔄 Attempting backend fetch...');
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8081/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log('✅ Backend user data:', userData);
            console.log('Backend user fields:', Object.keys(userData));
            
            // Check for NIC in backend data
            const nicFields = ['idNumber', 'nic', 'nicNumber', 'nationalId', 'id_number', 'national_id'];
            for (const field of nicFields) {
              if (userData[field] && userData[field].toString().trim() !== '') {
                console.log(`✅ Found NIC in backend data (${field}):`, userData[field]);
                setPassengerDetails(prev => ({
                  ...prev,
                  nic: userData[field].toString().trim()
                }));
                return;
              }
            }
            
            console.log('❌ NIC not found in backend data either');
          } else {
            console.log(`❌ Backend request failed: ${response.status} ${response.statusText}`);
            if (response.status === 403) {
              console.log('🔒 Authentication failed (403) - token may be expired or invalid');
              console.log('💡 Using local data only. Please login again if needed.');
            }
          }
        } catch (networkError) {
          console.log('❌ Network error fetching from backend:', networkError);
          console.log('💡 Using local data only.');
        }
      } else {
        console.log('❌ No authentication token found');
      }
    } catch (error) {
      console.log('❌ Error fetching NIC:', error);
    }
  };

  // Auto-fill passenger details when user is authenticated
  useEffect(() => {
    const initializeUserData = async () => {
      if (user && isAuthenticated) {
        // First try with current user data
        autoFillPassengerDetails();
        
        // Specifically fetch NIC data
        await fetchAndSetNIC();
      }
    };
    
    initializeUserData();
  }, [user, isAuthenticated]);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
      alert('Please fill in all required passenger details');
      return;
    }

    // Navigate to payment page with booking details
    navigate('/payment', {
      state: {
        bookingDetails: {
          selectedSeats: selectedSeats,
          pricePerSeat: currentRoute?.ticketPrice || 0,
          totalPrice: totalPrice,
          route: currentRoute,
          bus: currentBus,
          passenger: passengerDetails
        },
        fromSeatBooking: true
      }
    });
  };



  if (!currentRoute || !currentBus) {
    return (
      <div className="seat-booking-error">
        <div className="error-content">
          <div className="error-icon">
            <Bus size={64} />
          </div>
          <h2>No Route or Bus Selected</h2>
          <p>Please select a route and bus before booking seats.</p>
          <div className="error-actions">
            <button 
              className="primary-button" 
              onClick={() => navigate('/passenger-home')}
            >
              <MapPin size={20} />
              Go Back to Search
            </button>
            <button 
              className="secondary-button" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-booking">
      <div className="seat-booking-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Select Your Seats</h1>
      </div>


      <div className="seat-booking-container">
        <div className="booking-info">
          <div className="route-info">
            <h2>Route Details</h2>
            
            {/* Main Route Information */}
            <div className="route-main-info">
              <div className="route-location">
                <MapPin size={18} />
                <span>{currentRoute.fromLocation}</span>
              </div>
              <div className="route-arrow">→</div>
              <div className="route-location">
                <MapPin size={18} />
                <span>{currentRoute.toLocation}</span>
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="route-details-grid">
              <div className="route-detail-item">
                <Clock size={18} className="route-detail-icon" />
                <div>
                  <div className="route-detail-label">Departure</div>
                  <div className="route-detail-value">{currentRoute.departureTime}</div>
                </div>
              </div>
              
              <div className="route-detail-item">
                <Clock size={18} className="route-detail-icon" />
                <div>
                  <div className="route-detail-label">Arrival</div>
                  <div className="route-detail-value">{currentRoute.arrivalTime}</div>
                </div>
              </div>
              
              <div className="route-detail-item">
                <Bus size={18} className="route-detail-icon" />
                <div>
                  <div className="route-detail-label">Bus</div>
                  <div className="route-detail-value">{currentBus.busName} ({currentBus.registrationNumber})</div>
                </div>
              </div>
              
              <div className="route-detail-item">
                <CreditCard size={18} className="route-detail-icon" />
                <div>
                  <div className="route-detail-label">Price</div>
                  <div className="route-detail-value">Rs. {currentRoute.ticketPrice} per seat</div>
                </div>
              </div>
            </div>
          </div>

          <div className="passenger-details">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Passenger Details</h2>
              {isAuthenticated && user ? (
                <div style={{ 
                  fontSize: '12px', 
                  color: isFetchingUserData ? '#ffc107' : '#28a745', 
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <UserCheck size={16} />
                  {isFetchingUserData ? 'Fetching your details...' : 'Auto-filled from your profile'}
                </div>
              ) : (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6c757d', 
                  fontStyle: 'italic' 
                }}>
                  Login to auto-fill details
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={passengerDetails.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={passengerDetails.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={passengerDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="form-group">
              <label>NIC Number</label>
              <input
                type="text"
                name="nic"
                value={passengerDetails.nic}
                onChange={handleInputChange}
                placeholder="Enter your NIC number"
              />
            </div>
          </div>
        </div>

          <div className="seat-selection">
            <div className="seat-legend">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Select Seats</h2>
                <button 
                  onClick={loadSeats} 
                  disabled={loadingSeats}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    padding: '5px 10px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: loadingSeats ? 'not-allowed' : 'pointer',
                    opacity: loadingSeats ? 0.6 : 1
                  }}
                >
                  <RefreshCw size={16} style={{ animation: loadingSeats ? 'spin 1s linear infinite' : 'none' }} />
                  Refresh
                </button>
              </div>
              {loadingSeats && <p>🔄 Loading seat availability...</p>}
              {refreshCountdown > 0 && (
                <div style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#d4edda', 
                  border: '1px solid #c3e6cb', 
                  borderRadius: '4px', 
                  marginBottom: '10px',
                  fontSize: '14px',
                  color: '#155724',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  🔄 Page will refresh in {refreshCountdown} seconds to show updated seats...
                </div>
              )}
              {!backendConnected && (
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px', 
                  marginBottom: '10px',
                  fontSize: '14px',
                  color: '#856404'
                }}>
                  ⚠️ Backend not connected - showing demo seat data
                </div>
              )}
              <div className="legend">
                <div className="legend-item">
                  <div className="seat-available"></div>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <div className="seat-selected"></div>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="seat-occupied"></div>
                  <span>Occupied</span>
                </div>
                {recentlyBookedSeats.length > 0 && (
                  <div className="legend-item">
                    <div className="seat-recently-booked"></div>
                    <span>Just Booked</span>
                  </div>
                )}
              </div>
            </div>

          <div className="bus-layout">
            <div className="bus-front">
              <div className="driver-seat">Driver</div>
            </div>
            
            <div className="seats-grid">
              {seats.map(seat => (
                <div
                  key={seat.id}
                  className={`seat ${seat.isAvailable ? 'available' : 'occupied'} ${seat.isSelected ? 'selected' : ''} ${recentlyBookedSeats.includes(seat.id) ? 'recently-booked' : ''}`}
                  onClick={() => seat.isAvailable && handleSeatClick(seat.id)}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          </div>

          <div className="booking-summary">
            <div className="summary-item">
              <span>Selected Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="summary-item">
              <span>Price per Seat:</span>
              <span>Rs. {currentRoute.ticketPrice}</span>
            </div>
            <div className="summary-item total">
              <span>Total Price:</span>
              <span>Rs. {totalPrice}</span>
            </div>
          </div>

          <button 
            className="book-button"
            onClick={handleBooking}
            disabled={isBooking || selectedSeats.length === 0}
          >
            {isBooking ? 'Processing...' : (
              <>
                <Lock size={16} />
                Pay & Book {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} - Rs. {totalPrice}
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default SeatBooking;

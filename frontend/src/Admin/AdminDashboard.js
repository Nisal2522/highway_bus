import React, { useState, useEffect } from 'react';
import { 
  Routes, 
  Users, 
  Bus, 
  CheckCircle, 
  X, 
  Plus,
  User,
  UserCheck,
  BarChart3,
  Route,
  Search,
  CreditCard,
  MapPin
} from 'lucide-react';
import AdminRoutes from './AdminRoutes';
import AdminApprove from './adminapprove';
import AdminTourManagement from '../Tours/AdminTourManagement';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import PaymentGateway from '../components/PaymentGateway';
import nightSeatsImage from '../assets/nightSeats.png';
import './AdminDashboard.css';
import './BusDetails.css';

const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalBuses: 156,
    pendingApprovals: 23,
    activeRoutes: 0,
    totalUsers: 0,
    passengerCount: 0,
    ownerCount: 0
  });

  // Route management state
  const [showRoutes, setShowRoutes] = useState(false);
  const [showApproveBus, setShowApproveBus] = useState(false);
  const [showViewPayment, setShowViewPayment] = useState(false);
  const [showTourManagement, setShowTourManagement] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [approvedBuses, setApprovedBuses] = useState([]);
  const [pendingBuses, setPendingBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Form state
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    status: 'ACTIVE'
  });

  // Bus assignment state
  const [assignmentData, setAssignmentData] = useState({
    busId: '',
    departureDate: '',
    departureTime: '',
    assignedSeats: 0
  });

  // Bus income state
  const [busIncomes, setBusIncomes] = useState([]);
  const [isLoadingBusData, setIsLoadingBusData] = useState(false);
  
  // Selected bus state
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBusDetails, setShowBusDetails] = useState(false);
  const [busBookings, setBusBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  // Filter options state
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Pagination state for bus income cards
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(3);
  
  // Pagination state for routes
  const [currentRoutePage, setCurrentRoutePage] = useState(1);
  const [routesPerPage] = useState(2);
  
  // Pagination state for booking cards
  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const [bookingsPerPage] = useState(2);
  
  // Payment gateway state
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Load bus income data when component mounts
  useEffect(() => {
    if (showViewPayment) {
      fetchBusIncomes();
    }
  }, [showViewPayment]);

  // Edit assignment state
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showEditAssignmentModal, setShowEditAssignmentModal] = useState(false);

  const handleViewRoutesClick = async () => {
    if (showRoutes) {
      // If routes are already shown, close them
      setShowRoutes(false);
    } else {
      // If routes are not shown, open them and fetch data
      setShowRoutes(true);
      
      // Reset pagination to first page
      setCurrentRoutePage(1);
      
      await fetchRoutes();
      await fetchApprovedBuses();
      // Scroll to the routes section after a short delay
      setTimeout(() => {
        const routesElement = document.querySelector('.routes-section');
        if (routesElement) {
          routesElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleApproveBusClick = async () => {
    if (showApproveBus) {
      // If approve bus is already shown, close it
      setShowApproveBus(false);
    } else {
      // If approve bus is not shown, open it and fetch data
      setShowApproveBus(true);
      
      // Test database connection first
      console.log('🧪 Testing database connection...');
      await testDatabaseConnection();
      
      // Then fetch pending buses
      await fetchPendingBuses();
      
      // Scroll to the approve bus section after a short delay
      setTimeout(() => {
        const approveBusElement = document.querySelector('.approve-bus-section');
        if (approveBusElement) {
          approveBusElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  const handleTourManagementClick = () => {
    if (showTourManagement) {
      setShowTourManagement(false);
    } else {
      setShowTourManagement(true);
      // Scroll to the tour management section after a short delay
      setTimeout(() => {
        const tourManagementElement = document.querySelector('.tour-management-section');
        if (tourManagementElement) {
          tourManagementElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCloseTourManagement = () => {
    setShowTourManagement(false);
  };

  const handleCloseRoutes = () => {
    setShowRoutes(false);
  };

  const handleCloseApproveBus = () => {
    setShowApproveBus(false);
  };

  const handleViewPaymentClick = async () => {
    if (showViewPayment) {
      // If view payment is already shown, close it
      setShowViewPayment(false);
    } else {
      // If view payment is not shown, open it
      setShowViewPayment(true);
      
      // Reset pagination to first page
      setCurrentPage(1);
      
      // Fetch bus income data when opening
      await fetchBusIncomes();
      
      // Scroll to the view payment section after a short delay
      setTimeout(() => {
        const viewPaymentElement = document.querySelector('.view-payment-section');
        if (viewPaymentElement) {
          viewPaymentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCloseViewPayment = () => {
    setShowViewPayment(false);
  };

  const handleBusCardClick = async (bus) => {
    setSelectedBus(bus);
    setShowBusDetails(true);
    
    // Reset booking pagination to first page
    setCurrentBookingPage(1);
    
    // Fetch booking data for this specific bus
    await fetchBusBookings(bus.id);
    
    // Scroll to the bus details section after a short delay
    setTimeout(() => {
      const busDetailsElement = document.querySelector('.bus-details-section');
      if (busDetailsElement) {
        busDetailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseBusDetails = () => {
    setShowBusDetails(false);
    setSelectedBus(null);
    setBusBookings([]);
    setFilterStatus('all');
    setSortBy('date-desc');
  };

  // Make Payment function for monthly income
  const handleMakePayment = (month, year, busId) => {
    console.log(`🔄 Opening payment gateway for ${month} ${year}, Bus ID: ${busId}`);
    
    // Calculate the amount for this specific month
    const monthlyIncome = selectedBus?.monthlyBreakdown?.find(m => 
      m.month === month && m.year === year
    )?.income || 0;
    
    // Create payment details for the gateway
    const paymentData = {
      busId: busId,
      month: month,
      year: year,
      amount: monthlyIncome,
      totalPrice: monthlyIncome,
      pricePerSeat: monthlyIncome,
      selectedSeats: [`${month} ${year}`],
      busName: selectedBus?.bus_name || 'Bus',
      routeName: `${month} ${year} Income Payment`,
      description: `Monthly income payment for ${month} ${year}`
    };
    
    setPaymentDetails(paymentData);
    setShowPaymentGateway(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentData) => {
    console.log('✅ Payment successful:', paymentData);
    
    try {
      // Create payment record in backend
      const paymentRecord = {
        busId: paymentDetails.busId,
        month: paymentDetails.month,
        year: paymentDetails.year,
        amount: paymentDetails.amount,
        paymentMethod: paymentData.method,
        transactionId: paymentData.transactionId,
        status: 'PAID',
        paymentDate: new Date().toISOString()
      };

      // Call API to record the payment
      const response = await fetch('http://localhost:8081/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRecord)
      });

      if (response.ok) {
        console.log('✅ Payment record saved successfully');
        
        // Show success message with transaction details
        alert(`Payment processed successfully for ${paymentDetails.month} ${paymentDetails.year}!\n\nTransaction ID: ${paymentData.transactionId}\nAmount: LKR ${paymentDetails.amount.toLocaleString()}\nPayment Method: ${paymentData.method}`);
        
        // Update the monthly breakdown to show paid status
        if (selectedBus && selectedBus.monthlyBreakdown) {
          const updatedBreakdown = selectedBus.monthlyBreakdown.map(month => {
            if (month.month === paymentDetails.month && month.year === paymentDetails.year) {
              return { ...month, paid: true, paymentDate: new Date().toISOString() };
            }
            return month;
          });
          
          setSelectedBus(prev => ({
            ...prev,
            monthlyBreakdown: updatedBreakdown
          }));
        }
        
      } else {
        console.warn('⚠️ Failed to save payment record, but payment was successful');
        alert(`Payment processed successfully for ${paymentDetails.month} ${paymentDetails.year}!\n\nNote: Payment record may not be saved in the system.`);
      }
      
    } catch (error) {
      console.error('❌ Error saving payment record:', error);
      // Still show success message since payment was successful
      alert(`Payment processed successfully for ${paymentDetails.month} ${paymentDetails.year}!\n\nNote: Payment record may not be saved in the system.`);
    }
    
    // Close payment gateway
    setShowPaymentGateway(false);
    setPaymentDetails(null);
    
    // Refresh the bus income data to reflect the payment
    await fetchBusIncomes();
    
    // Also refresh the current bus details if viewing bus details
    if (selectedBus) {
      await fetchBusBookings(selectedBus.id);
    }
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error('❌ Payment failed:', error);
    alert(`Payment failed: ${error}`);
    setShowPaymentGateway(false);
    setPaymentDetails(null);
  };

  // Close payment gateway
  const handleClosePaymentGateway = () => {
    setShowPaymentGateway(false);
    setPaymentDetails(null);
  };

  const handleFilterChange = (filter) => {
    setFilterStatus(filter);
    setCurrentBookingPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentBookingPage(1); // Reset to first page when sort changes
  };

  // Pagination functions for bus income cards
  const handleNextPage = () => {
    const totalPages = Math.ceil(busIncomes.length / cardsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentPageCards = () => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return busIncomes.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(busIncomes.length / cardsPerPage);
  };

  // Pagination functions for routes
  const handleNextRoutePage = () => {
    const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);
    if (currentRoutePage < totalPages) {
      setCurrentRoutePage(currentRoutePage + 1);
    }
  };

  const handlePrevRoutePage = () => {
    if (currentRoutePage > 1) {
      setCurrentRoutePage(currentRoutePage - 1);
    }
  };

  const getCurrentRoutePageCards = () => {
    const startIndex = (currentRoutePage - 1) * routesPerPage;
    const endIndex = startIndex + routesPerPage;
    return filteredRoutes.slice(startIndex, endIndex);
  };

  const getTotalRoutePages = () => {
    return Math.ceil(filteredRoutes.length / routesPerPage);
  };

  // Pagination functions for booking cards
  const handleNextBookingPage = () => {
    const totalPages = Math.ceil(getProcessedBookings().length / bookingsPerPage);
    if (currentBookingPage < totalPages) {
      setCurrentBookingPage(currentBookingPage + 1);
    }
  };

  const handlePrevBookingPage = () => {
    if (currentBookingPage > 1) {
      setCurrentBookingPage(currentBookingPage - 1);
    }
  };

  const getCurrentBookingPageCards = () => {
    const startIndex = (currentBookingPage - 1) * bookingsPerPage;
    const endIndex = startIndex + bookingsPerPage;
    return getProcessedBookings().slice(startIndex, endIndex);
  };

  const getTotalBookingPages = () => {
    return Math.ceil(getProcessedBookings().length / bookingsPerPage);
  };

  // Process bookings data based on filters and sorting
  const getProcessedBookings = () => {
    let processed = [...busBookings];

    // Filter by status
    if (filterStatus !== 'all') {
      processed = processed.filter(booking => {
        const status = (booking.booking_status || booking.bookingStatus || booking.status || '').toUpperCase();
        return filterStatus === 'confirmed' ? status === 'CONFIRMED' : status === 'PENDING';
      });
    }

    // Sort bookings
    processed.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.booking_date || b.bookingDate) - new Date(a.booking_date || a.bookingDate);
        case 'date-asc':
          return new Date(a.booking_date || a.bookingDate) - new Date(b.booking_date || b.bookingDate);
        case 'amount-desc':
          return (b.total_price || b.totalPrice || 0) - (a.total_price || a.totalPrice || 0);
        case 'amount-asc':
          return (a.total_price || a.totalPrice || 0) - (b.total_price || b.totalPrice || 0);
        default:
          return 0;
      }
    });

    return processed;
  };

  const fetchBusBookings = async (busId) => {
    try {
      setIsLoadingBookings(true);
      console.log(`🔄 Fetching bookings for bus ID: ${busId}`);
      
      // Try multiple endpoints to get booking data
      const bookingEndpoints = [
        'http://localhost:8081/api/bookings',
        'http://localhost:8081/api/bookings/all',
        'http://localhost:8081/api/bookings/confirmed'
      ];
      
      let allBookings = [];
      
      for (const endpoint of bookingEndpoints) {
        try {
          console.log(`🔄 Trying bookings endpoint: ${endpoint}`);
          const response = await fetch(endpoint);
          console.log(`📊 Response status: ${response.status}`);
          
          if (response.ok) {
            const bookingsResult = await response.json();
            console.log('📋 Raw bookings response:', bookingsResult);
            
            // Handle different response formats
            if (Array.isArray(bookingsResult)) {
              allBookings = bookingsResult;
              console.log(`✅ Got ${allBookings.length} bookings from array format`);
              break;
            } else if (bookingsResult && bookingsResult.data && Array.isArray(bookingsResult.data)) {
              allBookings = bookingsResult.data;
              console.log(`✅ Got ${allBookings.length} bookings from data format`);
              break;
            } else if (bookingsResult && bookingsResult.success && bookingsResult.data && Array.isArray(bookingsResult.data)) {
              allBookings = bookingsResult.data;
              console.log(`✅ Got ${allBookings.length} bookings from success format`);
              break;
            }
          }
        } catch (error) {
          console.warn(`❌ Error fetching from ${endpoint}:`, error.message);
        }
      }
      
      if (allBookings.length === 0) {
        console.warn('⚠️ No bookings data available from any endpoint');
        // Add sample data for demonstration
        const sampleBookings = [
          {
            id: 1,
            bus_id: busId,
            passengerName: 'John Doe',
            passengerEmail: 'john.doe@example.com',
            passengerPhone: '0771234567',
            total_price: 1200,
            booking_date: '2025-01-15',
            booking_status: 'CONFIRMED',
            route: { routeName: 'Colombo-Kandy' }
          },
          {
            id: 2,
            bus_id: busId,
            passengerName: 'Sarah Wilson',
            passengerEmail: 'sarah.wilson@email.com',
            passengerPhone: '0779876543',
            total_price: 1500,
            booking_date: '2025-01-14',
            booking_status: 'CONFIRMED',
            route: { routeName: 'Kandy-Colombo' }
          },
          {
            id: 3,
            bus_id: busId,
            passengerName: 'Michael Brown',
            passengerEmail: 'michael.brown@example.com',
            passengerPhone: '0774567890',
            total_price: 1800,
            booking_date: '2025-01-13',
            booking_status: 'CONFIRMED',
            route: { routeName: 'Colombo-Galle' }
          },
          {
            id: 4,
            bus_id: busId,
            passengerName: 'Emma Davis',
            passengerEmail: 'emma.davis@email.com',
            passengerPhone: '0772345678',
            total_price: 2000,
            booking_date: '2025-01-12',
            booking_status: 'CONFIRMED',
            route: { routeName: 'Galle-Colombo' }
          },
          {
            id: 5,
            bus_id: busId,
            passengerName: 'David Miller',
            passengerEmail: 'david.miller@example.com',
            passengerPhone: '0773456789',
            total_price: 1600,
            booking_date: '2025-01-11',
            booking_status: 'CONFIRMED',
            route: { routeName: 'Colombo-Nuwara Eliya' }
          }
        ];
        console.log('📝 Using sample booking data for demonstration:', sampleBookings);
        setBusBookings(sampleBookings);
        return;
      }
      
      // Filter bookings for this specific bus
      const busBookingsData = allBookings.filter(booking => {
        const bookingBusId = Number(booking.bus_id || booking.busId);
        const status = (booking.booking_status || booking.bookingStatus || booking.status || '').toUpperCase();
        const isConfirmed = status === 'CONFIRMED';
        const matchesBus = bookingBusId === busId;
        
        console.log(`🔍 Booking ${booking.id}: bus_id=${bookingBusId}, target=${busId}, status=${status}, matches=${matchesBus && isConfirmed}`);
        
        return matchesBus && isConfirmed;
      });
      
      console.log(`✅ Found ${busBookingsData.length} confirmed bookings for bus ${busId}:`, busBookingsData);
      setBusBookings(busBookingsData);
      
    } catch (error) {
      console.error('❌ Error fetching bus bookings:', error);
      setBusBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Calculate monthly income for a specific bus
  const calculateMonthlyIncome = (busBookings, month, year) => {
    const targetDate = new Date(year, month - 1); // month is 1-based
    const nextMonth = new Date(year, month); // month is 1-based
    
    return busBookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date || booking.bookingDate);
      return bookingDate >= targetDate && bookingDate < nextMonth;
    }).reduce((sum, booking) => {
      return sum + parseFloat(booking.total_price || booking.totalPrice || 0);
    }, 0);
  };

  // Get current date for month display
  const getCurrentDate = () => {
    const today = new Date();
    return today.getDate();
  };

  // Get the last day of each month for display
  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // Get monthly income breakdown for a bus
  const getMonthlyIncomeBreakdown = (busBookings) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const monthlyData = [];
    
    // Get last 6 months data
    for (let i = 5; i >= 0; i--) {
      const month = currentMonth - i;
      const year = month <= 0 ? currentYear - 1 : currentYear;
      const actualMonth = month <= 0 ? month + 12 : month;
      
      const monthlyIncome = calculateMonthlyIncome(busBookings, actualMonth, year);
      const monthName = new Date(year, actualMonth - 1).toLocaleDateString('en-US', { month: 'short' });
      
      // Use a fixed date (25) for display consistency, or current date for current month
      const displayDay = (i === 0) ? getCurrentDate() : 25;
      
      monthlyData.push({
        month: monthName,
        income: monthlyIncome,
        year: year,
        monthNumber: actualMonth,
        day: displayDay
      });
    }
    
    return monthlyData;
  };

  const fetchBusIncomes = async () => {
    try {
      setIsLoadingBusData(true);
      console.log('🔄 Fetching real bus income data...');
      
      // Fetch approved buses
      const busesResponse = await fetch('http://localhost:8081/api/buses?status=APPROVED');
      if (!busesResponse.ok) {
        console.warn('⚠️ Failed to fetch buses');
        setBusIncomes([]);
        setIsLoadingBusData(false);
        return;
      }
      
      const busesData = await busesResponse.json();
      if (!busesData.success || !busesData.data) {
        console.warn('⚠️ No approved buses found');
        setBusIncomes([]);
        setIsLoadingBusData(false);
        return;
      }
      
      console.log('✅ Fetched approved buses:', busesData.data);
      
      // Fetch bookings data with multiple fallback attempts
      let bookingsData = [];
      let bookingsResponse = null;
      
      // Try multiple endpoints
      const bookingEndpoints = [
        'http://localhost:8081/api/bookings',
        'http://localhost:8081/api/bookings/all',
        'http://localhost:8081/api/bookings/confirmed'
      ];
      
      for (const endpoint of bookingEndpoints) {
        try {
          console.log(`🔄 Trying bookings endpoint: ${endpoint}`);
          bookingsResponse = await fetch(endpoint);
          console.log(`📊 Response status: ${bookingsResponse.status}`);
          
          if (bookingsResponse.ok) {
        const bookingsResult = await bookingsResponse.json();
            console.log('📋 Raw bookings response:', bookingsResult);
            
            // Handle different response formats
        if (Array.isArray(bookingsResult)) {
          bookingsData = bookingsResult;
              console.log(`✅ Got ${bookingsData.length} bookings from array format`);
              break;
        } else if (bookingsResult && bookingsResult.data && Array.isArray(bookingsResult.data)) {
          bookingsData = bookingsResult.data;
              console.log(`✅ Got ${bookingsData.length} bookings from data format`);
              break;
            } else if (bookingsResult && bookingsResult.success && bookingsResult.data && Array.isArray(bookingsResult.data)) {
              bookingsData = bookingsResult.data;
              console.log(`✅ Got ${bookingsData.length} bookings from success format`);
              break;
            } else {
              console.warn(`⚠️ Unexpected response format from ${endpoint}:`, bookingsResult);
            }
          } else {
            console.warn(`⚠️ Endpoint ${endpoint} returned status: ${bookingsResponse.status}`);
          }
        } catch (error) {
          console.warn(`❌ Error fetching from ${endpoint}:`, error.message);
        }
      }
      
      // If no bookings data from API, show empty state
      if (bookingsData.length === 0) {
        console.warn('⚠️ No bookings data available from API');
        bookingsData = [];
      }
      
      console.log('📋 Bookings data:', bookingsData);
      console.log('📋 First booking sample:', bookingsData[0]);
      
      // Normalize buses (support snake_case and camelCase from backend)
      const normalizedBuses = busesData.data.map(b => ({
        ...b,
        id: Number(b.id),
        bus_name: b.bus_name || b.busName,
        registration_number: b.registration_number || b.registrationNumber,
        owner_id: b.owner_id || b.ownerId,
        seating_capacity: b.seating_capacity || b.seatingCapacity || 50,
        ownerName: b.ownerName || `Owner ID: ${b.owner_id || b.ownerId}`
      }));

      // Calculate real income for each bus
      const busesWithIncome = normalizedBuses.map(bus => {
        // Filter bookings for this bus (CONFIRMED only)
        const busBookings = bookingsData.filter(booking => {
          const bookingBusId = Number(booking.bus_id || booking.busId);
          const status = (booking.booking_status || booking.bookingStatus || booking.status || '').toUpperCase();
          const isConfirmed = status === 'CONFIRMED';
          const matchesBus = bookingBusId === bus.id;
          
          console.log(`🔍 Booking ${booking.id}: bus_id=${bookingBusId}, target=${bus.id}, status=${status}, matches=${matchesBus && isConfirmed}`);
          
          return matchesBus && isConfirmed;
        });
        
        // Calculate total income
        const totalIncome = busBookings.reduce((sum, booking) => {
          const price = parseFloat(booking.total_price || booking.totalPrice || 0);
          console.log(`💰 Booking ${booking.id}: LKR ${price}`);
          return sum + price;
        }, 0);
        
        // Get last trip date
        const lastTrip = busBookings.length > 0 
          ? new Date(Math.max(...busBookings.map(b => new Date(b.booking_date || b.bookingDate).getTime()))).toLocaleDateString()
          : 'No trips yet';
        
        // Calculate monthly income breakdown
        const monthlyBreakdown = getMonthlyIncomeBreakdown(busBookings);
        
        // Calculate current month income
        const currentDate = new Date();
        const currentMonthIncome = calculateMonthlyIncome(busBookings, currentDate.getMonth() + 1, currentDate.getFullYear());
        
        // Calculate average per booking
        const averagePerBooking = busBookings.length > 0 ? totalIncome / busBookings.length : 0;
        
        // Calculate occupancy rate
        const totalPossibleSeats = busBookings.length; // This is simplified - in reality you'd need trip data
        const occupancyRate = bus.seating_capacity > 0 ? (busBookings.length / bus.seating_capacity) * 100 : 0;
        
        // Calculate revenue per seat
        const revenuePerSeat = bus.seating_capacity > 0 ? totalIncome / bus.seating_capacity : 0;
        
        console.log(`🚌 ${bus.bus_name}: ${busBookings.length} bookings, LKR ${totalIncome}, Last trip: ${lastTrip}`);
        
        return {
          ...bus,
          income: totalIncome,
          bookings: busBookings.length,
          lastTrip: lastTrip,
          monthlyBreakdown: monthlyBreakdown,
          currentMonthIncome: currentMonthIncome,
          averagePerBooking: averagePerBooking,
          occupancyRate: occupancyRate,
          revenuePerSeat: revenuePerSeat
        };
      });
      
      setBusIncomes(busesWithIncome);
      console.log('📊 Real bus income data calculated:', busesWithIncome);
      setIsLoadingBusData(false);
      
    } catch (error) {
      console.error('❌ Error fetching bus incomes:', error);
      setBusIncomes([]);
      setIsLoadingBusData(false);
    }
  };

  const testDatabaseConnection = async () => {
    try {
      console.log('🔍 Testing basic database connectivity...');
      
      // Test 1: Check if backend is running
      const healthCheck = await fetch('http://localhost:8081/api/buses');
      console.log('🏥 Backend health check:', healthCheck.status);
      
      if (healthCheck.ok) {
        const healthData = await healthCheck.json();
        console.log('📊 All buses response:', healthData);
        
        if (healthData.success && healthData.data) {
          console.log(`📈 Total buses in database: ${healthData.data.length}`);
          
          // Count buses by status
          const statusCounts = healthData.data.reduce((acc, bus) => {
            acc[bus.status] = (acc[bus.status] || 0) + 1;
            return acc;
          }, {});
          
          console.log('📊 Buses by status:', statusCounts);
        }
      }
      
      // Test 2: Test the specific pending endpoint
      console.log('🔍 Testing pending buses endpoint...');
      const pendingCheck = await fetch('http://localhost:8081/api/buses/status/PENDING');
      console.log('⏳ Pending buses endpoint status:', pendingCheck.status);
      
      if (pendingCheck.ok) {
        const pendingData = await pendingCheck.json();
        console.log('📋 Pending buses response:', pendingData);
        
        if (pendingData.success && pendingData.data) {
          console.log(`⏳ Found ${pendingData.data.length} pending buses`);
          console.log('🔍 Pending bus details:', pendingData.data);
        }
      }
      
      // Test 3: Test the dedicated pending endpoint
      console.log('🔍 Testing dedicated pending endpoint...');
      const dedicatedPendingCheck = await fetch('http://localhost:8081/api/buses/pending');
      console.log('⏳ Dedicated pending endpoint status:', dedicatedPendingCheck.status);
      
      if (dedicatedPendingCheck.ok) {
        const dedicatedPendingData = await dedicatedPendingCheck.json();
        console.log('📋 Dedicated pending response:', dedicatedPendingData);
        
        if (dedicatedPendingData.success && dedicatedPendingData.data) {
          console.log(`⏳ Found ${dedicatedPendingData.data.length} pending buses from dedicated endpoint`);
          console.log('🔍 Dedicated pending bus details:', dedicatedPendingData.data);
        }
      }
      
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
    }
  };

  const handleBusStatusChange = async (busId, newStatus) => {
    try {
      // Set loading state
      setLoading(true);
      
      // Find the bus before making the API call
      const busToUpdate = pendingBuses.find(bus => bus.id === busId);
      if (!busToUpdate) {
        alert('Bus not found in pending list. Please refresh the page.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8081/api/buses/${busId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove from pending buses
        setPendingBuses(prev => prev.filter(bus => bus.id !== busId));
        
        // If approved, add to approved buses
        if (newStatus === 'APPROVED') {
          const approvedBus = { ...busToUpdate, status: 'APPROVED' };
          setApprovedBuses(prev => [...prev, approvedBus]);
          
          // Update the stats to reflect the change
          setStats(prev => ({
            ...prev,
            totalBuses: prev.totalBuses + 1
          }));
        }
        
        // Show success message
        alert(`Bus "${busToUpdate.busName}" ${newStatus.toLowerCase()} successfully!`);
        
        // Refresh the data to ensure consistency
        setTimeout(() => {
          fetchPendingBuses();
          fetchApprovedBuses();
        }, 1000);
        
        // Also refresh the stats
        setTimeout(() => {
          fetchUsers();
        }, 1500);
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update bus status: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error updating bus status:', error);
      alert('Error updating bus status. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/routes');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform backend data to match frontend format
          const transformedRoutes = data.data.map(route => ({
            id: route.id,
            from: route.fromLocation,
            to: route.toLocation,
            departureTime: route.departureTime,
            arrivalTime: route.arrivalTime,
            price: route.ticketPrice,
            status: route.status,
            busAssignments: route.routeAssignments ? route.routeAssignments.map(assignment => ({
              id: assignment.id,
              busId: assignment.busId,
              busName: assignment.busName,
              busCapacity: assignment.busCapacity,
              departureDate: assignment.departureDate,
              departureTime: assignment.departureTime,
              assignedSeats: assignment.assignedSeats,
              status: assignment.status
            })) : []
          }));
          setRoutes(transformedRoutes);
          
          // Update active routes count
          const activeRoutesCount = transformedRoutes.filter(route => route.status === 'ACTIVE').length;
          setStats(prev => ({
            ...prev,
            activeRoutes: activeRoutesCount
          }));
        } else {
          console.error('Failed to fetch routes:', data.message);
          setRoutes([]);
          setStats(prev => ({
            ...prev,
            activeRoutes: 0
          }));
        }
      } else {
        console.error('Failed to fetch routes:', response.status);
        setRoutes([]);
        setStats(prev => ({
          ...prev,
          activeRoutes: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
      setStats(prev => ({
        ...prev,
        activeRoutes: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedBuses = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/buses?status=APPROVED');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApprovedBuses(data.data);
        } else {
          // Fallback to dummy data
          const dummyBuses = [
            {
              id: 1,
              busName: 'Express Deluxe',
              registrationNumber: 'ABC-1234',
              seatingCapacity: 45,
              ownerName: 'Nisal Amarasekara',
              status: 'APPROVED'
            },
            {
              id: 2,
              busName: 'Comfort Plus',
              registrationNumber: 'XYZ-5678',
              seatingCapacity: 50,
              ownerName: 'John Doe',
              status: 'APPROVED'
            },
            {
              id: 3,
              busName: 'Luxury Coach',
              registrationNumber: 'DEF-9012',
              seatingCapacity: 40,
              ownerName: 'Jane Smith',
              status: 'APPROVED'
            }
          ];
          setApprovedBuses(dummyBuses);
        }
      } else {
        // Fallback to dummy data
        const dummyBuses = [
          {
            id: 1,
            busName: 'Express Deluxe',
            registrationNumber: 'ABC-1234',
            seatingCapacity: 45,
            ownerName: 'Nisal Amarasekara',
            status: 'APPROVED'
          },
          {
            id: 2,
            busName: 'Comfort Plus',
            registrationNumber: 'XYZ-5678',
            seatingCapacity: 50,
            ownerName: 'John Doe',
            status: 'APPROVED'
          },
          {
            id: 3,
            busName: 'Luxury Coach',
            registrationNumber: 'DEF-9012',
            seatingCapacity: 40,
            ownerName: 'Jane Smith',
            status: 'APPROVED'
          }
        ];
        setApprovedBuses(dummyBuses);
      }
    } catch (error) {
      console.error('Error fetching approved buses:', error);
      // Fallback to dummy data
      const dummyBuses = [
        {
          id: 1,
          busName: 'Express Deluxe',
          registrationNumber: 'ABC-1234',
          seatingCapacity: 45,
          ownerName: 'Nisal Amarasekara',
          status: 'APPROVED'
        },
        {
          id: 2,
          busName: 'Comfort Plus',
          registrationNumber: 'XYZ-5678',
          seatingCapacity: 50,
          ownerName: 'John Doe',
          status: 'APPROVED'
        },
        {
          id: 3,
          busName: 'Luxury Coach',
          registrationNumber: 'DEF-9012',
          seatingCapacity: 40,
          ownerName: 'Jane Smith',
          status: 'APPROVED'
        }
      ];
      setApprovedBuses(dummyBuses);
    }
  };

  const fetchPendingBuses = async () => {
    try {
      console.log('🔄 Fetching pending buses from database...');
      
      // Try the status endpoint first
      let response = await fetch('http://localhost:8081/api/buses/status/PENDING');
      console.log('🔍 Status endpoint response:', response.status);
      
      // If status endpoint fails, try the dedicated pending endpoint
      if (!response.ok) {
        console.log('⚠️ Status endpoint failed, trying dedicated pending endpoint...');
        response = await fetch('http://localhost:8081/api/buses/pending');
        console.log('🔍 Dedicated pending endpoint response:', response.status);
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Database response:', data);
        if (data.success && data.data && Array.isArray(data.data)) {
          console.log(`✅ Found ${data.data.length} pending buses in database`);
          console.log('🔍 Raw database data:', data.data);
          
          // Transform database data to match frontend format
          const transformedBuses = data.data.map(bus => {
            console.log('🚌 Processing bus:', bus);
            return {
              id: bus.id,
              busName: bus.busName,
              registrationNumber: bus.registrationNumber,
              seatingCapacity: bus.seatingCapacity,
              ownerName: bus.ownerName || `Owner ID: ${bus.ownerId}`,
              status: bus.status,
              companyName: bus.busName.includes('(pvt) Ltd') ? bus.busName : 'N/A'
            };
          });
          
          console.log('🔄 Transformed buses:', transformedBuses);
          setPendingBuses(transformedBuses);
          
          // Update stats with real pending count
          setStats(prev => ({
            ...prev,
            pendingApprovals: transformedBuses.length
          }));
        } else {
          console.warn('⚠️ Database returned no pending buses or invalid data, using fallback');
          // Fallback to dummy data for testing
          const dummyPendingBuses = [
            {
              id: 4,
              busName: 'City Express',
              registrationNumber: 'GHI-3456',
              seatingCapacity: 35,
              ownerName: 'Vinuk Vidmin',
              status: 'PENDING',
              companyName: 'Control Union (pvt) Ltd'
            },
            {
              id: 5,
              busName: 'Metro Bus',
              registrationNumber: 'JKL-7890',
              seatingCapacity: 42,
              ownerName: 'Avishka Indumini',
              status: 'PENDING',
              companyName: 'Sooriyasamara (pvt) Ltd'
            },
            {
              id: 6,
              busName: 'Urban Transport',
              registrationNumber: 'MNO-1234',
              seatingCapacity: 38,
              ownerName: 'Demo User',
              status: 'PENDING',
              companyName: 'Demo Company'
            }
          ];
          setPendingBuses(dummyPendingBuses);
          
          // Update stats with fallback count
          setStats(prev => ({
            ...prev,
            pendingApprovals: dummyPendingBuses.length
          }));
        }
      } else {
        // Fallback to dummy data
        const dummyPendingBuses = [
          {
            id: 4,
            busName: 'City Express',
            registrationNumber: 'ABC-3456',
            seatingCapacity: 35,
            ownerName: 'Vinuk Vidmin',
            status: 'PENDING',
            companyName: 'Control Union (pvt) Ltd'
          },
          {
            id: 5,
            busName: 'Metro Bus',
            registrationNumber: 'XYZ-7890',
            seatingCapacity: 42,
            ownerName: 'Avishka Indumini',
            status: 'PENDING',
            companyName: 'Sooriyasamara (pvt) Ltd'
          },
          {
            id: 6,
            busName: 'Urban Transport',
            registrationNumber: 'DEF-1234',
            seatingCapacity: 38,
            ownerName: 'Demo User',
            status: 'PENDING',
            companyName: 'Demo Company'
          }
        ];
        setPendingBuses(dummyPendingBuses);
      }
    } catch (error) {
      console.error('Error fetching pending buses:', error);
      // Fallback to dummy data
      const dummyPendingBuses = [
        {
          id: 4,
          busName: 'City Express',
          registrationNumber: 'GHI-3456',
          seatingCapacity: 35,
          ownerName: 'Vinuk Vidmin',
          status: 'PENDING',
          companyName: 'Control Union (pvt) Ltd'
        },
        {
          id: 5,
          busName: 'Metro Bus',
          registrationNumber: 'JKL-7890',
          seatingCapacity: 42,
          ownerName: 'Avishka Indumini',
          status: 'PENDING',
          companyName: 'Sooriyasamara (pvt) Ltd'
        },
        {
          id: 6,
          busName: 'Urban Transport',
          registrationNumber: 'MNO-1234',
          seatingCapacity: 38,
          ownerName: 'Demo User',
          status: 'PENDING',
          companyName: 'Demo Company'
        }
      ];
      setPendingBuses(dummyPendingBuses);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/users');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update total users count and breakdown
          const totalUsersCount = data.totalCount || data.data.length;
          const passengerCount = data.passengerCount || 0;
          const ownerCount = data.ownerCount || 0;
          
          setStats(prev => ({
            ...prev,
            totalUsers: totalUsersCount,
            passengerCount: passengerCount,
            ownerCount: ownerCount
          }));
          console.log('✅ Total users fetched:', totalUsersCount);
          console.log('✅ Passengers:', passengerCount);
          console.log('✅ Bus Owners:', ownerCount);
        } else {
          console.error('Failed to fetch users:', data.message);
          // Keep default count
        }
      } else {
        console.error('Failed to fetch users:', response.status);
        // Keep default count
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Keep default count
    }
  };

  // Update stats when routes change
  useEffect(() => {
    const activeRoutesCount = routes.filter(route => route.status === 'ACTIVE').length;
    setStats(prev => ({
      ...prev,
      activeRoutes: activeRoutesCount
    }));
  }, [routes]);

  // Update stats when users change
  useEffect(() => {
    // This will be updated when fetchUsers is called
  }, []);

  // Fetch initial routes data when component loads
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchRoutes();
      await fetchUsers();
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({
      ...prev,
      [name]: value
    }));

    // If bus is selected, update assigned seats
    if (name === 'busId') {
      const selectedBus = approvedBuses.find(bus => bus.id === parseInt(value));
      if (selectedBus) {
        setAssignmentData(prev => ({
          ...prev,
          assignedSeats: selectedBus.seatingCapacity
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.from.trim() || !formData.to.trim()) {
      alert('Please fill in both From and To fields');
      return;
    }

    try {
      const routeData = {
        fromLocation: formData.from,
        toLocation: formData.to,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        ticketPrice: parseFloat(formData.price),
        status: formData.status,
        description: ''
      };

      if (editingRoute) {
        // Update existing route
        const response = await fetch(`http://localhost:8081/api/routes/${editingRoute.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routeData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await fetchRoutes();
            setEditingRoute(null);
            setShowAddModal(false);
            resetForm();
            alert('Route updated successfully!');
          } else {
            alert('Failed to update route: ' + data.message);
          }
        } else {
          alert('Failed to update route');
        }
      } else {
        // Add new route
        const response = await fetch('http://localhost:8081/api/routes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routeData)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await fetchRoutes();
            setShowAddModal(false);
            resetForm();
            alert('Route created successfully!');
          } else {
            alert('Failed to create route: ' + data.message);
          }
        } else {
          alert('Failed to create route');
        }
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Failed to save route');
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignmentData.busId || !assignmentData.departureDate || !assignmentData.departureTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const assignmentDataToSend = {
        routeId: selectedRoute.id,
        busId: parseInt(assignmentData.busId),
        departureDate: assignmentData.departureDate,
        departureTime: assignmentData.departureTime,
        assignedSeats: assignmentData.assignedSeats
      };

      const response = await fetch(`http://localhost:8081/api/routes/${selectedRoute.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentDataToSend)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchRoutes();
          setShowAssignmentModal(false);
          resetAssignmentForm();
          alert('Bus assigned successfully!');
        } else {
          alert('Failed to assign bus: ' + data.message);
        }
      } else {
        alert('Failed to assign bus to route');
      }
    } catch (error) {
      console.error('Error assigning bus:', error);
      alert('Failed to assign bus');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      from: route.from,
      to: route.to,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      price: route.price,
      status: route.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        const response = await fetch(`http://localhost:8081/api/routes/${routeId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            await fetchRoutes();
            alert('Route deleted successfully!');
          } else {
            alert('Failed to delete route: ' + data.message);
          }
        } else {
          alert('Failed to delete route');
        }
      } catch (error) {
        console.error('Error deleting route:', error);
        alert('Failed to delete route');
      }
    }
  };

  const handleAssignBus = (route) => {
    setSelectedRoute(route);
    setShowAssignmentModal(true);
  };

  const resetForm = () => {
    setFormData({
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      status: 'ACTIVE'
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentData({
      busId: '',
      departureDate: '',
      departureTime: '',
      assignedSeats: 0
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRoute(null);
    resetForm();
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedRoute(null);
    resetAssignmentForm();
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset routes pagination when search or filter changes
  useEffect(() => {
    setCurrentRoutePage(1);
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-red-600 bg-red-100';
      case 'MAINTENANCE': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailableBuses = (departureDate, departureTime) => {
    // Get all bus IDs that are already assigned to any route
    const assignedBusIds = routes.flatMap(route => 
      route.busAssignments.map(assignment => assignment.busId)
    );
    
    // Filter out buses that are already assigned to any route
    return approvedBuses.filter(bus => !assignedBusIds.includes(bus.id));
  };

  return (
    <div className="admin-dashboard-container">
      <Navbar onLogout={onLogout} />
      
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${nightSeatsImage})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Admin Dashboard</h1>
            <p className="hero-subtitle">
              Manage your transportation system with powerful tools and insights
            </p>
            
            {/* Hero Stats */}
            <div className="hero-stats">
              <div className="stat-item primary-stat">
                <h3>{stats.totalBuses}</h3>
                <p>Total Buses</p>
              </div>
              <div className="stat-item success-stat">
                <h3>{stats.activeRoutes}</h3>
                <p>Active Routes</p>
              </div>
              <div className="stat-item info-stat">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
              <div className={`stat-item route-item ${showApproveBus ? 'active' : ''}`} onClick={handleApproveBusClick}>
                <h3>{showApproveBus ? '✕' : <CheckCircle size={40} />}</h3>
                <p>{showApproveBus ? 'Close Approve' : 'Approve Bus'}</p>
              </div>
              <div className={`stat-item route-item ${showRoutes ? 'active' : ''}`} onClick={handleViewRoutesClick}>
                <h3>{showRoutes ? '✕' : <Route size={40} />}</h3>
                <p>{showRoutes ? 'Close Routes' : 'Manage Routes'}</p>
              </div>
              <div className={`stat-item payment-item ${showViewPayment ? 'active' : ''}`} onClick={handleViewPaymentClick}>
                <h3>{showViewPayment ? '✕' : <CreditCard size={40} />}</h3>
                <p>{showViewPayment ? 'Close Payment' : 'View Payment'}</p>
              </div>
              <div className={`stat-item tour-item ${showTourManagement ? 'active' : ''}`} onClick={handleTourManagementClick}>
                <h3>{showTourManagement ? '✕' : <MapPin size={40} />}</h3>
                <p>{showTourManagement ? 'Close Tours' : 'Tour Management'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Breakdown Section */}
      <div className="user-breakdown-section">
        <div className="section-header">
          <h2>User Statistics</h2>
          <p>Detailed breakdown of registered users</p>
        </div>
        
        <div className="user-breakdown-grid">
          <div className="user-breakdown-card passenger-card">
            <div className="card-icon">
              <Users size={48} className="user-icon" />
            </div>
            <div className="card-content">
              <h3>{stats.passengerCount}</h3>
              <p>Passengers</p>
              <div className="percentage">
                {stats.totalUsers > 0 ? Math.round((stats.passengerCount / stats.totalUsers) * 100) : 0}%
              </div>
            </div>
          </div>
          
          <div className="user-breakdown-card owner-card">
            <div className="card-icon">
              <Bus size={48} className="user-icon" />
            </div>
            <div className="card-content">
              <h3>{stats.ownerCount}</h3>
              <p>Bus Owners</p>
              <div className="percentage">
                {stats.totalUsers > 0 ? Math.round((stats.ownerCount / stats.totalUsers) * 100) : 0}%
              </div>
            </div>
          </div>
          
          <div className="user-breakdown-card total-card">
            <div className="card-icon">
              <BarChart3 size={48} className="user-icon" />
            </div>
            <div className="card-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
              <div className="percentage">100%</div>
            </div>
          </div>
        </div>
        
        {/* User Distribution Chart */}
        <div className="user-chart-section">
          <h3>User Distribution</h3>
          <div className="chart-container">
            <div className="chart-bar">
              <div className="bar-label">Passengers</div>
              <div className="bar-track">
                <div 
                  className="bar-fill passenger-fill" 
                  style={{ 
                    width: `${stats.totalUsers > 0 ? (stats.passengerCount / stats.totalUsers) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="bar-value">{stats.passengerCount}</div>
            </div>
            
            <div className="chart-bar">
              <div className="bar-label">Bus Owners</div>
              <div className="bar-track">
                <div 
                  className="bar-fill owner-fill" 
                  style={{ 
                    width: `${stats.totalUsers > 0 ? (stats.ownerCount / stats.totalUsers) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="bar-value">{stats.ownerCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Bus Section */}
      {showApproveBus && (
        <div className="approve-bus-section">
          <AdminApprove onLogout={onLogout} onClose={handleCloseApproveBus} />
        </div>
      )}

      {/* View Payment Section */}
      {showViewPayment && (
        <div className="view-payment-section">
          <div className="payment-header">
            <div className="header-icon">
              <CreditCard size={40} />
            </div>
            <h1>Payment Management</h1>
            <button className="close-button" onClick={handleCloseViewPayment}>
              <X size={24} />
            </button>
          </div>
          
          <div className="payment-content">
            <div className="payment-stats">
              <div className="payment-stat-card">
                <div className="stat-icon">
                  <CreditCard size={32} />
                </div>
                <div className="stat-info">
                  <h3>Total Transactions</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>
              
              <div className="payment-stat-card">
                <div className="stat-icon">
                  <CheckCircle size={32} />
                </div>
                <div className="stat-info">
                  <h3>Successful Payments</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>
              
              <div className="payment-stat-card">
                <div className="stat-icon">
                  <X size={32} />
                </div>
                <div className="stat-info">
                  <h3>Failed Payments</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>
            </div>
            
            {/* Bus Income Section */}
            <div className="bus-income-section">
              <div className="section-header">
                <div>
                  <h3>Bus Income Analysis</h3>
                  <p>Revenue generated by each approved bus</p>
                </div>
                <button 
                  className="btn-refresh" 
                  onClick={fetchBusIncomes}
                  disabled={isLoadingBusData}
                >
                  {isLoadingBusData ? 'Loading...' : 'Refresh Data'}
                </button>
              </div>
              
              <div className="bus-income-grid">
                {isLoadingBusData ? (
                  <div className="loading-message">
                    <div className="loading-spinner"></div>
                    <p>Loading bus income data...</p>
                  </div>
                ) : busIncomes.length > 0 ? (
                  <>
                    {getCurrentPageCards().map((bus) => (
                      <div key={bus.id} className="bus-income-card" onClick={() => handleBusCardClick(bus)}>
                        <div className="bus-info">
                          <div className="bus-icon">
                            <Bus size={24} />
                          </div>
                          <div className="bus-details">
                            <h4>{bus.bus_name}</h4>
                            <p>{bus.registration_number}</p>
                            <small>Owner: {bus.ownerName || `Owner ID: ${bus.owner_id}`}</small>
                            <small>Capacity: {bus.seating_capacity || 50} seats</small>
                          </div>
                        </div>
                        <div className="income-details">
                          <div className="income-amount">
                            <span className="currency">LKR</span>
                            <span className="amount">{bus.income.toLocaleString()}</span>
                          </div>
                          <div className="income-label">Total Income</div>
                          <div className="income-stats">
                            <div className="stat-row">
                              <small>{bus.bookings} bookings</small>
                              <small>Avg: LKR {bus.averagePerBooking?.toLocaleString() || '0'}</small>
                            </div>
                            <div className="stat-row">
                              <small>This Month: LKR {bus.currentMonthIncome?.toLocaleString() || '0'}</small>
                            </div>
                            <div className="performance-bar">
                              <div className="bar-label">Occupancy</div>
                              <div className="bar-track">
                                <div 
                                  className="bar-fill" 
                                  style={{ width: `${Math.min(100, bus.occupancyRate || 0)}%` }}
                                ></div>
                              </div>
                              <span className="bar-percentage">{bus.occupancyRate?.toFixed(1) || '0'}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Pagination Controls */}
                    {busIncomes.length > cardsPerPage && (
                      <div className="pagination-controls">
                        <div className="pagination-info">
                          <span>Page {currentPage} of {getTotalPages()}</span>
                          <span>({busIncomes.length} total buses)</span>
                        </div>
                        <div className="pagination-buttons">
                          <button 
                            className="pagination-btn prev-btn" 
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                          >
                            ← Previous
                          </button>
                          <button 
                            className="pagination-btn next-btn" 
                            onClick={handleNextPage}
                            disabled={currentPage === getTotalPages()}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-buses-message">
                    <Bus size={48} className="empty-icon" />
                    <h4>No Approved Buses</h4>
                    <p>No approved buses available for income tracking.</p>
                  </div>
                )}
              </div>
              
              {/* Income Summary */}
              {busIncomes.length > 0 && (
                <div className="income-summary">
                  <div className="summary-card">
                    <h4>Total Revenue</h4>
                    <div className="summary-amount">
                      <span className="currency">LKR</span>
                      <span className="amount">
                        {busIncomes.reduce((sum, bus) => sum + bus.income, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <h4>Total Bookings</h4>
                    <div className="summary-amount">
                      <span className="amount">
                        {busIncomes.reduce((sum, bus) => sum + bus.bookings, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <h4>Average per Bus</h4>
                    <div className="summary-amount">
                      <span className="currency">LKR</span>
                      <span className="amount">
                        {Math.round(busIncomes.reduce((sum, bus) => sum + bus.income, 0) / busIncomes.length).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <h4>Top Performer</h4>
                    <div className="top-bus">
                      {(() => {
                        const topBus = busIncomes.reduce((max, bus) => bus.income > max.income ? bus : max, busIncomes[0]);
                        return (
                          <div>
                            <div className="top-bus-name">{topBus.bus_name}</div>
                            <div className="top-bus-income">LKR {topBus.income.toLocaleString()}</div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
                </div>
              </div>
      )}

      {/* Bus Details Section */}
      {showBusDetails && selectedBus && (
        <div className="bus-details-section">
          <div className="bus-details-header">
            <div className="header-icon">
              <Bus size={40} />
            </div>
            <h1>Bus Details - {selectedBus.bus_name}</h1>
            <p>Detailed information and booking data for this bus</p>
            <button className="close-button" onClick={handleCloseBusDetails}>
              <X size={24} />
                </button>
              </div>
              
          <div className="bus-details-content">
            {/* Bus Information Card */}
            <div className="bus-info-card">
              <div className="card-header">
                <h3>Bus Information</h3>
              </div>
              <div className="card-content">
                {/* Basic Details Section */}
                <div className="info-section">
                  <h4>Basic Details</h4>
                  <div className="info-row">
                    <span className="label">Bus Name:</span>
                    <span className="value">{selectedBus.bus_name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Registration Number:</span>
                    <span className="value">{selectedBus.registration_number}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Owner:</span>
                    <span className="value">{selectedBus.ownerName || `Owner ID: ${selectedBus.owner_id}`}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Seating Capacity:</span>
                    <span className="value">{selectedBus.seating_capacity || 50} seats</span>
                  </div>
                </div>

                {/* Financial Summary Section */}
                <div className="info-section">
                  <h4>Financial Summary</h4>
                  <div className="info-row">
                    <span className="label">Total Income:</span>
                    <span className="value income">LKR {selectedBus.income.toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Current Month:</span>
                    <span className="value income">LKR {selectedBus.currentMonthIncome?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total Bookings:</span>
                    <span className="value">{selectedBus.bookings}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Average per Booking:</span>
                    <span className="value">LKR {selectedBus.averagePerBooking?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Last Trip:</span>
                    <span className="value">{selectedBus.lastTrip}</span>
                  </div>
                </div>

                {/* Performance Metrics Section */}
                <div className="info-section">
                  <h4>Performance Metrics</h4>
                  <div className="info-row">
                    <span className="label">Occupancy Rate:</span>
                    <span className="value">{selectedBus.occupancyRate?.toFixed(1) || '0'}%</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Revenue per Seat:</span>
                    <span className="value">LKR {selectedBus.revenuePerSeat?.toLocaleString() || '0'}</span>
                  </div>
                </div>

                {/* Monthly Income Chart */}
                {selectedBus.monthlyBreakdown && selectedBus.monthlyBreakdown.length > 0 && (
                  <div className="info-section">
                    <h4>Monthly Income Trend (Last 6 Months)</h4>
                    <div className="monthly-income-list">
                      {selectedBus.monthlyBreakdown.map((month, index) => (
                        <div key={index} className="monthly-income-item">
                          <div className="month-info">
                            <span className="month-name">{month.month} {month.day}</span>
                            <span className="month-date">{month.day}</span>
                            {month.paid && (
                              <span className="paid-badge">✓ Paid</span>
                            )}
                          </div>
                          <div className="income-amount">
                            <span className="currency">LKR</span>
                            <span className="amount">{month.income.toLocaleString()}</span>
                          </div>
                          <div className="monthly-payment-actions">
                            {month.paid ? (
                              <div className="payment-status">
                                <span className="paid-status">✓ Payment Completed</span>
                                <small className="payment-date">
                                  Paid on {new Date(month.paymentDate).toLocaleDateString()}
                                </small>
                              </div>
                            ) : (
                              <button 
                                className="make-payment-btn"
                                onClick={() => handleMakePayment(month.month, month.year, selectedBus.id)}
                                title={`Process payment for ${month.month} ${month.year}`}
                              >
                                <CreditCard size={16} />
                                Make Payment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
                
            {/* Booking Data Table */}
            {isLoadingBookings ? (
              <div className="loading-bookings">
                <div className="loading-spinner"></div>
                <span>Loading booking data...</span>
                  </div>
            ) : busBookings.length > 0 ? (
              <div className="all-bookings">
                <div className="bookings-header">
                  <div className="header-left">
                    <h3>All Bookings Data</h3>
                    <p>Complete booking history for this bus</p>
                </div>
                  <div className="booking-stats">
                    <span className="booking-count">{busBookings.length} total bookings</span>
                    <span className="total-income">
                      LKR {busBookings.reduce((sum, booking) => sum + parseFloat(booking.total_price || booking.totalPrice || 0), 0).toLocaleString()}
                    </span>
              </div>
            </div>
                
                {/* Filter Options */}
                <div className="view-options">
                  <div className="filter-controls">
                    <select 
                      className="filter-select" 
                      value={filterStatus} 
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      <option value="all">All Bookings</option>
                      <option value="confirmed">Confirmed Only</option>
                      <option value="pending">Pending</option>
                    </select>
                    <select 
                      className="filter-select" 
                      value={sortBy} 
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="date-desc">Latest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="amount-desc">Highest Amount</option>
                      <option value="amount-asc">Lowest Amount</option>
                    </select>
                  </div>
                </div>
              
                {/* Card View */}
                <div className="bookings-cards">
                  <div className="cards-grid">
                    {getCurrentBookingPageCards().length > 0 ? (
                      getCurrentBookingPageCards().map((booking, index) => {
                        const bookingId = booking.id || booking.bookingId || `#${index + 1}`;
                        const passengerName = booking.passengerName || booking.passenger_name || booking.user?.name || 'N/A';
                        const passengerEmail = booking.passengerEmail || booking.passenger_email || booking.user?.email || 'N/A';
                        const passengerPhone = booking.passengerPhone || booking.passenger_phone || booking.user?.phone || 'N/A';
                        const totalPrice = parseFloat(booking.total_price || booking.totalPrice || 0);
                        const bookingDate = new Date(booking.booking_date || booking.bookingDate);
                        const routeName = booking.route?.routeName || booking.route_name || booking.route?.name || 'N/A';
                        
                        return (
                          <div key={booking.id || booking.bookingId || index} className="booking-card">
                            <div className="card-header">
                              <div className="booking-id-badge">#{bookingId}</div>
                              <div className="status-badge confirmed">Confirmed</div>
                            </div>
                            <div className="card-content">
                              <div className="passenger-info">
                                <User size={20} />
                                <div>
                                  <h4>{passengerName}</h4>
                                  <p>{passengerEmail}</p>
                                  <p>{passengerPhone}</p>
                                </div>
                              </div>
                              <div className="booking-details">
                                <div className="amount">
                                  <span className="currency">LKR</span>
                                  <span className="value">{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="date">
                                  {bookingDate.toLocaleDateString()}
                                </div>
                                <div className="route">
                                  {routeName}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-bookings-card">
                        <div className="no-bookings-icon">📋</div>
                        <h4>No booking data found</h4>
                        <p>This bus has no confirmed bookings yet.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Booking Pagination Controls */}
                  {getProcessedBookings().length > bookingsPerPage && (
                    <div className="pagination-controls">
                      <div className="pagination-info">
                        <span>Page {currentBookingPage} of {getTotalBookingPages()}</span>
                        <span>({getProcessedBookings().length} total bookings)</span>
                      </div>
                      <div className="pagination-buttons">
                        <button 
                          className="pagination-btn prev-btn" 
                          onClick={handlePrevBookingPage}
                          disabled={currentBookingPage === 1}
                        >
                          ← Previous
                        </button>
                        <button 
                          className="pagination-btn next-btn" 
                          onClick={handleNextBookingPage}
                          disabled={currentBookingPage === getTotalBookingPages()}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-bookings">
                <div className="no-bookings-icon">📋</div>
                <h4>No booking data found</h4>
                <p>This bus has no confirmed bookings yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tour Management Section */}
      {showTourManagement && (
        <div className="tour-management-section">
          <div className="routes-header">
            <div className="header-icon">
              <MapPin size={40} />
            </div>
            <h1>Tour Management</h1>
            <p>Manage tour packages and routes</p>
            <button className="close-button" onClick={handleCloseTourManagement}>
              <X size={24} />
            </button>
          </div>
          <div className="tour-management-content">
            <AdminTourManagement />
          </div>
        </div>
      )}


      {/* Routes Section */}
      {showRoutes && (
        <div className="routes-section">
          <div className="routes-header">
            <div className="header-icon">
              <Route size={40} />
            </div>
            <h1>Route Management</h1>
            <p>Manage bus routes and assignments</p>
            <button className="close-button" onClick={handleCloseRoutes}>
              <X size={24} />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search routes by From or To..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Status:</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Route Button */}
          <div className="add-route-section">
            <button 
              className="btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Add New Route
            </button>
          </div>

          {/* Routes Grid */}
          <div className="routes-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading routes...</p>
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="empty-state">
                <Route size={64} className="empty-icon" />
                <h3>No Routes Found</h3>
                <p>No routes match your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="routes-grid">
                  {getCurrentRoutePageCards().map((route) => (
                    <div key={route.id} className="route-card">
                      <div className="route-header">
                        <div className="route-icon">
                          <Route size={24} />
                        </div>
                        <div className="route-info">
                          <h3>{route.from} → {route.to}</h3>
                          <p className="route-time">
                            {route.departureTime} - {route.arrivalTime}
                          </p>
                        </div>
                        <div className={`status-badge ${getStatusColor(route.status)}`}>
                          <span>{route.status}</span>
                        </div>
                      </div>
                      
                      <div className="route-details">
                        <div className="detail-item">
                          <Bus size={16} />
                          <span><strong>Buses:</strong> {route.busAssignments.length}</span>
                        </div>
                        <div className="detail-item">
                          <span className="price">LKR {route.price}</span>
                        </div>
                      </div>

                      {/* Bus Assignments */}
                      {route.busAssignments.length > 0 && (
                        <div className="bus-assignments">
                          <h4>Assigned Buses:</h4>
                          {route.busAssignments.map((assignment) => (
                            <div key={assignment.id} className="assignment-item">
                              <div className="assignment-info">
                                <span className="bus-name">{assignment.busName}</span>
                                <span className="assignment-date">
                                  {new Date(assignment.departureDate).toLocaleDateString()} at {assignment.departureTime}
                                </span>
                                <span className="seats-info">
                                  {assignment.assignedSeats}/{assignment.busCapacity} seats
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="route-actions">
                        <button
                          className="btn-assign"
                          onClick={() => handleAssignBus(route)}
                        >
                          <Bus size={16} />
                          Assign Bus
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(route)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(route.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Routes Pagination Controls */}
                {filteredRoutes.length > routesPerPage && (
                  <div className="pagination-controls">
                    <div className="pagination-info">
                      <span>Page {currentRoutePage} of {getTotalRoutePages()}</span>
                      <span>({filteredRoutes.length} total routes)</span>
                    </div>
                    <div className="pagination-buttons">
                      <button 
                        className="pagination-btn prev-btn" 
                        onClick={handlePrevRoutePage}
                        disabled={currentRoutePage === 1}
                      >
                        ← Previous
                      </button>
                      <button 
                        className="pagination-btn next-btn" 
                        onClick={handleNextRoutePage}
                        disabled={currentRoutePage === getTotalRoutePages()}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Route Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRoute ? 'Edit Route' : 'Add New Route'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="from">From *</label>
                  <input
                    type="text"
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    placeholder="Enter departure city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="to">To *</label>
                  <input
                    type="text"
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="Enter destination city"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureTime">Departure Time</label>
                  <input
                    type="time"
                    id="departureTime"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="arrivalTime">Arrival Time</label>
                  <input
                    type="time"
                    id="arrivalTime"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Ticket Price (LKR)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="1200"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </form>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleSubmit}
              >
                {editingRoute ? 'Update Route' : 'Add Route'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bus Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assign Bus to Route</h3>
              <button className="modal-close" onClick={closeAssignmentModal}>×</button>
            </div>
            <form onSubmit={handleAssignmentSubmit} className="modal-body">
              <div className="assignment-info">
                <h4>{selectedRoute?.from} → {selectedRoute?.to}</h4>
                <p>Route Time: {selectedRoute?.departureTime} - {selectedRoute?.arrivalTime}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="busId">Select Bus *</label>
                <select
                  id="busId"
                  name="busId"
                  value={assignmentData.busId}
                  onChange={handleAssignmentChange}
                  required
                >
                  <option value="">Choose a bus...</option>
                  {getAvailableBuses(assignmentData.departureDate, assignmentData.departureTime).map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.busName} ({bus.registrationNumber}) - {bus.seatingCapacity} seats
                    </option>
                  ))}
                </select>
                {assignmentData.busId && (
                  <div className="bus-details">
                    <p><strong>Owner:</strong> {approvedBuses.find(b => b.id === parseInt(assignmentData.busId))?.ownerName}</p>
                    <p><strong>Capacity:</strong> {assignmentData.assignedSeats} seats</p>
                  </div>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureDate">Departure Date *</label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={assignmentData.departureDate}
                    onChange={handleAssignmentChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departureTime">Departure Time *</label>
                  <input
                    type="time"
                    id="departureTime"
                    name="departureTime"
                    value={assignmentData.departureTime}
                    onChange={handleAssignmentChange}
                    required
                  />
                </div>
              </div>
            </form>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={closeAssignmentModal}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAssignmentSubmit}
                disabled={!assignmentData.busId || !assignmentData.departureDate || !assignmentData.departureTime}
              >
                Assign Bus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentGateway && paymentDetails && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={handleClosePaymentGateway}
          bookingDetails={paymentDetails}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import PassengerHome from './pages/PassengerHome';
import SeatBooking from './pages/SeatBooking';
import BusownerHome from './Busowner/BusownerHome';
import NewbusFrom from './Busowner/NewbusFrom';
import BusData from './Busowner/busdata';
import AdminDashboard from './Admin/AdminDashboard';
import AdminApprove from './Admin/adminapprove';
import AdminRoutes from './Admin/AdminRoutes';
import TourHome from './Tours/TourHome';
import PaymentDemo from './pages/PaymentDemo';
import PaymentPage from './pages/PaymentPage';
import MyBookings from './pages/MyBookings';
import './App.css';
import './dashboard.css';
import Navbar from "./components/Navbar";
import { HeroSection } from "./pages/HeroSection";
import { SeasonalPicks } from "./pages/SeasonalPicks";
import { AppPromotion } from "./pages/AppPromotion";
import { ExclusiveJourneys } from "./pages/ExclusiveJourneys";
import { Footer } from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // Check if user data exists in localStorage on app initialization
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        const user = JSON.parse(userData);
        return user && user.isAuthenticated === true;
      } catch (error) {
        console.error('Error parsing user data on app init:', error);
        localStorage.removeItem('user');
        return false;
      }
    }
    return false;
  });

  const [userType, setUserType] = React.useState(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'null' && userData !== 'undefined') {
      try {
        const user = JSON.parse(userData);
        return user?.userType || null;
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const handleLogin = (userData) => {
    // Store user data in localStorage or context
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUserType(userData.userType);
  };

  const handleLogout = () => {
    console.log('Logout initiated...');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserType(null);
    console.log('Logout completed. Redirecting to login...');
  };

  // Function to render appropriate dashboard based on user type
  const renderDashboard = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Route users based on their type
    if (userType === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userType === 'PASSENGER') {
      return <PassengerHome onLogout={handleLogout} />;
    } else if (userType === 'OWNER') {
      return <BusownerHome onLogout={handleLogout} />;
    } else {
      return <Dashboard onLogout={handleLogout} />;
    }
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <SignupPage onSignup={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={renderDashboard()}
          />
          <Route 
            path="/busowner/add-bus" 
            element={
              isAuthenticated && userType === 'OWNER' ? 
              <NewbusFrom onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          />
          <Route 
            path="/busowner/bus-data" 
            element={
              isAuthenticated && userType === 'OWNER' ? 
              <BusData onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              isAuthenticated && userType === 'ADMIN' ? 
              <AdminDashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          />
          <Route 
            path="/admin/approve" 
            element={
              isAuthenticated && userType === 'ADMIN' ? 
              <AdminApprove onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          />
          <Route 
            path="/admin/routes" 
            element={
              isAuthenticated && userType === 'ADMIN' ? 
              <AdminRoutes onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          />
          
          {/* Passenger Routes */}
          <Route 
            path="/seat-booking" 
            element={
              isAuthenticated && userType === 'PASSENGER' ? 
              <SeatBooking /> : 
              <Navigate to="/login" replace />
            }
          />
          
          {/* Tour Routes */}
          <Route 
            path="/package-booking" 
            element={
              isAuthenticated && userType === 'PASSENGER' ? 
              <TourHome onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          />
          
          {/* Payment Demo Route */}
          <Route 
            path="/payment-demo" 
            element={<PaymentDemo />}
          />
          
          {/* Payment Page Route */}
          <Route 
            path="/payment" 
            element={<PaymentPage />}
          />
          
          {/* My Bookings Route */}
          <Route 
            path="/my-bookings" 
            element={
              isAuthenticated && userType === 'PASSENGER' ? 
              <MyBookings /> : 
              <Navigate to="/login" replace />
            }
          />
          
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

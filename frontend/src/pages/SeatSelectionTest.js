import React, { useState } from 'react';
import SeatSelector from '../components/SeatSelector';
import SeatManager from '../components/SeatManager';
import './SeatSelectionTest.css';

const SeatSelectionTest = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        // Remove seat if already selected
        return prev.filter(seat => seat !== seatNumber);
      } else {
        // Add seat if not selected
        return [...prev, seatNumber];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      const bookingData = {
        userId: 1,
        routeId: 1,
        busId: 1,
        passengerName: "Test User",
        passengerEmail: "test@email.com",
        passengerPhone: "+94771234567",
        numberOfSeats: selectedSeats.length,
        selectedSeats: JSON.stringify(selectedSeats),
        totalPrice: selectedSeats.length * 1800
      };

      const response = await fetch('http://localhost:8081/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        alert(`Booking successful! Booking ID: ${booking.id}`);
        setSelectedSeats([]);
        setShowBooking(false);
        // The seat selector will automatically refresh and show updated occupancy
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const handleSeatsCleared = () => {
    // Force refresh of the seat selector
    setRefreshKey(prev => prev + 1);
    setSelectedSeats([]);
  };

  return (
    <div className="seat-selection-test">
      <div className="test-header">
        <h1>Seat Selection Test</h1>
        <p>This page demonstrates real-time seat occupancy that persists across page refreshes.</p>
      </div>

      <div className="test-content">
        <SeatManager
          busId={1}
          routeId={1}
          onSeatsCleared={handleSeatsCleared}
        />
        
        <SeatSelector
          key={refreshKey}
          busId={1}
          routeId={1}
          onSeatSelect={handleSeatSelect}
          selectedSeats={selectedSeats}
        />

        {selectedSeats.length > 0 && (
          <div className="booking-section">
            <h3>Selected Seats: {selectedSeats.join(', ')}</h3>
            <p>Total Price: Rs. {selectedSeats.length * 1800}</p>
            <button onClick={handleBooking} className="book-button">
              Book Selected Seats
            </button>
          </div>
        )}

        <div className="test-instructions">
          <h3>Test Instructions:</h3>
          <ol>
            <li>Red seats are occupied (from database)</li>
            <li>Green seats are available</li>
            <li>Blue seats are your current selection</li>
            <li>Click "Refresh" to reload seat status from backend</li>
            <li>Refresh the page - occupied seats will remain red</li>
            <li>Make a booking to see seats become occupied</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionTest;

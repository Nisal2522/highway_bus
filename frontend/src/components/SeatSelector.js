import React, { useState, useEffect } from 'react';
import './SeatSelector.css';

const SeatSelector = ({ busId = 1, routeId = 1, onSeatSelect, selectedSeats = [] }) => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seat status from backend
  const fetchSeatStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8081/api/bookings/seat-status?busId=${busId}&routeId=${routeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch seat status');
      }
      
      const data = await response.json();
      setOccupiedSeats(data.occupiedSeats || []);
      setAvailableSeats(data.availableSeats || []);
      
      console.log('Seat status loaded:', {
        occupied: data.occupiedSeats,
        available: data.availableSeats,
        total: data.totalSeats,
        occupiedCount: data.occupiedCount,
        availableCount: data.availableCount
      });
      
    } catch (err) {
      console.error('Error fetching seat status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch seat status on component mount and when busId/routeId changes
  useEffect(() => {
    fetchSeatStatus();
  }, [busId, routeId]);

  // Handle seat click
  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      return; // Don't allow clicking on occupied seats
    }
    
    if (onSeatSelect) {
      onSeatSelect(seatNumber);
    }
  };

  // Get seat status for display
  const getSeatStatus = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      return 'occupied'; // Red
    } else if (selectedSeats.includes(seatNumber)) {
      return 'selected'; // Blue
    } else {
      return 'available'; // Green
    }
  };

  // Generate seat grid (10 rows x 4 columns = 40 seats)
  const generateSeatGrid = () => {
    const seats = [];
    for (let i = 1; i <= 40; i++) {
      seats.push(
        <button
          key={i}
          className={`seat seat-${getSeatStatus(i.toString())}`}
          onClick={() => handleSeatClick(i.toString())}
          disabled={occupiedSeats.includes(i.toString())}
        >
          {i}
        </button>
      );
    }
    return seats;
  };

  if (loading) {
    return (
      <div className="seat-selector">
        <div className="loading">Loading seat status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seat-selector">
        <div className="error">Error: {error}</div>
        <button onClick={fetchSeatStatus} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="seat-selector">
      <div className="seat-header">
        <h3>Select Seats</h3>
        <button onClick={fetchSeatStatus} className="refresh-button">
          🔄 Refresh
        </button>
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color occupied"></div>
          <span>Occupied</span>
        </div>
      </div>

      <div className="driver-section">
        <div className="driver">Driver</div>
      </div>

      <div className="seat-grid">
        {generateSeatGrid()}
      </div>

      <div className="seat-summary">
        <p>Total Seats: 40</p>
        <p>Available: {availableSeats.length}</p>
        <p>Occupied: {occupiedSeats.length}</p>
        <p>Selected: {selectedSeats.length}</p>
      </div>
    </div>
  );
};

export default SeatSelector;

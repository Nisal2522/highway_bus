import React, { useState } from 'react';
import './SeatManager.css';

const SeatManager = ({ busId = 1, routeId = 1, onSeatsCleared }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const clearOccupiedSeats = async () => {
    if (!window.confirm('Are you sure you want to clear all occupied seats? This will make all seats available.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await fetch(`http://localhost:8081/api/bookings/clear-occupied-seats?busId=${busId}&routeId=${routeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ ${result.message}`);
        if (onSeatsCleared) {
          onSeatsCleared();
        }
      } else {
        const error = await response.json();
        setMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error clearing seats:', error);
      setMessage('❌ Error: Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const clearAllTestBookings = async () => {
    if (!window.confirm('Are you sure you want to clear ALL test bookings? This will remove all test data.')) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('http://localhost:8081/api/bookings/clear-all-test-bookings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ ${result.message}`);
        if (onSeatsCleared) {
          onSeatsCleared();
        }
      } else {
        const error = await response.json();
        setMessage(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error clearing test bookings:', error);
      setMessage('❌ Error: Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seat-manager">
      <h3>Seat Management</h3>
      
      <div className="manager-buttons">
        <button 
          onClick={clearOccupiedSeats}
          disabled={loading}
          className="clear-occupied-btn"
        >
          {loading ? 'Clearing...' : '🗑️ Clear Occupied Seats'}
        </button>
        
        <button 
          onClick={clearAllTestBookings}
          disabled={loading}
          className="clear-all-btn"
        >
          {loading ? 'Clearing...' : '🧹 Clear All Test Bookings'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="manager-info">
        <p><strong>Clear Occupied Seats:</strong> Removes only the red occupied seats (3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35)</p>
        <p><strong>Clear All Test Bookings:</strong> Removes all test bookings including A1, A2, B1 and red seats</p>
      </div>
    </div>
  );
};

export default SeatManager;

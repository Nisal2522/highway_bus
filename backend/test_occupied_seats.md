# Test Occupied Seats API

## Step 1: Mark the Red Seats as Occupied

### Via Database (Recommended):
```sql
-- Run the mark_occupied_seats.sql script in MySQL Workbench
-- This will mark seats 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35 as occupied
```

### Via API:
```bash
# Mark specific seats as occupied
curl -X POST http://localhost:8081/api/bookings/update-seat-status \
  -H "Content-Type: application/json" \
  -d '{
    "busId": 1,
    "routeId": 1,
    "seatNumbers": ["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"],
    "status": "OCCUPIED"
  }'
```

## Step 2: Check Occupied Seats

### Via API:
```bash
# Get all occupied seats for Bus 1, Route 1
curl -X GET "http://localhost:8081/api/bookings/occupied-seats?busId=1&routeId=1"
```

### Expected Response:
```json
{
  "occupiedSeats": ["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]
}
```

## Step 3: Check Available Seats

### Via API:
```bash
# Get available seats count
curl -X GET "http://localhost:8081/api/bookings/available-seats?busId=1&routeId=1"
```

### Expected Response:
```json
{
  "availableSeats": 32
}
```
(45 total seats - 13 occupied seats = 32 available seats)

## Step 4: Frontend Integration

### In your React component:
```javascript
// Fetch occupied seats from backend
const fetchOccupiedSeats = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/bookings/occupied-seats?busId=1&routeId=1');
    const data = await response.json();
    setOccupiedSeats(data.occupiedSeats);
  } catch (error) {
    console.error('Error fetching occupied seats:', error);
  }
};

// Update seat display based on occupied status
const getSeatStatus = (seatNumber) => {
  if (occupiedSeats.includes(seatNumber.toString())) {
    return 'occupied'; // Red color
  }
  return 'available'; // Green color
};
```

## Step 5: Real-time Updates

### When a user selects a seat:
```javascript
// Mark seat as selected (blue)
const selectSeat = (seatNumber) => {
  if (!occupiedSeats.includes(seatNumber.toString())) {
    setSelectedSeats([...selectedSeats, seatNumber]);
  }
};

// When booking is confirmed:
const confirmBooking = async () => {
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  
  if (response.ok) {
    // Refresh occupied seats
    fetchOccupiedSeats();
    setSelectedSeats([]);
  }
};
```

## Summary:

1. **Red seats (occupied)**: 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35
2. **Green seats (available)**: All other seats (1, 2, 4, 5, 8, 9, 11, 12, 16, 17, 19, 20, 21, 22, 23, 24, 25, 27, 29, 30, 31, 34, 36, 37, 38, 39, 40)
3. **Blue seats (selected)**: User's current selection (temporary)

The backend now provides APIs to:
- ✅ Get occupied seats
- ✅ Update seat status
- ✅ Check availability
- ✅ Create bookings that automatically mark seats as occupied

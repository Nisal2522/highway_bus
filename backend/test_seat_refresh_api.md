# Test Seat Refresh API

## Step 1: Mark Red Seats as Occupied

First, run this SQL in MySQL Workbench to mark the red seats as occupied:

```sql
USE highway_express_db;

-- Mark the red seats as occupied
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'Red Occupied Seats', 'red.seats@occupied.com', '+94770000001', 'RED001', 13, 
 '["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]', 
 0.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
```

## Step 2: Test the New API Endpoints

### Get Complete Seat Status
```bash
curl -X GET "http://localhost:8081/api/bookings/seat-status?busId=1&routeId=1"
```

**Expected Response:**
```json
{
  "occupiedSeats": ["A1", "A2", "B1", "3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"],
  "availableSeats": ["1", "2", "4", "5", "8", "9", "11", "12", "16", "17", "19", "20", "21", "22", "23", "24", "25", "27", "29", "30", "31", "34", "36", "37", "38", "39", "40"],
  "totalSeats": 45,
  "occupiedCount": 16,
  "availableCount": 29
}
```

### Refresh Seats (POST)
```bash
curl -X POST http://localhost:8081/api/bookings/refresh-seats \
  -H "Content-Type: application/json" \
  -d '{
    "busId": 1,
    "routeId": 1
  }'
```

### Get Only Occupied Seats
```bash
curl -X GET "http://localhost:8081/api/bookings/occupied-seats?busId=1&routeId=1"
```

## Step 3: Test Frontend Integration

### Add to your React App.js:
```javascript
import SeatSelectionTest from './pages/SeatSelectionTest';

// Add this route
<Route path="/seat-test" element={<SeatSelectionTest />} />
```

### Test the Component:
1. Navigate to `/seat-test`
2. You should see:
   - Red seats: A1, A2, B1, 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35
   - Green seats: All others
3. Click "Refresh" button - should reload from backend
4. Refresh the page - red seats should remain red
5. Select some green seats and make a booking
6. After booking, those seats should become red

## Step 4: Verify Persistence

### Test Page Refresh:
1. Make some seats occupied via API or booking
2. Refresh the browser page
3. Occupied seats should still be red
4. Available seats should still be green

### Test API Refresh:
1. Click the "Refresh" button in the component
2. Should fetch latest seat status from backend
3. Should update the display accordingly

## Step 5: Real-time Updates

### When a booking is made:
1. Frontend calls booking API
2. Backend creates booking and marks seats as occupied
3. Frontend can call refresh API to get updated status
4. Seats automatically update to show new occupancy

## Key Features:

✅ **Persistent Occupancy**: Red seats stay red after page refresh  
✅ **Real-time Updates**: Refresh button fetches latest status  
✅ **Complete Status**: API returns occupied, available, and counts  
✅ **Frontend Integration**: React component handles all states  
✅ **Booking Integration**: New bookings automatically mark seats occupied  

## Troubleshooting:

- If seats don't show as occupied, check the database bookings table
- If API returns 403 error, make sure backend is running and security config allows booking endpoints
- If frontend can't connect, check CORS settings and backend URL

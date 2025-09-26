# Test Occupied Seats API

## Step 1: Mark Red Seats as Occupied

### Option A: MySQL Workbench (Easiest)
1. Open MySQL Workbench
2. Connect to your database
3. Copy and paste the content of `manual_mark_red_seats.sql`
4. Run the script

### Option B: Command Line
```bash
# Run the batch file
mark_red_seats.bat
```

## Step 2: Test the API

### Check Occupied Seats
```bash
curl -X GET "http://localhost:8081/api/bookings/occupied-seats?busId=1&routeId=1"
```

**Expected Response:**
```json
{
  "occupiedSeats": ["A1", "A2", "B1", "3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]
}
```

### Check Available Seats
```bash
curl -X GET "http://localhost:8081/api/bookings/available-seats?busId=1&routeId=1"
```

**Expected Response:**
```json
{
  "availableSeats": 30
}
```
(45 total seats - 15 occupied seats = 30 available)

## Step 3: Verify in Database

```sql
-- Check all bookings
SELECT 
    id,
    passenger_name,
    selected_seats,
    number_of_seats,
    booking_status
FROM bookings 
WHERE bus_id = 1 AND route_id = 1 
ORDER BY id;

-- Count total occupied seats
SELECT 
    SUM(number_of_seats) as total_occupied_seats
FROM bookings 
WHERE bus_id = 1 AND route_id = 1 AND booking_status = 'CONFIRMED';
```

## Step 4: Frontend Integration

```javascript
// Fetch occupied seats from backend
const fetchOccupiedSeats = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/bookings/occupied-seats?busId=1&routeId=1');
    const data = await response.json();
    setOccupiedSeats(data.occupiedSeats);
    console.log('Occupied seats:', data.occupiedSeats);
  } catch (error) {
    console.error('Error fetching occupied seats:', error);
  }
};

// Display seats with correct colors
const getSeatStatus = (seatNumber) => {
  if (occupiedSeats.includes(seatNumber.toString())) {
    return 'occupied'; // Red color
  }
  return 'available'; // Green color
};

// Call this when component mounts
useEffect(() => {
  fetchOccupiedSeats();
}, []);
```

## Summary

After running the script, you should have:

**Occupied Seats (Red):**
- A1, A2 (from existing bookings)
- B1 (from existing bookings)  
- 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35 (from red seats)

**Available Seats (Green):**
- All other seats (1, 2, 4, 5, 8, 9, 11, 12, 16, 17, 19, 20, 21, 22, 23, 24, 25, 27, 29, 30, 31, 34, 36, 37, 38, 39, 40)

**Total:**
- 45 total seats
- 15 occupied seats  
- 30 available seats

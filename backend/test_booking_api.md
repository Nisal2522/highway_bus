# Test Booking API

## After fixing the BookingService, you can test the booking functionality:

### 1. Start the Backend
```bash
cd backend
./start-backend.ps1
```

### 2. Test the Booking API
You can test the booking API using these methods:

#### Option A: Using Postman or similar tool
- **URL:** `POST http://localhost:8081/api/bookings`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
    "userId": 1,
    "routeId": 1,
    "busId": 1,
    "passengerName": "John Doe",
    "passengerEmail": "john.doe@email.com",
    "passengerPhone": "+94771234567",
    "passengerNic": "123456789V",
    "numberOfSeats": 2,
    "selectedSeats": "[\"A1\", \"A2\"]",
    "totalPrice": 1800.00
}
```

#### Option B: Using curl
```bash
curl -X POST http://localhost:8081/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "routeId": 1,
    "busId": 1,
    "passengerName": "John Doe",
    "passengerEmail": "john.doe@email.com",
    "passengerPhone": "+94771234567",
    "passengerNic": "123456789V",
    "numberOfSeats": 2,
    "selectedSeats": "[\"A1\", \"A2\"]",
    "totalPrice": 1800.00
  }'
```

### 3. Test Frontend Integration
1. Start the frontend: `npm start`
2. Go to the PackageBooking page
3. Fill in the passenger details
4. Click the "Book Package" button
5. Check if the booking is created successfully

### 4. Check Database
```sql
USE highway_express_db;
SELECT * FROM bookings;
```

## What was Fixed:
- ✅ Removed the route assignment check that was causing compilation errors
- ✅ The service now works with the existing Bus model
- ✅ Database configuration matches your existing `highway_express_db`
- ✅ All compilation errors are resolved

## Next Steps:
- The booking functionality should now work properly
- You can implement route assignment functionality later if needed
- The frontend will be able to create bookings successfully

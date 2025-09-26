# Test User Bookings API

## Steps to Test and Fix the 500 Error

### 1. Check Database Connection
```sql
-- Run this in MySQL to ensure database is accessible
USE highway_express_db;
SHOW TABLES;
```

### 2. Ensure Test User Exists
```sql
-- Run the ensure_test_user.sql script
source ensure_test_user.sql;
```

### 3. Test Backend Health
```bash
# Test if backend is running
curl http://localhost:8081/api/bookings/health
```

### 4. Test User Bookings Endpoint
```bash
# Test the user bookings endpoint
curl http://localhost:8081/api/bookings/user/1
```

### 5. Check Backend Logs
Look for these log messages in the backend console:
- "Received request for user bookings: 1"
- "Fetching bookings for user ID: 1"
- "Found user: Test User (test@email.com)"
- "Found X bookings for user ID: 1"

### 6. Common Issues and Solutions

#### Issue 1: User Not Found
**Error**: "User not found with ID: 1"
**Solution**: Run the ensure_test_user.sql script

#### Issue 2: Database Connection Issues
**Error**: Database connection errors
**Solution**: 
1. Check if MySQL is running
2. Verify database credentials in application.properties
3. Ensure database exists

#### Issue 3: Missing Dependencies
**Error**: ClassNotFoundException or similar
**Solution**: 
1. Clean and rebuild the project: `mvn clean install`
2. Restart the backend server

### 7. Expected Response Format
```json
[
  {
    "id": 1,
    "passengerName": "Test User",
    "passengerEmail": "test@email.com",
    "passengerPhone": "+94771234567",
    "numberOfSeats": 2,
    "selectedSeats": "[1, 2]",
    "totalPrice": 1000.0,
    "bookingStatus": "CONFIRMED",
    "bookingDate": "2024-01-01T10:00:00",
    "user": {
      "id": 1,
      "firstName": "Test",
      "lastName": "User"
    },
    "route": {
      "id": 1,
      "fromLocation": "Colombo",
      "toLocation": "Kandy"
    },
    "bus": {
      "id": 1,
      "busName": "Test Bus",
      "registrationNumber": "TEST-001"
    }
  }
]
```

### 8. Frontend Testing
1. Open browser developer tools
2. Navigate to ViewBooking page
3. Check console for detailed error messages
4. Verify user ID is being passed correctly

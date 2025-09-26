# Debug 500 Error - User Bookings API

## 🚨 Problem
Frontend calls `http://localhost:8081/api/bookings/user/1` but gets HTTP 500 (Internal Server Error).

## 🔍 Step-by-Step Debugging

### 1. Check Backend Status
```bash
# Test if backend is running
curl http://localhost:8081/api/bookings/health
```

**Expected Response:**
```json
{
  "message": "Booking service is healthy. Found X bookings."
}
```

### 2. Start Backend with Debug Logging
```bash
# Windows
cd backend
start-backend-debug.ps1

# Or manually
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.highwayexpress.backend=DEBUG"
```

### 3. Check Database Connection
```sql
-- Run in MySQL
source test_database_connection.sql;
```

**Expected Output:**
- Database exists: `highway_express_db`
- Tables exist: `users`, `bookings`, `routes`, `buses`
- User with ID 1 exists

### 4. Test API Directly
```bash
# Test the problematic endpoint
curl -v http://localhost:8081/api/bookings/user/1
```

### 5. Check Backend Logs
Look for these log messages in the backend console:

**Success Case:**
```
Received request for user bookings: 1
Fetching bookings for user ID: 1
Database connection test - Total users in database: X
Found user: Test User (test@email.com)
Found 0 bookings for user ID: 1
Returning 0 bookings for user 1
```

**Error Case:**
```
Error fetching bookings for user ID 1: [specific error message]
```

## 🐛 Common Issues & Solutions

### Issue 1: Database Connection Failed
**Error:** `Database connection failed: Communications link failure`
**Solution:**
1. Check if MySQL is running on port 3307
2. Verify database credentials in `application.properties`
3. Ensure database `highway_express_db` exists

### Issue 2: User Not Found
**Error:** `User not found with ID: 1`
**Solution:**
```sql
-- Create test user
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'Test', 'User', 'test@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V');
```

### Issue 3: Table Doesn't Exist
**Error:** `Table 'highway_express_db.bookings' doesn't exist`
**Solution:**
```sql
-- Run database setup
source complete_database_setup.sql;
```

### Issue 4: JPA/Hibernate Issues
**Error:** `Could not determine type for: com.highwayexpress.backend.model.BookingStatus`
**Solution:**
1. Check if `BookingStatus` enum is properly defined
2. Verify JPA annotations in model classes
3. Restart backend after model changes

### Issue 5: Port Already in Use
**Error:** `Port 8081 was already in use`
**Solution:**
```bash
# Kill process using port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F
```

## 🧪 Testing Commands

### Test Database Connection
```sql
USE highway_express_db;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM bookings;
```

### Test User Exists
```sql
SELECT id, first_name, last_name, email FROM users WHERE id = 1;
```

### Test Bookings Query
```sql
SELECT b.*, u.first_name, u.last_name 
FROM bookings b 
JOIN users u ON b.user_id = u.id 
WHERE b.user_id = 1;
```

## 📋 Expected API Response

**Success (No Bookings):**
```json
[]
```

**Success (With Bookings):**
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

**Error Response:**
```json
{
  "message": "Database connection failed: Communications link failure"
}
```

## 🚀 Quick Fix Steps

1. **Start MySQL** (port 3307)
2. **Run database setup**: `source complete_database_setup.sql`
3. **Start backend**: `start-backend-debug.ps1`
4. **Test API**: `curl http://localhost:8081/api/bookings/user/1`
5. **Check frontend**: Navigate to ViewBooking page

## 📞 If Still Not Working

1. **Check backend console** for detailed error logs
2. **Verify database** is accessible from backend
3. **Test with Postman** to isolate frontend vs backend issues
4. **Check CORS** settings if frontend can't connect
5. **Verify user authentication** if using JWT/session auth

# Backend Health Check

## Test Commands

### 1. Check if backend is running:
```powershell
netstat -an | findstr :8081
```

### 2. Test basic endpoint:
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/bookings"
```

### 3. Test seat status endpoint:
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/seat-status?busId=1&routeId=1"
```

### 4. Test occupied seats endpoint:
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/occupied-seats?busId=1&routeId=1"
```

## Expected Issues and Solutions

### Issue 1: 400 Bad Request
- **Cause**: Missing or invalid data in database
- **Solution**: Ensure users, routes, and buses exist in database

### Issue 2: 404 Not Found
- **Cause**: Endpoint not found
- **Solution**: Check if BookingController is properly configured

### Issue 3: 500 Internal Server Error
- **Cause**: Database connection or service error
- **Solution**: Check database connection and service configuration

## Database Requirements

Make sure these tables exist with data:
- `users` table with at least user ID 1
- `routes` table with at least route ID 1  
- `buses` table with at least bus ID 1
- `bookings` table (can be empty)

## Quick Database Setup

Run this SQL to ensure basic data exists:
```sql
USE highway_express_db;

-- Insert user if not exists
INSERT IGNORE INTO users (id, username, email, password, user_type) 
VALUES (1, 'testuser', 'test@email.com', 'password', 'PASSENGER');

-- Insert route if not exists  
INSERT IGNORE INTO routes (id, origin, destination, distance, ticket_price, duration)
VALUES (1, 'Colombo', 'Kandy', 120.5, 1800.00, 180);

-- Insert bus if not exists
INSERT IGNORE INTO buses (id, bus_number, seating_capacity, bus_type, status)
VALUES (1, 'BUS-001', 45, 'AC', 'ACTIVE');
```

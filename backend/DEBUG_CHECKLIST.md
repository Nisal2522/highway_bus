# 🐛 Debug Checklist for 500 Error

## Step 1: Check Backend Logs ✅

### Start Backend with Debug Logging
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.highwayexpress.backend=DEBUG"
```

### Look for These Log Messages:
```
=== BOOKING API DEBUG START ===
Received request for user bookings: 1
User ID type: Long
Database connection test - Total users in database: X
Found user: Test User (test@email.com)
Found 0 bookings for user ID: 1
Successfully retrieved 0 bookings for user 1
=== BOOKING API DEBUG END ===
```

### Common Error Patterns:
- **NULL POINTER EXCEPTION**: Check if userId is null
- **DATABASE ACCESS EXCEPTION**: Database connection issues
- **RUNTIME EXCEPTION**: User not found or query issues

---

## Step 2: Test API in Postman ✅

### Run API Test Script
```bash
cd backend
.\test_api_endpoints.ps1
```

### Manual Testing
```bash
# Health check
curl http://localhost:8081/api/bookings/health

# User bookings
curl http://localhost:8081/api/bookings/user/1
```

### Expected Responses:
- **Health**: `{"message": "Booking service is healthy. Found X bookings."}`
- **User Bookings**: `[]` (empty array) or array of booking objects
- **Error**: `{"message": "Database error: ..."}`

---

## Step 3: Add Error Handling ✅

### Enhanced Controller (Already Implemented)
- Specific exception handling for NullPointer, DataAccess, Runtime
- Detailed logging with debug markers
- Proper error response format

### Service Layer Improvements
- Database connection test
- Graceful handling of missing users
- Detailed error logging

---

## Step 4: Ensure Database Has Data ✅

### Run Database Setup
```sql
source setup_test_data.sql;
```

### Verify Data Exists
```sql
-- Check user exists
SELECT * FROM users WHERE id = 1;

-- Check bookings exist
SELECT * FROM bookings WHERE user_id = 1;

-- Test the exact query
SELECT b.* FROM bookings b JOIN users u ON b.user_id = u.id WHERE u.id = 1;
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptoms**: Connection refused, timeout
**Solution**: 
```bash
cd backend
mvn spring-boot:run
```

### Issue 2: Database Connection Failed
**Symptoms**: "Communications link failure"
**Solution**:
1. Start MySQL on port 3307
2. Check credentials in application.properties
3. Verify database exists

### Issue 3: User Not Found
**Symptoms**: "User not found with ID: 1"
**Solution**:
```sql
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'Test', 'User', 'test@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V');
```

### Issue 4: Tables Don't Exist
**Symptoms**: "Table 'highway_express_db.bookings' doesn't exist"
**Solution**:
```sql
source complete_database_setup.sql;
```

### Issue 5: JPA/Hibernate Issues
**Symptoms**: "Could not determine type for: BookingStatus"
**Solution**:
1. Check BookingStatus enum is properly defined
2. Verify JPA annotations
3. Restart backend

---

## 🧪 Testing Sequence

1. **Start MySQL** (port 3307)
2. **Run database setup**: `source setup_test_data.sql`
3. **Start backend**: `mvn spring-boot:run`
4. **Test API**: `.\test_api_endpoints.ps1`
5. **Check logs**: Look for debug messages in console
6. **Test frontend**: Navigate to ViewBooking page

---

## 📋 Success Criteria

- ✅ Backend starts without errors
- ✅ Health endpoint returns success
- ✅ User bookings endpoint returns `[]` or booking array
- ✅ No 500 errors in backend logs
- ✅ Frontend loads ViewBooking page successfully

---

## 🆘 If Still Not Working

1. **Check backend console** for detailed stack trace
2. **Verify database** is accessible from backend
3. **Test with Postman** to isolate frontend vs backend
4. **Check CORS** settings if frontend can't connect
5. **Verify authentication** if using JWT/session auth

### Debug Commands
```bash
# Check if port 8081 is in use
netstat -ano | findstr :8081

# Check if port 3307 is in use
netstat -ano | findstr :3307

# Kill process on port 8081
taskkill /PID <PID_NUMBER> /F
```

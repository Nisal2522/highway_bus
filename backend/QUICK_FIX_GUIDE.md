# 🚨 QUICK FIX GUIDE - ViewBooking.js 500 Error

## ❌ **Current Problem:**
- Frontend: `GET http://localhost:8081/api/bookings/user/1 500 (Internal Server Error)`
- Backend: Still returning 500 errors
- Issue: Backend code changes not applied

## ✅ **Solution: Restart Backend**

### **Step 1: Stop Backend**
1. Go to your **backend console** (where you started `mvn spring-boot:run`)
2. Press **Ctrl+C** to stop the backend
3. Wait for it to completely stop

### **Step 2: Restart Backend**
```bash
cd backend
mvn spring-boot:run
```

### **Step 3: Wait for Startup**
Wait for this message:
```
Started Application in X.XXX seconds
```

### **Step 4: Test Endpoint**
```bash
curl http://localhost:8081/api/bookings/user/1
```

## 🎯 **Expected Result After Restart:**

### **Backend Console Logs:**
```
=== BOOKING API DEBUG START ===
Received request for user bookings: 1
User ID type: Long
Database connection test - Total users in database: X
Found user: Test User (test@email.com)
Found 13 bookings for user ID: 1
=== BOOKING API DEBUG END ===
```

### **API Response:**
```json
[
  {
    "id": 18,
    "passengerName": "Nisal Amarasekara",
    "passengerEmail": "nisalamar@gmail.com",
    "passengerPhone": "0775904502",
    "numberOfSeats": 1,
    "selectedSeats": "[5]",
    "totalPrice": 1800.0,
    "bookingStatus": "CONFIRMED",
    "bookingDate": "2025-09-05T16:26:29",
    "user": {
      "id": 1,
      "firstName": "Test",
      "lastName": "User",
      "email": "test@email.com"
    }
  },
  // ... 12 more bookings
]
```

## 🔍 **If Still Getting 500 After Restart:**

### **Check Backend Console for:**
- `NULL POINTER EXCEPTION`
- `DATABASE ACCESS EXCEPTION`
- `RUNTIME EXCEPTION`
- `User not found with ID: 1`

### **Common Issues:**
1. **User doesn't exist**: Create test user
2. **Database connection**: Check MySQL is running on port 3307
3. **JPA mapping**: Check Booking model annotations

## 🎉 **Success Indicators:**
- ✅ Backend starts without errors
- ✅ Health endpoint returns success
- ✅ User bookings endpoint returns JSON array
- ✅ Frontend ViewBooking.js loads data successfully

## 📋 **Quick Commands:**
```bash
# Test health
curl http://localhost:8081/api/bookings/health

# Test user bookings
curl http://localhost:8081/api/bookings/user/1

# Test all bookings
curl http://localhost:8081/api/bookings
```

---

**The key issue is that the backend needs to be restarted to pick up the code changes. Once restarted, the ViewBooking.js should work perfectly!**

# Complete SeatBooking Integration Test Guide

## 🎯 **What We've Built**

A fully integrated seat booking system where:
- ✅ Red seats are fetched from the booking table in the database
- ✅ Real-time seat availability updates
- ✅ Complete booking functionality with backend integration
- ✅ Persistent seat occupancy across page refreshes

## 🔧 **Backend Integration**

### **API Endpoints Used:**
1. `GET /api/bookings/seat-status?busId=1&routeId=1` - Get occupied seats
2. `POST /api/bookings` - Create new booking
3. `DELETE /api/bookings/clear-occupied-seats` - Clear occupied seats (for testing)

### **Database Integration:**
- Fetches occupied seat numbers from `bookings` table
- Creates new bookings when seats are selected
- Updates seat availability in real-time

## 🎨 **Frontend Features**

### **SeatBooking.js Updates:**
- ✅ Fetches occupied seats from backend on page load
- ✅ Shows red seats based on database data
- ✅ Real booking functionality (not just simulation)
- ✅ Refresh button to reload seat status
- ✅ Error handling with fallback
- ✅ Loading states and user feedback

### **Visual Indicators:**
- 🔴 **Red Seats**: Occupied (from database)
- 🟢 **Green Seats**: Available
- 🔵 **Blue Seats**: Currently selected by user

## 🚀 **Setup Instructions**

### **Step 1: Ensure Database Data**
```sql
-- Run this in MySQL Workbench:
USE highway_express_db;

-- Insert basic data if not exists
INSERT IGNORE INTO users (id, username, email, password, user_type) 
VALUES (1, 'testuser', 'test@email.com', 'password', 'PASSENGER');

INSERT IGNORE INTO routes (id, origin, destination, distance, ticket_price, duration)
VALUES (1, 'Colombo', 'Kandy', 120.5, 1800.00, 180);

INSERT IGNORE INTO buses (id, bus_number, seating_capacity, bus_type, status)
VALUES (1, 'BUS-001', 45, 'AC', 'ACTIVE');
```

### **Step 2: Mark Some Seats as Occupied (Optional)**
```sql
-- Mark red seats as occupied for testing
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'Red Occupied Seats', 'red.seats@occupied.com', '+94770000001', 'RED001', 13, 
 '["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]', 
 0.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
```

### **Step 3: Test the Integration**

1. **Start Backend**: Ensure backend is running on port 8081
2. **Navigate to SeatBooking**: Go to the seat booking page
3. **Verify Red Seats**: You should see red seats (occupied) based on database
4. **Test Booking**: Select available seats and make a booking
5. **Verify Update**: After booking, those seats should become red

## 🧪 **Testing Scenarios**

### **Scenario 1: Fresh Start**
- No occupied seats in database
- All seats should be green (available)
- Make a booking and verify seats turn red

### **Scenario 2: With Existing Bookings**
- Some seats already occupied in database
- Should see red seats on page load
- Can only select green seats
- New bookings add more red seats

### **Scenario 3: Page Refresh**
- Make some bookings
- Refresh the page
- Red seats should remain red (persistent)

### **Scenario 4: Real-time Updates**
- Click "Refresh" button
- Should fetch latest seat status from backend
- Display should update accordingly

## 🔍 **API Testing**

### **Test Seat Status API:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/api/bookings/seat-status?busId=1&routeId=1"
```

**Expected Response:**
```json
{
  "occupiedSeats": ["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"],
  "availableSeats": ["1", "2", "4", "5", "8", "9", "11", "12", "16", "17", "19", "20", "21", "22", "23", "24", "25", "27", "29", "30", "31", "34", "36", "37", "38", "39", "40"],
  "totalSeats": 45,
  "occupiedCount": 13,
  "availableCount": 32
}
```

### **Test Booking API:**
```powershell
$bookingData = @{
    userId = 1
    routeId = 1
    busId = 1
    passengerName = "Test User"
    passengerEmail = "test@email.com"
    passengerPhone = "+94771234567"
    numberOfSeats = 2
    selectedSeats = '["1", "2"]'
    totalPrice = 3600
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/bookings" -Method POST -Body $bookingData -ContentType "application/json"
```

## 🎉 **Key Features**

### **✅ Real Database Integration**
- Seats are marked as occupied based on actual booking data
- No more random seat availability
- Persistent across page refreshes

### **✅ Complete Booking Flow**
- Select seats → Fill details → Book → Seats become occupied
- Real API calls to backend
- Proper error handling

### **✅ User Experience**
- Loading states during API calls
- Error messages with fallback
- Refresh button for real-time updates
- Visual feedback for all seat states

### **✅ Backend Integration**
- Fetches data from booking table
- Creates new bookings
- Updates seat availability
- Handles all edge cases

## 🐛 **Troubleshooting**

### **If seats don't show as occupied:**
1. Check if backend is running on port 8081
2. Verify database has booking data
3. Check browser console for API errors
4. Test API directly with PowerShell

### **If booking fails:**
1. Ensure all required data exists (user, route, bus)
2. Check backend logs for errors
3. Verify API endpoint is accessible
4. Check CORS configuration

### **If page doesn't load:**
1. Check if route and selectedBus are passed correctly
2. Verify all required props are available
3. Check browser console for JavaScript errors

## 🎯 **Success Criteria**

✅ **Red seats show based on database bookings**  
✅ **New bookings create occupied seats**  
✅ **Seat status persists across page refreshes**  
✅ **Real-time updates work with refresh button**  
✅ **Complete booking flow is functional**  
✅ **Error handling works properly**  
✅ **Loading states provide good UX**  

The system is now a fully working, database-integrated seat booking application! 🎉

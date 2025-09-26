# Remove Occupied Seats Guide

## 🗑️ **Quick Removal Methods**

### **Method 1: SQL Script (Recommended)**

#### **Remove All Occupied Seats:**
```sql
-- Run in MySQL Workbench:
USE highway_express_db;

DELETE FROM bookings 
WHERE passenger_name IN (
    'Red Occupied Seats',
    'System Occupied',
    'Test User',
    'John Doe',
    'Jane Smith'
);

SELECT 'All occupied seats removed!' AS Message;
```

#### **Remove Only Red Seats:**
```sql
-- Run in MySQL Workbench:
USE highway_express_db;

DELETE FROM bookings 
WHERE passenger_name = 'Red Occupied Seats';

SELECT 'Red seats removed!' AS Message;
```

### **Method 2: Batch File**
```bash
# Run in Command Prompt:
cd backend
remove_occupied_seats.bat
```

### **Method 3: API Endpoints**

#### **Clear Occupied Seats for Specific Bus/Route:**
```bash
curl -X DELETE "http://localhost:8081/api/bookings/clear-occupied-seats?busId=1&routeId=1"
```

#### **Clear All Test Bookings:**
```bash
curl -X DELETE "http://localhost:8081/api/bookings/clear-all-test-bookings"
```

### **Method 4: Frontend Interface**

1. Navigate to `/seat-test` page
2. Use the "Seat Management" section
3. Click "🗑️ Clear Occupied Seats" or "🧹 Clear All Test Bookings"
4. Seats will be cleared and display will update automatically

## 📊 **What Gets Removed**

### **Clear Occupied Seats:**
- Red seats: 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35
- System bookings
- Test user bookings

### **Clear All Test Bookings:**
- All red seats
- Sample bookings: A1, A2, B1
- All test data

## 🔄 **After Removal**

### **Expected Result:**
- All seats will show as **GREEN** (available)
- No red seats will be displayed
- Seat count will show: Available: 40, Occupied: 0

### **Verify Removal:**
```bash
# Check remaining bookings:
curl -X GET "http://localhost:8081/api/bookings/seat-status?busId=1&routeId=1"
```

**Expected Response:**
```json
{
  "occupiedSeats": [],
  "availableSeats": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"],
  "totalSeats": 45,
  "occupiedCount": 0,
  "availableCount": 40
}
```

## 🚀 **Quick Commands**

### **PowerShell:**
```powershell
# Remove all occupied seats
mysql -u root -p highway_express_db -e "DELETE FROM bookings WHERE passenger_name IN ('Red Occupied Seats', 'System Occupied', 'Test User', 'John Doe', 'Jane Smith');"
```

### **Command Prompt:**
```cmd
# Run batch file
cd backend
remove_occupied_seats.bat
```

### **MySQL Workbench:**
1. Open MySQL Workbench
2. Connect to your database
3. Open `remove_occupied_seats.sql`
4. Execute the script

## ⚠️ **Important Notes**

- **Backup First:** Always backup your database before removing data
- **Confirmation:** The frontend will ask for confirmation before clearing
- **Real-time Updates:** Frontend will automatically refresh after clearing
- **Persistence:** Changes are permanent and stored in database

## 🎯 **Test the Removal**

1. **Before Removal:** You should see red seats (occupied)
2. **Run Removal:** Use any method above
3. **After Removal:** All seats should be green (available)
4. **Page Refresh:** Seats should remain green
5. **New Booking:** New bookings will create new occupied seats

## 🔧 **Troubleshooting**

### **If seats don't clear:**
1. Check if backend is running
2. Verify database connection
3. Check if bookings table exists
4. Ensure correct busId and routeId

### **If API returns error:**
1. Check backend logs
2. Verify security configuration
3. Ensure booking endpoints are accessible

### **If frontend doesn't update:**
1. Check browser console for errors
2. Verify API calls are successful
3. Try refreshing the page manually

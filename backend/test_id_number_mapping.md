# Test ID Number (NIC) Mapping Verification

## 🎯 **Current Mapping Status**

✅ **Database Field**: `id_number`  
✅ **Java Property**: `idNumber`  
✅ **Frontend Field**: `nic`  
✅ **Mapping**: `userDetails.idNumber` → `passengerDetails.nic`  

## 🔍 **Verification Steps**

### **Step 1: Check Database Structure**
```sql
-- Verify the id_number field exists in users table
DESCRIBE users;

-- Check if test user has id_number
SELECT id, first_name, last_name, email, id_number 
FROM users 
WHERE email = 'test@email.com';
```

### **Step 2: Test Backend API Response**
```powershell
# Test user API to see if idNumber is returned
Invoke-RestMethod -Uri "http://localhost:8081/api/users/1"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "email": "test@email.com",
    "phone": "1234567890",
    "idNumber": "123456789V",  // This should match id_number in database
    "userType": "PASSENGER"
  }
}
```

### **Step 3: Test Frontend Auto-Fill**
1. **Login to the application**
2. **Navigate to seat booking page**
3. **Click "Login to Auto-fill"**
4. **Verify NIC field is populated** with the value from `id_number`

## 🎯 **Field Mapping Flow**

```
Database (id_number) 
    ↓
User Model (idNumber property)
    ↓  
UserService (returns idNumber in response)
    ↓
Frontend API Call (userDetails.idNumber)
    ↓
SeatBooking.js (passengerDetails.nic)
    ↓
Form Field (NIC Number input)
```

## ✅ **Current Implementation**

### **Backend (User.java):**
```java
@Column(name = "id_number")
private String idNumber;

public String getIdNumber() {
    return idNumber;
}
```

### **Backend (UserService.java):**
```java
data.put("idNumber", user.getIdNumber()); // Returns id_number value
```

### **Frontend (SeatBooking.js):**
```javascript
nic: userDetails.idNumber || userDetails.nic || userDetails.nicNumber || ''
```

## 🧪 **Test Commands**

### **Create Test User with ID Number:**
```sql
INSERT INTO users (first_name, last_name, email, phone, password, user_type, id_number) 
VALUES ('John', 'Doe', 'test@email.com', '1234567890', 'hashed_password', 'PASSENGER', '123456789V');
```

### **Verify API Response:**
```powershell
# Test the API endpoint
curl.exe http://localhost:8081/api/users/1
```

### **Check Frontend Console:**
```javascript
// In browser console, check if user data contains idNumber
console.log('User data:', localStorage.getItem('user'));
```

## 🎉 **Expected Result**

When a user logs in and navigates to seat booking:

1. **✅ Backend returns**: `"idNumber": "123456789V"`
2. **✅ Frontend receives**: `userDetails.idNumber = "123456789V"`
3. **✅ Form auto-fills**: NIC field shows `"123456789V"`
4. **✅ Database field**: `id_number` contains `"123456789V"`

## 🔧 **Troubleshooting**

### **If NIC field is empty:**
1. Check if user has `id_number` in database
2. Verify API response includes `idNumber` field
3. Check browser console for errors
4. Ensure user is PASSENGER type (id_number only for passengers)

### **If mapping is wrong:**
1. Verify `@Column(name = "id_number")` annotation
2. Check UserService returns `idNumber` in response
3. Verify frontend uses `userDetails.idNumber`

The mapping is already correctly implemented! The `id_number` database field properly maps to the NIC Number field in the frontend form. 🎉

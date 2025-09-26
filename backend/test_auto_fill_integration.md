# Test Auto-Fill Integration Guide

## 🎯 **Quick Test Steps**

### **Step 1: Start the Application**
1. Make sure backend is running on `http://localhost:8081`
2. Start frontend with `npm start` (should run on `http://localhost:3000`)

### **Step 2: Test Without Login**
1. Navigate to seat booking page
2. You should see:
   - ✅ **"Login to Auto-fill" button** in passenger details section
   - ✅ **Empty form fields** (name, email, phone, NIC)
   - ✅ **No errors** in browser console

### **Step 3: Test With Login**
1. Click **"Login to Auto-fill"** button
2. Login form should appear with glassmorphism design
3. Use demo credentials:
   - **Email**: `test@email.com`
   - **Password**: `password`
4. After login, you should see:
   - ✅ **Green status badge**: "Logged in as: test@email.com"
   - ✅ **Auto-filled form fields** with user data
   - ✅ **Loading indicator** while fetching details

### **Step 4: Test Booking**
1. Select some seats
2. Verify form is auto-filled
3. Click "Book Seats" button
4. Should use logged-in user's ID for booking

## 🔍 **Expected Behavior**

### **✅ Success Indicators:**
- No "useAuth must be used within an AuthProvider" errors
- Login form appears when clicking "Login to Auto-fill"
- Form auto-fills after successful login
- Green status badge shows logged-in user
- Booking uses correct user ID

### **⚠️ Fallback Behavior:**
- If backend user API fails, form still auto-fills with stored user data
- If not logged in, form remains empty and can be filled manually
- Guest bookings use default user ID (1)

## 🐛 **Troubleshooting**

### **If you see "useAuth must be used within an AuthProvider" error:**
- ✅ **Fixed**: App.js now wraps everything with AuthProvider
- Restart the frontend application

### **If login form doesn't appear:**
- Check browser console for errors
- Verify LoginForm component is imported correctly
- Check if showLoginForm state is being set

### **If form doesn't auto-fill:**
- Check if user is actually logged in (green badge should appear)
- Check browser console for API errors
- Verify backend user API is working
- Check if user data exists in localStorage

### **If booking fails:**
- Check if backend booking API is accessible
- Verify user ID is being sent correctly
- Check CORS configuration

## 🧪 **Manual Testing Commands**

### **Test Backend User API:**
```powershell
# Test get user by ID
Invoke-RestMethod -Uri "http://localhost:8081/api/users/1"

# Test login API
$loginData = @{
    email = "test@email.com"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
```

### **Check localStorage:**
```javascript
// In browser console
console.log('User data:', localStorage.getItem('user'));
console.log('Parsed user:', JSON.parse(localStorage.getItem('user') || '{}'));
```

## 🎉 **Success Criteria**

✅ **No runtime errors**  
✅ **Login form appears** when clicking "Login to Auto-fill"  
✅ **Form auto-fills** after successful login  
✅ **Green status badge** shows logged-in user  
✅ **Booking works** with correct user ID  
✅ **Fallback handling** works when API fails  
✅ **Manual entry** still works for non-logged-in users  

The auto-fill system should now work seamlessly! 🚀

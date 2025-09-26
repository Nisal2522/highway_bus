# Logout Functionality Test Guide

## ✅ Logout Button Location

Both dashboards have logout buttons in the **top-right corner** of the header:

### Passenger Dashboard
- **Location**: Top-right corner of the dashboard header
- **Icon**: Sign-out icon (FaSignOutAlt)
- **Text**: "Logout"

### Bus Owner Dashboard  
- **Location**: Top-right corner of the dashboard header
- **Icon**: Sign-out icon (FaSignOutAlt)
- **Text**: "Logout"

## 🧪 How to Test Logout

### Step 1: Start the Application
```bash
# Terminal 1 - Start Backend
cd C:\highway-express-developer\backend
.\mvnw.cmd spring-boot:run

# Terminal 2 - Start Frontend  
cd C:\highway-express-developer\frontend
npm start
```

### Step 2: Login to Dashboard
1. Go to `http://localhost:3000/login`
2. Use test credentials:
   - **Email**: `demo@example.com`
   - **Password**: `password123`
3. Click "Sign In"
4. Should redirect to Passenger Dashboard

### Step 3: Test Logout
1. **Look for the logout button** in the top-right corner
2. **Click the logout button** (with sign-out icon)
3. **Check console logs** (F12 → Console) for logout messages
4. **Should redirect to login page** automatically

## 🔍 Expected Behavior

### When Logout is Clicked:
1. ✅ **Console logs appear**:
   - "PassengerDashboard: Logout button clicked"
   - "Logout initiated..."
   - "Logout completed. Redirecting to login..."

2. ✅ **localStorage is cleared**:
   - `user` data removed
   - `token` removed

3. ✅ **Redirect to login page**:
   - URL changes to `/login`
   - Login form is displayed

4. ✅ **Authentication state reset**:
   - Can't access dashboard without re-login

## 🐛 Troubleshooting

### If Logout Doesn't Work:

1. **Check Console Errors** (F12 → Console)
2. **Verify Backend is Running** (`http://localhost:8080/api/users`)
3. **Clear Browser Cache** (Ctrl+Shift+R)
4. **Check localStorage** (F12 → Application → Storage)

### Test Credentials:

**Passenger User:**
- Email: `demo@example.com`
- Password: `password123`

**Bus Owner User:**
- Email: `owner@test.com` (register first)
- Password: `password123`

## 📱 Visual Guide

The logout button looks like this in the dashboard header:

```
┌─────────────────────────────────────────────────────────┐
│ Passenger Dashboard                    [👤 John Doe] [🚪 Logout] │
│ Welcome back, John!                                     │
└─────────────────────────────────────────────────────────┘
```

The logout button is the **red button with a sign-out icon** in the top-right corner.

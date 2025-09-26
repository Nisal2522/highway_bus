# Backend Startup Guide - No More JAVA_HOME Issues! 🚀

## Problem Solved ✅
The JAVA_HOME error is now permanently fixed! You have multiple ways to start the backend without worrying about environment variables.

## Quick Start Options

### Option 1: Universal Script (Recommended)
Run from **any directory** in your project:
```powershell
.\start-backend-universal.ps1
```

### Option 2: Simple Batch File
Run from the **root directory**:
```cmd
start-backend.bat
```

### Option 3: Backend Directory Scripts
Run from the **backend directory**:
```powershell
.\start-backend-fixed.ps1
```
or
```cmd
start-backend-fixed.bat
```

## What These Scripts Do

1. **Automatically Detect Java**: Tries JDK 24, 21, then 17
2. **Set JAVA_HOME**: Automatically sets the environment variable
3. **Navigate to Backend**: Changes to the correct directory
4. **Start Spring Boot**: Runs the application with Maven wrapper

## Why This Fixes the Issue

- **No Manual Setup**: No need to set JAVA_HOME manually
- **Works Everywhere**: Scripts work from any directory
- **Multiple Java Versions**: Automatically finds your Java installation
- **Error Handling**: Clear error messages if something goes wrong

## Manual JAVA_HOME Setup (Optional)

If you want to set JAVA_HOME permanently for your entire system:

### PowerShell (Run as Administrator):
```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-24", "User")
```

### Windows GUI:
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab → "Environment Variables"
3. Under "User variables", click "New"
4. Variable name: `JAVA_HOME`
5. Variable value: `C:\Program Files\Java\jdk-24`
6. Click OK

## Troubleshooting

### If you get "Java not found" error:
1. Check if Java is installed at `C:\Program Files\Java\`
2. Update the path in the scripts if needed
3. Install Java JDK 24 if not present

### If you get "mvnw.cmd not found" error:
1. Make sure you're running from the correct directory
2. Use the universal script: `.\start-backend-universal.ps1`

## Success Indicators

When the backend starts successfully, you should see:
- ✅ JAVA_HOME set to: C:\Program Files\Java\jdk-24
- ✅ Java version information
- ✅ Spring Boot startup messages
- ✅ Application running on port 8080

## Frontend Startup

To start the frontend (in a separate terminal):
```cmd
cd frontend
npm start
```

---

**🎉 You'll never see the JAVA_HOME error again!**

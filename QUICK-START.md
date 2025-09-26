# Quick Start - Backend (No JAVA_HOME Issues) 🚀

## The Problem is SOLVED! ✅

You have multiple simple ways to start the backend without JAVA_HOME issues.

## Option 1: One-Liner (Fastest)
In the **backend directory**, run:
```powershell
.\start-now.ps1
```

## Option 2: Simple Script
In the **backend directory**, run:
```powershell
.\start-simple.ps1
```

## Option 3: Batch File
In the **backend directory**, run:
```cmd
start-simple.bat
```

## Option 4: Manual (If you want to understand)
In the **backend directory**, run:
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-24"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
.\mvnw.cmd spring-boot:run
```

## What These Do
1. Set JAVA_HOME to your Java installation
2. Add Java to PATH
3. Start Spring Boot with Maven

## Success Indicators
- ✅ "JAVA_HOME set to: C:\Program Files\Java\jdk-24"
- ✅ Spring Boot startup messages
- ✅ "Started BackendApplication" message
- ✅ Application running on port 8080

## Frontend
In a **separate terminal**, run:
```cmd
cd frontend
npm start
```

---

**🎉 No more JAVA_HOME errors! Just run any of the scripts above.**

# Highway Express Backend

This is the Spring Boot backend for the Highway Express application that handles user registration and authentication.

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Database Setup

1. Start MySQL server
2. Create the database and tables by running the SQL script:

```sql
-- Run the database_setup.sql file in your MySQL client
-- Or execute these commands:

CREATE DATABASE IF NOT EXISTS highway_express_db;
USE highway_express_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('PASSENGER', 'OWNER') NOT NULL,
    id_number VARCHAR(50),
    company_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_id_number (id_number),
    INDEX idx_company_name (company_name)
);
```

## Configuration

Update the database connection settings in `src/main/resources/application.properties`:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

## Running the Application

1. Navigate to the backend directory:
   ```bash
   cd frontend/backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   **OR use the Maven wrapper:**
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will start on `http://localhost:8080`

## API Endpoints

### User Registration
- **POST** `/api/users/register`
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "userType": "PASSENGER",
    "idNumber": "ID123456"
  }
  ```

For bus owners:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567891",
  "password": "password123",
  "userType": "OWNER",
  "companyName": "Express Bus Company"
}
```

## Features

- User registration for both passengers and bus owners
- Password encryption using BCrypt
- Email uniqueness validation
- ID number validation for passengers
- Company name validation for bus owners
- CORS configuration for frontend integration
- Input validation and error handling

## Project Structure

```
src/main/java/com/highwayexpress/backend/
├── BackendApplication.java          # Main application class
├── config/
│   └── SecurityConfig.java         # Security and CORS configuration
├── controller/
│   └── UserController.java         # REST API endpoints
├── dto/
│   └── UserRegistrationDto.java    # Data transfer object
├── model/
│   ├── User.java                   # User entity
│   └── UserType.java               # User type enum
├── repository/
│   └── UserRepository.java         # Data access layer
└── service/
    └── UserService.java            # Business logic
```

## Troubleshooting

If you get an error with `mvnw.cmd`, make sure:
1. You're in the correct directory (`frontend/backend`)
2. The Maven wrapper files exist (mvnw.cmd, mvnw, .mvn/wrapper/maven-wrapper.properties)
3. You have Java 11+ installed and JAVA_HOME set correctly

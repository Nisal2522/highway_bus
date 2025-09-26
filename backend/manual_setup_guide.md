# Manual Database Setup Guide

## Step 1: Create Database
Run this command in MySQL Workbench or command line:

```sql
CREATE DATABASE IF NOT EXISTS highway_express;
USE highway_express;
```

## Step 2: Create Bookings Table
Run this SQL script:

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_nic VARCHAR(50),
    number_of_seats INT NOT NULL CHECK (number_of_seats > 0),
    selected_seats TEXT,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    booking_status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING_PAYMENT') NOT NULL DEFAULT 'CONFIRMED',
    booking_date DATETIME NOT NULL,
    travel_date DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_user_id (user_id),
    INDEX idx_route_id (route_id),
    INDEX idx_bus_id (bus_id),
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_date (booking_date),
    INDEX idx_travel_date (travel_date),
    INDEX idx_passenger_email (passenger_email),
    INDEX idx_passenger_phone (passenger_phone),
    INDEX idx_created_at (created_at)
);
```

## Step 3: Create Audit Log Table
```sql
CREATE TABLE IF NOT EXISTS booking_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    action VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_timestamp (timestamp)
);
```

## Step 4: Insert Sample Data (Optional)
```sql
INSERT IGNORE INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'John Doe', 'john.doe@email.com', '+94771234567', '123456789V', 2, '["A1", "A2"]', 1800.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 1, 1, 'Jane Smith', 'jane.smith@email.com', '+94771234568', '987654321V', 1, '["B1"]', 900.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
```

## Step 5: Verify Setup
```sql
SHOW TABLES;
SELECT * FROM bookings;
```

## Alternative: Use MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new SQL tab
4. Copy and paste the SQL commands above
5. Execute them one by one

## Alternative: Use Command Line (if MySQL is in PATH)
```bash
mysql -u root -p
CREATE DATABASE IF NOT EXISTS highway_express;
USE highway_express;
# Then copy and paste the table creation scripts
```

## Troubleshooting
- If you get "Unknown database" error, make sure to run `CREATE DATABASE` first
- If you get foreign key errors, the referenced tables (users, routes, buses) might not exist yet
- Make sure you're connected to the correct MySQL server

-- Add booking table to existing highway_express_db database
-- Run this script in MySQL Workbench

USE highway_express_db;

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

-- Create audit log table for tracking booking changes
CREATE TABLE IF NOT EXISTS booking_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    action VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_timestamp (timestamp)
);

-- Insert sample data for testing
INSERT IGNORE INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'John Doe', 'john.doe@email.com', '+94771234567', '123456789V', 2, '["A1", "A2"]', 1800.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 1, 1, 'Jane Smith', 'jane.smith@email.com', '+94771234568', '987654321V', 1, '["B1"]', 900.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Verify the table was created
SELECT 'Booking table added successfully!' as message;
SHOW TABLES;
SELECT COUNT(*) as booking_count FROM bookings;

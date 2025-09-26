-- Fix Booking Database Schema and Data
-- This script ensures the database matches the Java models exactly

USE highway_express_db;

-- Drop existing tables if they exist (be careful in production!)
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS route_assignments;
-- DROP TABLE IF EXISTS routes;
-- DROP TABLE IF EXISTS buses;
-- DROP TABLE IF EXISTS users;

-- Create users table with correct schema
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    user_type ENUM('PASSENGER', 'BUS_OWNER', 'ADMIN') NOT NULL DEFAULT 'PASSENGER',
    id_number VARCHAR(50),
    company_name VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create buses table with correct schema
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    seating_capacity INT NOT NULL CHECK (seating_capacity > 0),
    bus_book_copy_url VARCHAR(255),
    owner_id_copy_url VARCHAR(255),
    owner_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create routes table with correct schema
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    departure_time TIME,
    arrival_time TIME,
    ticket_price DECIMAL(10,2) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create bookings table with correct schema
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
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    
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

-- Insert sample users (with correct schema)
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'John', 'Doe', 'john.doe@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V'),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '+94771234568', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '987654321V'),
(3, 'Bus', 'Owner', 'bus.owner@email.com', '+94771234569', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'BUS_OWNER', '456789123V');

-- Insert sample buses (with correct schema)
INSERT IGNORE INTO buses (id, bus_name, registration_number, seating_capacity, owner_id, status) VALUES
(1, 'Express Bus 1', 'ABC-1234', 40, 3, 'APPROVED'),
(2, 'Comfort Bus 2', 'XYZ-5678', 35, 3, 'APPROVED'),
(3, 'Luxury Bus 3', 'DEF-9012', 45, 3, 'APPROVED');

-- Insert sample routes (with correct schema)
INSERT IGNORE INTO routes (id, from_location, to_location, departure_time, arrival_time, ticket_price, status) VALUES
(1, 'Colombo', 'Kandy', '08:00:00', '11:00:00', 1800.00, 'ACTIVE'),
(2, 'Colombo', 'Galle', '14:00:00', '17:30:00', 1200.00, 'ACTIVE'),
(3, 'Kandy', 'Jaffna', '06:00:00', '12:00:00', 2500.00, 'ACTIVE');

-- Check if data exists
SELECT 'Users:' as Table_Name, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Routes:', COUNT(*) FROM routes  
UNION ALL
SELECT 'Buses:', COUNT(*) FROM buses
UNION ALL
SELECT 'Bookings:', COUNT(*) FROM bookings;

-- Show sample data
SELECT 'Sample Users:' as Info;
SELECT id, first_name, last_name, email, user_type FROM users LIMIT 3;

SELECT 'Sample Routes:' as Info;
SELECT id, from_location, to_location, ticket_price FROM routes LIMIT 3;

SELECT 'Sample Buses:' as Info;
SELECT id, bus_name, registration_number, seating_capacity FROM buses LIMIT 3;

SELECT 'Database setup completed successfully!' AS Message;

-- Simple database setup for Highway Express
-- This script creates the necessary tables for the application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS highway_express_db;
USE highway_express_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    nic VARCHAR(50),
    user_type ENUM('ADMIN', 'PASSENGER', 'OWNER') NOT NULL DEFAULT 'PASSENGER',
    status ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    seating_capacity INT NOT NULL,
    bus_type VARCHAR(50),
    amenities TEXT,
    owner_id BIGINT,
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_location VARCHAR(100) NOT NULL,
    to_location VARCHAR(100) NOT NULL,
    departure_time TIME,
    arrival_time TIME,
    ticket_price DECIMAL(10,2) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create route_assignments table
CREATE TABLE IF NOT EXISTS route_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    assigned_seats INT NOT NULL,
    status ENUM('ASSIGNED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'ASSIGNED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

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
    number_of_seats INT NOT NULL,
    selected_seats TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    booking_status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING_PAYMENT') NOT NULL DEFAULT 'CONFIRMED',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT IGNORE INTO users (id, first_name, last_name, email, password, phone, user_type) VALUES
(1, 'Admin', 'User', 'admin@highwayexpress.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '+94771234567', 'ADMIN'),
(2, 'John', 'Doe', 'john@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '+94771234568', 'PASSENGER'),
(3, 'Bus', 'Owner', 'owner@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '+94771234569', 'OWNER');

INSERT IGNORE INTO buses (id, bus_name, registration_number, seating_capacity, owner_id) VALUES
(1, 'Express Bus', 'ABC-1234', 40, 3),
(2, 'Luxury Coach', 'XYZ-5678', 50, 3);

INSERT IGNORE INTO routes (id, from_location, to_location, departure_time, arrival_time, ticket_price, description) VALUES
(1, 'Colombo', 'Kandy', '08:00:00', '11:00:00', 1200.00, 'Scenic route to Kandy'),
(2, 'Kandy', 'Galle', '14:00:00', '18:00:00', 1500.00, 'Coastal route to Galle'),
(3, 'Kandy', 'Jaffna', '07:30:00', '14:00:00', 1800.00, 'Long distance route to Jaffna');

INSERT IGNORE INTO route_assignments (route_id, bus_id, departure_date, departure_time, assigned_seats) VALUES
(1, 1, '2025-01-15', '08:00:00', 40),
(2, 2, '2025-01-15', '14:00:00', 50),
(3, 1, '2025-01-15', '07:30:00', 40);

-- Display success message
SELECT 'Database setup completed successfully!' as message;

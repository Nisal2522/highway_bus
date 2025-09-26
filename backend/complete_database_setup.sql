-- Complete Database Setup for Highway Express
-- This script creates all required tables and sample data

USE highway_express_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('PASSENGER', 'BUS_OWNER', 'ADMIN') NOT NULL,
    id_number VARCHAR(50),
    company_name VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create buses table
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

-- Create routes table
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

-- Create bookings table (already exists, but let's make sure it's correct)
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

-- Insert sample users
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'John', 'Doe', 'john.doe@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V'),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '+94771234568', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '987654321V'),
(3, 'Bus', 'Owner', 'bus.owner@email.com', '+94771234569', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'BUS_OWNER', '456789123V');

-- Insert sample routes
INSERT IGNORE INTO routes (id, from_location, to_location, departure_time, arrival_time, ticket_price, status, description) VALUES
(1, 'Colombo', 'Jaffna', '07:30:00', '15:00:00', 1800.00, 'ACTIVE', 'Daily express service from Colombo to Jaffna'),
(2, 'Colombo', 'Galle', '08:00:00', '11:30:00', 900.00, 'ACTIVE', 'Coastal route to Galle'),
(3, 'Colombo', 'Kandy', '09:00:00', '12:00:00', 1200.00, 'ACTIVE', 'Hill country route to Kandy');

-- Insert sample buses
INSERT IGNORE INTO buses (id, bus_name, registration_number, seating_capacity, owner_id, status) VALUES
(1, 'Express Bus 001', 'WP-AB-1234', 45, 3, 'APPROVED'),
(2, 'Luxury Coach 002', 'WP-CD-5678', 50, 3, 'APPROVED'),
(3, 'VIP Bus 003', 'WP-EF-9012', 35, 3, 'APPROVED');

-- Insert sample bookings to show occupied seats
INSERT IGNORE INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'John Doe', 'john.doe@email.com', '+94771234567', '123456789V', 2, '["A1", "A2"]', 3600.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 1, 1, 'Jane Smith', 'jane.smith@email.com', '+94771234568', '987654321V', 1, '["B1"]', 1800.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Create a view to show seat availability
CREATE OR REPLACE VIEW seat_availability AS
SELECT 
    r.id as route_id,
    r.from_location,
    r.to_location,
    bus.id as bus_id,
    bus.bus_name,
    bus.registration_number,
    bus.seating_capacity,
    COALESCE(SUM(b.number_of_seats), 0) as booked_seats,
    (bus.seating_capacity - COALESCE(SUM(b.number_of_seats), 0)) as available_seats
FROM routes r
CROSS JOIN buses bus
LEFT JOIN bookings b ON b.route_id = r.id AND b.bus_id = bus.id AND b.booking_status = 'CONFIRMED'
GROUP BY r.id, r.from_location, r.to_location, bus.id, bus.bus_name, bus.registration_number, bus.seating_capacity;

-- Display results
SELECT 'Database setup completed successfully!' as message;
SELECT 'Sample data inserted:' as info;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as route_count FROM routes;
SELECT COUNT(*) as bus_count FROM buses;
SELECT COUNT(*) as booking_count FROM bookings;

-- Show seat availability
SELECT 'Current seat availability:' as info;
SELECT * FROM seat_availability WHERE route_id = 1 AND bus_id = 1;

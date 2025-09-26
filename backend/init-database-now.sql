-- Quick Database Initialization
-- Run this in your MySQL database to fix the booking system
-- Make sure MySQL is running on port 3307

USE highway_express_db;

-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM bookings;
-- DELETE FROM routes;
-- DELETE FROM buses;
-- DELETE FROM users;

-- Insert sample users
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'John', 'Doe', 'john.doe@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V'),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '+94771234568', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '987654321V'),
(3, 'Bus', 'Owner', 'bus.owner@email.com', '+94771234569', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'OWNER', '456789123V');

-- Insert sample buses
INSERT IGNORE INTO buses (id, bus_name, registration_number, seating_capacity, owner_id, status) VALUES
(1, 'Express Bus 1', 'ABC-1234', 40, 3, 'APPROVED'),
(2, 'Comfort Bus 2', 'XYZ-5678', 35, 3, 'APPROVED'),
(3, 'Luxury Bus 3', 'DEF-9012', 45, 3, 'APPROVED');

-- Insert sample routes
INSERT IGNORE INTO routes (id, from_location, to_location, departure_time, arrival_time, ticket_price, status) VALUES
(1, 'Colombo', 'Kandy', '08:00:00', '11:00:00', 1800.00, 'ACTIVE'),
(2, 'Colombo', 'Galle', '14:00:00', '17:30:00', 1200.00, 'ACTIVE'),
(3, 'Kandy', 'Jaffna', '06:00:00', '12:00:00', 2500.00, 'ACTIVE');

-- Check the data
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

SELECT 'Database initialization completed successfully!' AS Message;

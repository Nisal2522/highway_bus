-- Quick Database Test and Setup
-- Run this to check if the database has the required data

USE highway_express_db;

-- Check if tables exist and have data
SELECT 'Users Table:' as Info;
SELECT COUNT(*) as UserCount FROM users;

SELECT 'Routes Table:' as Info;
SELECT COUNT(*) as RouteCount FROM routes;

SELECT 'Buses Table:' as Info;
SELECT COUNT(*) as BusCount FROM buses;

SELECT 'Bookings Table:' as Info;
SELECT COUNT(*) as BookingCount FROM bookings;

-- Show sample data
SELECT 'Sample Users:' as Info;
SELECT id, first_name, last_name, email, user_type FROM users LIMIT 3;

SELECT 'Sample Routes:' as Info;
SELECT id, from_location, to_location, ticket_price FROM routes LIMIT 3;

SELECT 'Sample Buses:' as Info;
SELECT id, bus_name, registration_number, seating_capacity FROM buses LIMIT 3;

-- If no data exists, insert basic data
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'John', 'Doe', 'john.doe@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V'),
(2, 'Jane', 'Smith', 'jane.smith@email.com', '+94771234568', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '987654321V'),
(3, 'Bus', 'Owner', 'bus.owner@email.com', '+94771234569', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'BUS_OWNER', '456789123V');

INSERT IGNORE INTO buses (id, bus_name, registration_number, seating_capacity, owner_id, status) VALUES
(1, 'Express Bus 1', 'ABC-1234', 40, 3, 'APPROVED'),
(2, 'Comfort Bus 2', 'XYZ-5678', 35, 3, 'APPROVED'),
(3, 'Luxury Bus 3', 'DEF-9012', 45, 3, 'APPROVED');

INSERT IGNORE INTO routes (id, from_location, to_location, departure_time, arrival_time, ticket_price, status) VALUES
(1, 'Colombo', 'Kandy', '08:00:00', '11:00:00', 1800.00, 'ACTIVE'),
(2, 'Colombo', 'Galle', '14:00:00', '17:30:00', 1200.00, 'ACTIVE'),
(3, 'Kandy', 'Jaffna', '06:00:00', '12:00:00', 2500.00, 'ACTIVE');

SELECT 'Database test completed!' AS Message;

-- Setup Test Data for User Bookings API
USE highway_express_db;

-- Check current state
SELECT 'Current Database State:' as info;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as booking_count FROM bookings;
SELECT COUNT(*) as route_count FROM routes;
SELECT COUNT(*) as bus_count FROM buses;

-- Create test user if not exists
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'Test', 'User', 'test@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V');

-- Create test route if not exists
INSERT IGNORE INTO routes (id, from_location, to_location, departure_time, arrival_time, ticket_price, status) VALUES
(1, 'Colombo', 'Kandy', '08:00:00', '12:00:00', 500.00, 'ACTIVE'),
(2, 'Kandy', 'Colombo', '14:00:00', '18:00:00', 500.00, 'ACTIVE');

-- Create test bus if not exists
INSERT IGNORE INTO buses (id, bus_name, registration_number, seating_capacity, owner_id, status) VALUES
(1, 'Test Bus 1', 'TEST-001', 40, 1, 'APPROVED'),
(2, 'Test Bus 2', 'TEST-002', 35, 1, 'APPROVED');

-- Create test bookings for user 1
INSERT IGNORE INTO bookings (id, user_id, route_id, bus_id, passenger_name, passenger_email, passenger_phone, passenger_nic, number_of_seats, selected_seats, total_price, booking_status, booking_date, travel_date) VALUES
(1, 1, 1, 1, 'Test User', 'test@email.com', '+94771234567', '123456789V', 2, '[1, 2]', 1000.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 1, 2, 2, 'Test User', 'test@email.com', '+94771234567', '123456789V', 1, '[5]', 500.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY));

-- Verify data was created
SELECT 'After Setup:' as info;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as booking_count FROM bookings;
SELECT COUNT(*) as route_count FROM routes;
SELECT COUNT(*) as bus_count FROM buses;

-- Show user 1 details
SELECT 'User 1 Details:' as info;
SELECT id, first_name, last_name, email, user_type FROM users WHERE id = 1;

-- Show bookings for user 1
SELECT 'Bookings for User 1:' as info;
SELECT 
    b.id as booking_id,
    b.passenger_name,
    b.passenger_email,
    b.number_of_seats,
    b.selected_seats,
    b.total_price,
    b.booking_status,
    b.booking_date,
    r.from_location,
    r.to_location,
    bus.bus_name
FROM bookings b
LEFT JOIN routes r ON b.route_id = r.id
LEFT JOIN buses bus ON b.bus_id = bus.id
WHERE b.user_id = 1
ORDER BY b.booking_date DESC;

-- Test the exact query that the API will use
SELECT 'API Query Test:' as info;
SELECT b.* FROM bookings b 
JOIN users u ON b.user_id = u.id 
WHERE u.id = 1;

USE highway_express_db;

-- Ensure basic data exists for testing
-- Insert user if not exists
INSERT IGNORE INTO users (id, username, email, password, user_type, created_at, updated_at) 
VALUES (1, 'testuser', 'test@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', NOW(), NOW());

-- Insert route if not exists  
INSERT IGNORE INTO routes (id, origin, destination, distance, ticket_price, duration, created_at, updated_at)
VALUES (1, 'Colombo', 'Kandy', 120.5, 1800.00, 180, NOW(), NOW());

-- Insert bus if not exists
INSERT IGNORE INTO buses (id, bus_number, seating_capacity, bus_type, status, created_at, updated_at)
VALUES (1, 'BUS-001', 45, 'AC', 'ACTIVE', NOW(), NOW());

-- Check if data exists
SELECT 'Users:' as Table_Name, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Routes:', COUNT(*) FROM routes  
UNION ALL
SELECT 'Buses:', COUNT(*) FROM buses
UNION ALL
SELECT 'Bookings:', COUNT(*) FROM bookings;

-- Show current bookings
SELECT 
    id,
    passenger_name,
    selected_seats,
    booking_status,
    booking_date
FROM bookings 
ORDER BY booking_date DESC;

SELECT 'Basic data ensured successfully!' AS Message;

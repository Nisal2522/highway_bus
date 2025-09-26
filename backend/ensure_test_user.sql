-- Ensure Test User Exists for ViewBooking Testing
USE highway_express_db;

-- Check if user with ID 1 exists
SELECT COUNT(*) as user_count FROM users WHERE id = 1;

-- Insert test user if not exists
INSERT IGNORE INTO users (id, first_name, last_name, email, phone, password, user_type, id_number) VALUES
(1, 'Test', 'User', 'test@email.com', '+94771234567', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'PASSENGER', '123456789V');

-- Verify user exists
SELECT id, first_name, last_name, email, user_type FROM users WHERE id = 1;

-- Check if we have any bookings for this user
SELECT COUNT(*) as booking_count FROM bookings WHERE user_id = 1;

-- Show all bookings for user 1
SELECT 
    b.id as booking_id,
    b.passenger_name,
    b.passenger_email,
    b.number_of_seats,
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

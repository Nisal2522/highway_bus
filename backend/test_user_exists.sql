-- Test if user with ID 1 exists
USE highway_express_db;

SELECT 'Testing User Existence:' as info;

-- Check if user 1 exists
SELECT 
    id, 
    first_name, 
    last_name, 
    email, 
    user_type,
    CASE 
        WHEN id = 1 THEN '✅ User 1 EXISTS'
        ELSE '❌ User 1 NOT FOUND'
    END as status
FROM users 
WHERE id = 1;

-- Check all users
SELECT 'All Users in Database:' as info;
SELECT id, first_name, last_name, email, user_type FROM users ORDER BY id;

-- Check if user 1 has any bookings
SELECT 'Bookings for User 1:' as info;
SELECT 
    b.id as booking_id,
    b.user_id,
    b.passenger_name,
    b.number_of_seats,
    b.booking_status,
    b.booking_date
FROM bookings b 
WHERE b.user_id = 1;

-- If no bookings found, show all bookings
SELECT 'All Bookings (if user 1 has none):' as info;
SELECT 
    b.id as booking_id,
    b.user_id,
    b.passenger_name,
    b.number_of_seats,
    b.booking_status
FROM bookings b 
ORDER BY b.user_id, b.booking_date DESC
LIMIT 10;

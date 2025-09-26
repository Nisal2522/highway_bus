USE highway_express_db;

-- Simple method: Remove only the "Red Occupied Seats" booking
-- This should work in safe mode since we're targeting a specific passenger name

-- First, show what we're about to delete
SELECT 
    id,
    passenger_name,
    selected_seats,
    booking_status,
    booking_date
FROM bookings 
WHERE passenger_name = 'Red Occupied Seats';

-- Delete the red seats booking
DELETE FROM bookings 
WHERE passenger_name = 'Red Occupied Seats';

-- Show remaining bookings
SELECT 
    id,
    passenger_name,
    selected_seats,
    booking_status,
    booking_date
FROM bookings 
ORDER BY booking_date DESC;

-- Show count of remaining bookings
SELECT COUNT(*) as remaining_bookings FROM bookings;

SELECT 'Red seats removed successfully! Red seats are now available.' AS Message;

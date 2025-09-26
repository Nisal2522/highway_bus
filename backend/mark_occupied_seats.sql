-- Mark specific seats as occupied based on the red seats shown in the image
-- This script will create bookings for the occupied seats

USE highway_express_db;

-- First, let's see what seats are currently occupied
SELECT 'Current occupied seats:' as info;
SELECT 
    b.id,
    b.passenger_name,
    b.selected_seats,
    b.booking_status
FROM bookings b 
WHERE b.bus_id = 1 AND b.route_id = 1 AND b.booking_status = 'CONFIRMED';

-- Now let's mark the specific seats as occupied based on the red seats from the image
-- Red seats from the image: 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35

-- Create a system booking for all the occupied seats
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'System Occupied Seats', 'system@occupied.com', '+94770000000', 'SYSTEM001', 13, 
 '["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]', 
 0.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Verify the occupied seats
SELECT 'Updated occupied seats:' as info;
SELECT 
    b.id,
    b.passenger_name,
    b.selected_seats,
    b.booking_status,
    b.number_of_seats
FROM bookings b 
WHERE b.bus_id = 1 AND b.route_id = 1 AND b.booking_status = 'CONFIRMED'
ORDER BY b.id;

-- Show seat availability summary
SELECT 'Seat availability summary:' as info;
SELECT 
    bus.bus_name,
    bus.seating_capacity,
    COALESCE(SUM(b.number_of_seats), 0) as total_booked_seats,
    (bus.seating_capacity - COALESCE(SUM(b.number_of_seats), 0)) as available_seats
FROM buses bus
LEFT JOIN bookings b ON b.bus_id = bus.id AND b.route_id = 1 AND b.booking_status = 'CONFIRMED'
WHERE bus.id = 1
GROUP BY bus.id, bus.bus_name, bus.seating_capacity;

-- Show all occupied seat numbers
SELECT 'All occupied seat numbers:' as info;
SELECT 
    SUBSTRING_INDEX(SUBSTRING_INDEX(b.selected_seats, '"', 2*n-1), '"', -1) as seat_number
FROM bookings b
CROSS JOIN (
    SELECT 1 as n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
) numbers
WHERE b.bus_id = 1 AND b.route_id = 1 AND b.booking_status = 'CONFIRMED'
AND CHAR_LENGTH(b.selected_seats) - CHAR_LENGTH(REPLACE(b.selected_seats, '"', '')) >= 2*n-1
AND SUBSTRING_INDEX(SUBSTRING_INDEX(b.selected_seats, '"', 2*n-1), '"', -1) != ''
ORDER BY CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(b.selected_seats, '"', 2*n-1), '"', -1) AS UNSIGNED);

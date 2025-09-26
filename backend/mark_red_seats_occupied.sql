-- Mark the red seats from the image as occupied
-- Red seats: 3, 6, 7, 10, 13, 14, 15, 18, 26, 28, 32, 33, 35

USE highway_express_db;

-- Insert a booking for all the red occupied seats
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'Red Occupied Seats', 'red.seats@occupied.com', '+94770000001', 'RED001', 13, 
 '["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]', 
 0.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Show the updated bookings
SELECT 'Updated bookings with red seats:' as info;
SELECT 
    id,
    passenger_name,
    selected_seats,
    number_of_seats,
    booking_status
FROM bookings 
WHERE bus_id = 1 AND route_id = 1 
ORDER BY id;

-- Show total occupied seats
SELECT 'Total occupied seats count:' as info;
SELECT 
    SUM(number_of_seats) as total_occupied_seats
FROM bookings 
WHERE bus_id = 1 AND route_id = 1 AND booking_status = 'CONFIRMED';

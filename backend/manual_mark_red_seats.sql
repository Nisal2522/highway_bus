-- Copy and paste this into MySQL Workbench to mark red seats as occupied

USE highway_express_db;

-- Mark the red seats as occupied
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'Red Occupied Seats', 'red.seats@occupied.com', '+94770000001', 'RED001', 13, 
 '["3", "6", "7", "10", "13", "14", "15", "18", "26", "28", "32", "33", "35"]', 
 0.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

-- Check the result
SELECT 'Red seats marked as occupied!' as message;
SELECT 
    id,
    passenger_name,
    selected_seats,
    number_of_seats
FROM bookings 
WHERE bus_id = 1 AND route_id = 1 
ORDER BY id;

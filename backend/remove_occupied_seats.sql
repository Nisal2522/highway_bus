USE highway_express_db;

-- Remove all occupied seat bookings (including red seats and test bookings)
DELETE FROM bookings 
WHERE passenger_name IN (
    'Red Occupied Seats',
    'System Occupied',
    'Test User',
    'John Doe',
    'Jane Smith'
);

-- Alternative: Remove specific seat bookings by seat numbers
-- DELETE FROM bookings 
-- WHERE selected_seats LIKE '%"3"%' 
--    OR selected_seats LIKE '%"6"%' 
--    OR selected_seats LIKE '%"7"%' 
--    OR selected_seats LIKE '%"10"%' 
--    OR selected_seats LIKE '%"13"%' 
--    OR selected_seats LIKE '%"14"%' 
--    OR selected_seats LIKE '%"15"%' 
--    OR selected_seats LIKE '%"18"%' 
--    OR selected_seats LIKE '%"26"%' 
--    OR selected_seats LIKE '%"28"%' 
--    OR selected_seats LIKE '%"32"%' 
--    OR selected_seats LIKE '%"33"%' 
--    OR selected_seats LIKE '%"35"%'
--    OR selected_seats LIKE '%"A1"%'
--    OR selected_seats LIKE '%"A2"%'
--    OR selected_seats LIKE '%"B1"%';

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

SELECT 'Occupied seats removed successfully! All seats are now available.' AS Message;

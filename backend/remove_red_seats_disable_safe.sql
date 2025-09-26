USE highway_express_db;

-- Temporarily disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Now we can delete without using KEY column
DELETE FROM bookings 
WHERE passenger_name = 'Red Occupied Seats'
   OR (passenger_name = 'System Occupied' 
       AND selected_seats LIKE '%"3"%'
       AND selected_seats LIKE '%"6"%'
       AND selected_seats LIKE '%"7"%'
       AND selected_seats LIKE '%"10"%'
       AND selected_seats LIKE '%"13"%'
       AND selected_seats LIKE '%"14"%'
       AND selected_seats LIKE '%"15"%'
       AND selected_seats LIKE '%"18"%'
       AND selected_seats LIKE '%"26"%'
       AND selected_seats LIKE '%"28"%'
       AND selected_seats LIKE '%"32"%'
       AND selected_seats LIKE '%"33"%'
       AND selected_seats LIKE '%"35"%');

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

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

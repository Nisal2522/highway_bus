USE highway_express_db;

-- Safe method to remove red seats using primary key
-- First, find the booking IDs to delete
SELECT 
    id,
    passenger_name,
    selected_seats,
    booking_status
FROM bookings 
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

-- Now delete using the primary key (this will work in safe mode)
DELETE FROM bookings 
WHERE id IN (
    SELECT id FROM (
        SELECT id FROM bookings 
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
               AND selected_seats LIKE '%"35"%')
    ) AS temp_table
);

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

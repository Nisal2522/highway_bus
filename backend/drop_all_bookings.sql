USE highway_express_db;

-- Drop all bookings from the table
DELETE FROM bookings;

-- Show the result
SELECT COUNT(*) as remaining_bookings FROM bookings;

-- Show all remaining bookings (should be 0)
SELECT * FROM bookings;

SELECT 'All bookings dropped successfully! Table is now empty.' AS Message;

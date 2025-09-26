USE highway_express_db;

-- Method 1: Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Now delete all bookings
DELETE FROM bookings;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Show the result
SELECT COUNT(*) as remaining_bookings FROM bookings;

SELECT 'All bookings dropped successfully! Table is now empty.' AS Message;

USE highway_express_db;

-- Method 2: Use WHERE clause with primary key (safe mode compatible)
-- First, get all booking IDs
SELECT id FROM bookings;

-- Delete using WHERE clause with primary key
DELETE FROM bookings WHERE id > 0;

-- Alternative: Delete using specific IDs (if you know them)
-- DELETE FROM bookings WHERE id IN (1, 2, 3);

-- Show the result
SELECT COUNT(*) as remaining_bookings FROM bookings;

SELECT 'All bookings dropped successfully! Table is now empty.' AS Message;

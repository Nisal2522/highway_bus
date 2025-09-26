@echo off
echo Adding status column to users table...
echo.

echo Please run this SQL in your MySQL client:
echo.
echo USE highway_express_db;
echo ALTER TABLE users ADD COLUMN status ENUM('ACTIVE', 'INACTIVE', 'PENDING') DEFAULT 'ACTIVE';
echo UPDATE users SET status = 'ACTIVE' WHERE status IS NULL;
echo.

echo Or if you have MySQL command line available, run:
echo mysql -u root -p ^< add_status_column.sql
echo.

pause

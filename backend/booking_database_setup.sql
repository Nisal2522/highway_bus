-- Booking Database Setup Script
-- This script creates the bookings table and related indexes

-- Select the database (adjust the database name as needed)
USE highway_express;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_nic VARCHAR(50),
    number_of_seats INT NOT NULL CHECK (number_of_seats > 0),
    selected_seats TEXT,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    booking_status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING_PAYMENT') NOT NULL DEFAULT 'CONFIRMED',
    booking_date DATETIME NOT NULL,
    travel_date DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_user_id (user_id),
    INDEX idx_route_id (route_id),
    INDEX idx_bus_id (bus_id),
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_date (booking_date),
    INDEX idx_travel_date (travel_date),
    INDEX idx_passenger_email (passenger_email),
    INDEX idx_passenger_phone (passenger_phone),
    INDEX idx_created_at (created_at)
);

-- Create a view for booking summary
CREATE OR REPLACE VIEW booking_summary AS
SELECT 
    b.id,
    b.passenger_name,
    b.passenger_email,
    b.passenger_phone,
    b.number_of_seats,
    b.total_price,
    b.booking_status,
    b.booking_date,
    b.travel_date,
    r.from_location,
    r.to_location,
    r.departure_time,
    r.arrival_time,
    bus.bus_name,
    bus.registration_number,
    u.first_name as user_first_name,
    u.last_name as user_last_name
FROM bookings b
JOIN routes r ON b.route_id = r.id
JOIN buses bus ON b.bus_id = bus.id
JOIN users u ON b.user_id = u.id;

-- Create a view for seat availability
CREATE OR REPLACE VIEW seat_availability AS
SELECT 
    r.id as route_id,
    bus.id as bus_id,
    bus.bus_name,
    bus.registration_number,
    bus.seating_capacity,
    COALESCE(SUM(b.number_of_seats), 0) as booked_seats,
    (bus.seating_capacity - COALESCE(SUM(b.number_of_seats), 0)) as available_seats
FROM routes r
CROSS JOIN buses bus
LEFT JOIN bookings b ON b.route_id = r.id AND b.bus_id = bus.id AND b.booking_status = 'CONFIRMED'
GROUP BY r.id, bus.id, bus.bus_name, bus.registration_number, bus.seating_capacity;

-- Insert sample data for testing (optional)
-- Note: Make sure you have existing users, routes, and buses before running this

-- Sample booking data (uncomment if you want to insert test data)
/*
INSERT INTO bookings (
    user_id, route_id, bus_id, passenger_name, passenger_email, 
    passenger_phone, passenger_nic, number_of_seats, selected_seats, 
    total_price, booking_status, booking_date, travel_date
) VALUES 
(1, 1, 1, 'John Doe', 'john.doe@email.com', '+94771234567', '123456789V', 2, '["A1", "A2"]', 1800.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 1, 1, 'Jane Smith', 'jane.smith@email.com', '+94771234568', '987654321V', 1, '["B1"]', 900.00, 'CONFIRMED', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
*/

-- Create stored procedure for booking validation
DELIMITER //
CREATE PROCEDURE ValidateBooking(
    IN p_user_id BIGINT,
    IN p_route_id BIGINT,
    IN p_bus_id BIGINT,
    IN p_number_of_seats INT,
    OUT p_available_seats INT,
    OUT p_is_valid BOOLEAN
)
BEGIN
    DECLARE total_capacity INT;
    DECLARE booked_seats INT;
    
    -- Get bus capacity
    SELECT seating_capacity INTO total_capacity 
    FROM buses 
    WHERE id = p_bus_id;
    
    -- Get booked seats for this bus and route
    SELECT COALESCE(SUM(number_of_seats), 0) INTO booked_seats
    FROM bookings 
    WHERE bus_id = p_bus_id 
    AND route_id = p_route_id 
    AND booking_status = 'CONFIRMED';
    
    -- Calculate available seats
    SET p_available_seats = total_capacity - booked_seats;
    
    -- Check if booking is valid
    SET p_is_valid = (p_available_seats >= p_number_of_seats);
END //
DELIMITER ;

-- Create trigger to update seat availability
DELIMITER //
CREATE TRIGGER update_seat_availability_after_booking
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    -- Log the booking for audit purposes
    INSERT INTO booking_audit_log (booking_id, action, timestamp, details)
    VALUES (NEW.id, 'BOOKING_CREATED', NOW(), 
            CONCAT('Seats booked: ', NEW.number_of_seats, ' for route: ', NEW.route_id, ' bus: ', NEW.bus_id));
END //
DELIMITER ;

-- Create audit log table for booking changes
CREATE TABLE IF NOT EXISTS booking_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    action VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_timestamp (timestamp)
);

-- Grant permissions (adjust as needed for your database setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO 'your_app_user'@'localhost';
-- GRANT SELECT ON booking_summary TO 'your_app_user'@'localhost';
-- GRANT SELECT ON seat_availability TO 'your_app_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE ValidateBooking TO 'your_app_user'@'localhost';

-- Display success message
SELECT 'Booking database setup completed successfully!' as message;

-- Bus Database Setup Script for Highway Express
-- This script creates the buses table and related structures

USE highway_express_db;

-- Create buses table
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    seating_capacity INT NOT NULL CHECK (seating_capacity >= 1 AND seating_capacity <= 100),
    bus_book_copy_url VARCHAR(500),
    owner_id_copy_url VARCHAR(500),
    owner_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for better performance
    INDEX idx_registration_number (registration_number),
    INDEX idx_owner_id (owner_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Insert sample bus data (optional - for testing)
INSERT INTO buses (bus_name, registration_number, seating_capacity, owner_id, status) VALUES
('Express Deluxe', 'ABC-1234', 45, 1, 'PENDING'),
('Comfort Plus', 'XYZ-5678', 52, 1, 'APPROVED'),
('Premium Coach', 'DEF-9012', 38, 1, 'ACTIVE');

-- Create view for bus information with owner details
CREATE OR REPLACE VIEW bus_info AS
SELECT 
    b.id,
    b.bus_name,
    b.registration_number,
    b.seating_capacity,
    b.bus_book_copy_url,
    b.owner_id_copy_url,
    b.owner_id,
    CONCAT(u.first_name, ' ', u.last_name) AS owner_name,
    u.email AS owner_email,
    u.phone AS owner_phone,
    b.status,
    b.created_at,
    b.updated_at
FROM buses b
JOIN users u ON b.owner_id = u.id;

-- Create stored procedure for getting buses by owner
DELIMITER //
CREATE PROCEDURE GetBusesByOwner(IN ownerId BIGINT)
BEGIN
    SELECT 
        b.id,
        b.bus_name,
        b.registration_number,
        b.seating_capacity,
        b.bus_book_copy_url,
        b.owner_id_copy_url,
        b.owner_id,
        CONCAT(u.first_name, ' ', u.last_name) AS owner_name,
        b.status,
        b.created_at,
        b.updated_at
    FROM buses b
    JOIN users u ON b.owner_id = u.id
    WHERE b.owner_id = ownerId
    ORDER BY b.created_at DESC;
END //
DELIMITER ;

-- Create stored procedure for getting buses by status
DELIMITER //
CREATE PROCEDURE GetBusesByStatus(IN busStatus VARCHAR(20))
BEGIN
    SELECT 
        b.id,
        b.bus_name,
        b.registration_number,
        b.seating_capacity,
        b.bus_book_copy_url,
        b.owner_id_copy_url,
        b.owner_id,
        CONCAT(u.first_name, ' ', u.last_name) AS owner_name,
        b.status,
        b.created_at,
        b.updated_at
    FROM buses b
    JOIN users u ON b.owner_id = u.id
    WHERE b.status = busStatus
    ORDER BY b.created_at DESC;
END //
DELIMITER ;

-- Create trigger to update updated_at timestamp
DELIMITER //
CREATE TRIGGER update_bus_timestamp
BEFORE UPDATE ON buses
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON buses TO 'your_app_user'@'localhost';
-- GRANT SELECT ON bus_info TO 'your_app_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE GetBusesByOwner TO 'your_app_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE GetBusesByStatus TO 'your_app_user'@'localhost';

-- Show table structure
DESCRIBE buses;

-- Show sample data
SELECT * FROM bus_info LIMIT 5;

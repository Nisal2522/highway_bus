-- Create database (if not using createDatabaseIfNotExist=true in application.properties)
-- CREATE DATABASE IF NOT EXISTS highway_express_db;
-- USE highway_express_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('PASSENGER', 'OWNER') NOT NULL,
    id_number VARCHAR(50),
    company_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for better performance
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_id_number (id_number),
    INDEX idx_company_name (company_name)
);

-- Insert sample data (optional)
INSERT INTO users (first_name, last_name, email, phone, password, user_type, id_number, company_name) VALUES
('John', 'Doe', 'john.doe@example.com', '+1234567890', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'PASSENGER', 'ID123456', NULL),
('Jane', 'Smith', 'jane.smith@example.com', '+1234567891', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'OWNER', NULL, 'Express Bus Company');

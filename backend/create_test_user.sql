-- Create a test user with first_name and last_name for testing full name functionality
USE highway_express;

-- Insert a test user if not exists
INSERT IGNORE INTO users (
    first_name, 
    last_name, 
    email, 
    phone, 
    password, 
    user_type, 
    id_number, 
    created_at, 
    updated_at
) VALUES (
    'John',
    'Doe',
    'test@email.com',
    '1234567890',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', -- password: "password"
    'PASSENGER',
    '123456789V',
    NOW(),
    NOW()
);

-- Verify the user was created
SELECT 
    id,
    first_name,
    last_name,
    CONCAT(first_name, ' ', last_name) AS full_name_combined,
    email,
    phone,
    id_number,
    user_type
FROM users 
WHERE email = 'test@email.com';

-- Test the getFullName() method by checking if we can combine names
SELECT 
    id,
    first_name,
    last_name,
    CASE 
        WHEN first_name IS NULL AND last_name IS NULL THEN ''
        WHEN first_name IS NULL THEN last_name
        WHEN last_name IS NULL THEN first_name
        ELSE CONCAT(first_name, ' ', last_name)
    END AS full_name_logic
FROM users 
WHERE email = 'test@email.com';

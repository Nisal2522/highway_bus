-- Test ID Number (NIC) mapping verification
USE highway_express;

-- Create a test user with id_number for testing
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

-- Verify the user was created with id_number
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    id_number,
    user_type,
    'This id_number should map to NIC field in frontend' AS mapping_note
FROM users 
WHERE email = 'test@email.com';

-- Test the full name combination
SELECT 
    id,
    first_name,
    last_name,
    CONCAT(first_name, ' ', last_name) AS full_name_combined,
    id_number,
    'Full name should auto-fill in frontend' AS auto_fill_note
FROM users 
WHERE email = 'test@email.com';

package com.highwayexpress.backend.service;

import com.highwayexpress.backend.dto.UserRegistrationDto;
import com.highwayexpress.backend.dto.LoginDto;
import com.highwayexpress.backend.model.User;
import com.highwayexpress.backend.model.UserType;
import com.highwayexpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Map<String, Object> registerUser(UserRegistrationDto registrationDto) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        // Validate user type
        UserType userType;
        try {
            userType = UserType.valueOf(registrationDto.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            errors.put("userType", "Invalid user type. Must be PASSENGER or OWNER");
            response.put("errors", errors);
            return response;
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            errors.put("email", "Email already registered");
        }
        
        // Validate passenger-specific fields
        if (userType == UserType.PASSENGER) {
            if (registrationDto.getIdNumber() == null || registrationDto.getIdNumber().trim().isEmpty()) {
                errors.put("idNumber", "ID number is required for passengers");
            } else if (userRepository.existsByIdNumber(registrationDto.getIdNumber())) {
                errors.put("idNumber", "ID number already registered");
            }
        }
        
        // Validate owner-specific fields
        if (userType == UserType.OWNER) {
            if (registrationDto.getCompanyName() == null || registrationDto.getCompanyName().trim().isEmpty()) {
                errors.put("companyName", "Company name is required for bus owners");
            } else if (userRepository.existsByCompanyName(registrationDto.getCompanyName())) {
                errors.put("companyName", "Company name already registered");
            }
        }
        
        // If there are validation errors, return them
        if (!errors.isEmpty()) {
            response.put("errors", errors);
            return response;
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(registrationDto.getFirstName());
        user.setLastName(registrationDto.getLastName());
        user.setEmail(registrationDto.getEmail());
        user.setPhone(registrationDto.getPhone());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setUserType(userType);
        
        if (userType == UserType.PASSENGER) {
            user.setIdNumber(registrationDto.getIdNumber());
        } else {
            user.setCompanyName(registrationDto.getCompanyName());
        }
        
        // Save user to database
        User savedUser = userRepository.save(user);
        
        // Return success response
        response.put("success", true);
        response.put("message", "User registered successfully");
        
        Map<String, Object> data = new HashMap<>();
        data.put("userId", savedUser.getId());
        data.put("userType", savedUser.getUserType().toString());
        data.put("firstName", savedUser.getFirstName());
        data.put("lastName", savedUser.getLastName());
        data.put("email", savedUser.getEmail());
        data.put("phone", savedUser.getPhone());
        data.put("token", "dummy-token-" + System.currentTimeMillis()); // Placeholder token
        
        response.put("data", data);
        
        return response;
    }
    
    public Map<String, Object> loginUser(LoginDto loginDto) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(loginDto.getEmail());
        
        if (!userOptional.isPresent()) {
            errors.put("email", "User not found with this email");
            response.put("errors", errors);
            return response;
        }
        
        User user = userOptional.get();
        
        // Verify password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            errors.put("password", "Invalid password");
            response.put("errors", errors);
            return response;
        }
        
        // Return success response
        response.put("success", true);
        response.put("message", "Login successful");
        
        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getId());
        data.put("userType", user.getUserType().toString());
        data.put("firstName", user.getFirstName());
        data.put("lastName", user.getLastName());
        data.put("email", user.getEmail());
        data.put("phone", user.getPhone());
        data.put("token", "dummy-token-" + System.currentTimeMillis()); // Placeholder token
        
        response.put("data", data);
        
        return response;
    }
    
    public Map<String, Object> updateUser(Map<String, Object> updateData) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        // Extract user ID from the update data
        Long userId = null;
        if (updateData.containsKey("userId")) {
            try {
                userId = Long.parseLong(updateData.get("userId").toString());
            } catch (NumberFormatException e) {
                errors.put("userId", "Invalid user ID");
                response.put("errors", errors);
                return response;
            }
        } else {
            errors.put("userId", "User ID is required");
            response.put("errors", errors);
            return response;
        }
        
        // Find user by ID
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            errors.put("userId", "User not found");
            response.put("errors", errors);
            return response;
        }
        
        User user = userOptional.get();
        
        // Update user fields if provided
        if (updateData.containsKey("firstName")) {
            user.setFirstName(updateData.get("firstName").toString());
        }
        
        if (updateData.containsKey("lastName")) {
            user.setLastName(updateData.get("lastName").toString());
        }
        
        if (updateData.containsKey("phone")) {
            user.setPhone(updateData.get("phone").toString());
        }
        
        // Handle password update
        if (updateData.containsKey("currentPassword")) {
            String currentPassword = updateData.get("currentPassword").toString();
            
            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                errors.put("currentPassword", "Current password is incorrect");
                response.put("errors", errors);
                return response;
            }
            
            // If new password is also provided, update it
            if (updateData.containsKey("newPassword")) {
                String newPassword = updateData.get("newPassword").toString();
                
                // Validate new password
                if (newPassword.length() < 6) {
                    errors.put("newPassword", "New password must be at least 6 characters long");
                    response.put("errors", errors);
                    return response;
                }
                
                // Update password
                user.setPassword(passwordEncoder.encode(newPassword));
            }
        }
        
        // Update user type specific fields
        if (user.getUserType() == UserType.PASSENGER && updateData.containsKey("idNumber")) {
            String newIdNumber = updateData.get("idNumber").toString();
            if (!newIdNumber.equals(user.getIdNumber()) && userRepository.existsByIdNumber(newIdNumber)) {
                errors.put("idNumber", "ID number already registered");
                response.put("errors", errors);
                return response;
            }
            user.setIdNumber(newIdNumber);
        }
        
        if (user.getUserType() == UserType.OWNER && updateData.containsKey("companyName")) {
            String newCompanyName = updateData.get("companyName").toString();
            if (!newCompanyName.equals(user.getCompanyName()) && userRepository.existsByCompanyName(newCompanyName)) {
                errors.put("companyName", "Company name already registered");
                response.put("errors", errors);
                return response;
            }
            user.setCompanyName(newCompanyName);
        }
        
        // If there are validation errors, return them
        if (!errors.isEmpty()) {
            response.put("errors", errors);
            return response;
        }
        
        // Save updated user
        User updatedUser = userRepository.save(user);
        
        // Return success response
        response.put("success", true);
        response.put("message", "User updated successfully");
        
        Map<String, Object> data = new HashMap<>();
        data.put("userId", updatedUser.getId());
        data.put("userType", updatedUser.getUserType().toString());
        data.put("firstName", updatedUser.getFirstName());
        data.put("lastName", updatedUser.getLastName());
        data.put("email", updatedUser.getEmail());
        data.put("phone", updatedUser.getPhone());
        data.put("idNumber", updatedUser.getIdNumber());
        data.put("companyName", updatedUser.getCompanyName());
        
        response.put("data", data);
        
        return response;
    }
    
    public Map<String, Object> debugPassword(String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                response.put("error", "User not found");
                return response;
            }
            
            User user = userOptional.get();
            String storedPassword = user.getPassword();
            boolean matches = passwordEncoder.matches(password, storedPassword);
            
            response.put("email", email);
            response.put("storedPasswordHash", storedPassword);
            response.put("inputPassword", password);
            response.put("matches", matches);
            response.put("passwordLength", password.length());
            response.put("hashLength", storedPassword.length());
            
            return response;
        } catch (Exception e) {
            response.put("error", "Debug failed: " + e.getMessage());
            return response;
        }
    }
    
    public Map<String, Object> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get all users from the database
            List<User> users = userRepository.findAll();
            
            // Calculate user type breakdown
            long passengerCount = users.stream()
                .filter(user -> user.getUserType() == UserType.PASSENGER)
                .count();
            
            long ownerCount = users.stream()
                .filter(user -> user.getUserType() == UserType.OWNER)
                .count();
            
            // Return success response with user count and breakdown
            response.put("success", true);
            response.put("message", "Users fetched successfully");
            response.put("data", users);
            response.put("totalCount", users.size());
            response.put("passengerCount", passengerCount);
            response.put("ownerCount", ownerCount);
            
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("errors", Map.of("message", "Failed to fetch users: " + e.getMessage()));
            return response;
        }
    }
}

package com.highwayexpress.backend.controller;

import com.highwayexpress.backend.dto.UserRegistrationDto;
import com.highwayexpress.backend.dto.LoginDto;
import com.highwayexpress.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/users/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto, 
                                        BindingResult bindingResult) {
        
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        
        // Process registration
        Map<String, Object> result = userService.registerUser(registrationDto);
        
        // Check if there are business logic errors
        if (result.containsKey("errors")) {
            return ResponseEntity.badRequest().body(result.get("errors"));
        }
        
        // Return success response
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginDto loginDto, 
                                     BindingResult bindingResult) {
        
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }
        
        // Process login
        Map<String, Object> result = userService.loginUser(loginDto);
        
        // Check if there are business logic errors
        if (result.containsKey("errors")) {
            return ResponseEntity.badRequest().body(result.get("errors"));
        }
        
        // Return success response
        return ResponseEntity.ok(result);
    }
    
    @PutMapping("/users/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, Object> updateData) {
        try {
            Map<String, Object> result = userService.updateUser(updateData);
            
            if (result.containsKey("errors")) {
                return ResponseEntity.badRequest().body(result.get("errors"));
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update user: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/users/debug-password")
    public ResponseEntity<?> debugPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
            }
            
            Map<String, Object> result = userService.debugPassword(email, password);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Debug failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            Map<String, Object> result = userService.getAllUsers();
            
            if (result.containsKey("errors")) {
                return ResponseEntity.badRequest().body(result.get("errors"));
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch users: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

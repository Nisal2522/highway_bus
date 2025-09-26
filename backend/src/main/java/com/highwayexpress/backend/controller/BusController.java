package com.highwayexpress.backend.controller;

import com.highwayexpress.backend.dto.BusRegistrationDto;
import com.highwayexpress.backend.dto.BusResponseDto;
import com.highwayexpress.backend.model.BusStatus;
import com.highwayexpress.backend.service.BusService;
import com.highwayexpress.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BusController {
    
    @Autowired
    private BusService busService;
    
    @Autowired
    private FileUploadService fileUploadService;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerBus(
            @RequestParam("busName") String busName,
            @RequestParam("registrationNumber") String registrationNumber,
            @RequestParam("seatingCapacity") Integer seatingCapacity,
            @RequestParam(value = "busBookCopy", required = false) MultipartFile busBookCopy,
            @RequestParam(value = "ownerIdCopy", required = false) MultipartFile ownerIdCopy,
            @RequestParam("ownerId") Long ownerId) {
        
        try {
            // Create DTO from form data
            BusRegistrationDto busRegistrationDto = new BusRegistrationDto();
            busRegistrationDto.setBusName(busName);
            busRegistrationDto.setRegistrationNumber(registrationNumber);
            busRegistrationDto.setSeatingCapacity(seatingCapacity);
            
            // Register bus
            BusResponseDto registeredBus = busService.registerBus(busRegistrationDto, busBookCopy, ownerIdCopy, ownerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bus registered successfully");
            response.put("data", registeredBus);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload files: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllBuses() {
        try {
            List<BusResponseDto> buses = busService.getAllBuses();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", buses);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve buses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/{busId}")
    public ResponseEntity<?> getBusById(@PathVariable Long busId) {
        try {
            BusResponseDto bus = busService.getBusById(busId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", bus);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve bus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingBuses() {
        try {
            List<BusResponseDto> pendingBuses = busService.getBusesByStatus(BusStatus.PENDING);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", pendingBuses);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve pending buses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getBusesByOwner(@PathVariable Long ownerId) {
        try {
            List<BusResponseDto> ownerBuses = busService.getBusesByOwner(ownerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", ownerBuses);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve owner buses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{busId}/approve")
    public ResponseEntity<?> approveBus(@PathVariable Long busId) {
        try {
            BusResponseDto approvedBus = busService.updateBusStatus(busId, BusStatus.APPROVED);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bus approved successfully");
            response.put("data", approvedBus);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to approve bus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{busId}/reject")
    public ResponseEntity<?> rejectBus(@PathVariable Long busId, @RequestBody(required = false) Map<String, String> requestBody) {
        try {
            String rejectionReason = requestBody != null ? requestBody.get("reason") : "Request rejected by admin";
            BusResponseDto rejectedBus = busService.updateBusStatus(busId, BusStatus.REJECTED, rejectionReason);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bus rejected successfully");
            response.put("data", rejectedBus);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to reject bus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getBusesByStatus(@PathVariable String status) {
        try {
            BusStatus busStatus = BusStatus.valueOf(status.toUpperCase());
            List<BusResponseDto> buses = busService.getBusesByStatus(busStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", buses);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid status: " + status);
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve buses: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{busId}/status")
    public ResponseEntity<?> updateBusStatus(
            @PathVariable Long busId,
            @RequestParam String status) {
        try {
            BusStatus busStatus = BusStatus.valueOf(status.toUpperCase());
            BusResponseDto updatedBus = busService.updateBusStatus(busId, busStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bus status updated successfully");
            response.put("data", updatedBus);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update bus status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{busId}")
    public ResponseEntity<?> deleteBus(@PathVariable Long busId) {
        try {
            busService.deleteBus(busId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bus deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete bus: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/check-registration/{registrationNumber}")
    public ResponseEntity<?> checkRegistrationNumber(@PathVariable String registrationNumber) {
        try {
            boolean exists = busService.existsByRegistrationNumber(registrationNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("exists", exists);
            response.put("message", exists ? "Registration number already exists" : "Registration number is available");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to check registration number: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/documents/{fileUrl}")
    public ResponseEntity<?> getDocument(@PathVariable String fileUrl) {
        try {
            // For Cloudinary, we return the URL directly since files are publicly accessible
            String decodedUrl = java.net.URLDecoder.decode(fileUrl, "UTF-8");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("url", decodedUrl);
            response.put("message", "Document URL retrieved successfully");
            
            return ResponseEntity.ok(response);
                    
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve document URL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

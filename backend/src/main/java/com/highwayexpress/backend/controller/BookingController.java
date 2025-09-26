package com.highwayexpress.backend.controller;

import com.highwayexpress.backend.model.Booking;
import com.highwayexpress.backend.model.BookingStatus;
import com.highwayexpress.backend.service.BookingService;
import com.highwayexpress.backend.dto.BookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            // Log the incoming request for debugging
            System.out.println("Received booking request: " + request.toString());
            
            // Validate required fields
            if (request.getUserId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("User ID is required"));
            }
            if (request.getRouteId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Route ID is required"));
            }
            if (request.getBusId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Bus ID is required"));
            }
            if (request.getPassengerName() == null || request.getPassengerName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Passenger name is required"));
            }
            if (request.getPassengerEmail() == null || request.getPassengerEmail().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Passenger email is required"));
            }
            if (request.getPassengerPhone() == null || request.getPassengerPhone().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Passenger phone is required"));
            }
            if (request.getNumberOfSeats() == null || request.getNumberOfSeats() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Number of seats must be greater than 0"));
            }
            
            Booking booking = bookingService.createBooking(
                request.getUserId(),
                request.getRouteId(),
                request.getBusId(),
                request.getPassengerName(),
                request.getPassengerEmail(),
                request.getPassengerPhone(),
                request.getPassengerNic(),
                request.getNumberOfSeats(),
                request.getSelectedSeats()
            );
            
            System.out.println("Booking created successfully with ID: " + booking.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
            
        } catch (RuntimeException e) {
            System.err.println("Booking creation failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error during booking creation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("An unexpected error occurred: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        try {
            List<BookingResponse> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to retrieve bookings: " + e.getMessage()));
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllBookingsAll() {
        try {
            List<BookingResponse> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to retrieve bookings: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            // Test database connectivity
            List<BookingResponse> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(new SuccessResponse("Booking service is healthy. Found " + bookings.size() + " bookings."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Booking service health check failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Booking not found"));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable Long userId) {
        try {
            System.out.println("=== BOOKING API DEBUG START ===");
            System.out.println("Received request for user bookings: " + userId);
            System.out.println("User ID type: " + (userId != null ? userId.getClass().getSimpleName() : "NULL"));
            
            List<BookingResponse> bookings = bookingService.getBookingsByUser(userId);
            
            System.out.println("Successfully retrieved " + bookings.size() + " bookings for user " + userId);
            System.out.println("=== BOOKING API DEBUG END ===");
            
            return ResponseEntity.ok(bookings);
            
        } catch (NullPointerException e) {
            System.err.println("NULL POINTER EXCEPTION in getBookingsByUser:");
            System.err.println("User ID: " + userId);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Null pointer exception: " + e.getMessage()));
                
        } catch (org.springframework.dao.DataAccessException e) {
            System.err.println("DATABASE ACCESS EXCEPTION in getBookingsByUser:");
            System.err.println("User ID: " + userId);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Database error: " + e.getMessage()));
                
        } catch (RuntimeException e) {
            System.err.println("RUNTIME EXCEPTION in getBookingsByUser:");
            System.err.println("User ID: " + userId);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Runtime error: " + e.getMessage()));
                
        } catch (Exception e) {
            System.err.println("UNEXPECTED EXCEPTION in getBookingsByUser:");
            System.err.println("User ID: " + userId);
            System.err.println("Exception type: " + e.getClass().getSimpleName());
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Unexpected error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/route/{routeId}")
    public ResponseEntity<?> getBookingsByRoute(@PathVariable Long routeId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByRoute(routeId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/bus/{busId}")
    public ResponseEntity<?> getBookingsByBus(@PathVariable Long busId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByBus(busId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/available-seats")
    public ResponseEntity<?> getAvailableSeats(@RequestParam Long busId, @RequestParam Long routeId) {
        try {
            Integer availableSeats = bookingService.getAvailableSeats(busId, routeId);
            return ResponseEntity.ok(new AvailableSeatsResponse(availableSeats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            BookingStatus status = BookingStatus.valueOf(request.getStatus().toUpperCase());
            Booking booking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok(new SuccessResponse("Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(new SuccessResponse("Booking deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Booking>> getRecentBookings() {
        List<Booking> bookings = bookingService.getRecentBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/today")
    public ResponseEntity<List<Booking>> getBookingsForToday() {
        List<Booking> bookings = bookingService.getBookingsForToday();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/occupied-seats")
    public ResponseEntity<?> getOccupiedSeats(@RequestParam Long busId, @RequestParam Long routeId) {
        try {
            List<String> occupiedSeats = bookingService.getOccupiedSeats(busId, routeId);
            return ResponseEntity.ok(new OccupiedSeatsResponse(occupiedSeats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/update-seat-status")
    public ResponseEntity<?> updateSeatStatus(@RequestBody SeatStatusUpdateRequest request) {
        try {
            bookingService.updateSeatStatus(request.getBusId(), request.getRouteId(), 
                                          request.getSeatNumbers(), request.getStatus());
            return ResponseEntity.ok(new SuccessResponse("Seat status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/seat-status")
    public ResponseEntity<?> getSeatStatus(@RequestParam Long busId, @RequestParam Long routeId) {
        try {
            SeatStatusResponse response = bookingService.getSeatStatus(busId, routeId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/refresh-seats")
    public ResponseEntity<?> refreshSeats(@RequestBody RefreshSeatsRequest request) {
        try {
            SeatStatusResponse response = bookingService.getSeatStatus(request.getBusId(), request.getRouteId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/clear-occupied-seats")
    public ResponseEntity<?> clearOccupiedSeats(@RequestParam Long busId, @RequestParam Long routeId) {
        try {
            int removedCount = bookingService.clearOccupiedSeats(busId, routeId);
            return ResponseEntity.ok(new SuccessResponse("Cleared " + removedCount + " occupied seat bookings"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/clear-all-test-bookings")
    public ResponseEntity<?> clearAllTestBookings() {
        try {
            int removedCount = bookingService.clearAllTestBookings();
            return ResponseEntity.ok(new SuccessResponse("Cleared " + removedCount + " test bookings"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // DTOs for request/response
    public static class BookingRequest {
        private Long userId;
        private Long routeId;
        private Long busId;
        private String passengerName;
        private String passengerEmail;
        private String passengerPhone;
        private String passengerNic;
        private Integer numberOfSeats;
        private String selectedSeats;
        
        // Getters and Setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public Long getRouteId() { return routeId; }
        public void setRouteId(Long routeId) { this.routeId = routeId; }
        
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public String getPassengerName() { return passengerName; }
        public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
        
        public String getPassengerEmail() { return passengerEmail; }
        public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
        
        public String getPassengerPhone() { return passengerPhone; }
        public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
        
        public String getPassengerNic() { return passengerNic; }
        public void setPassengerNic(String passengerNic) { this.passengerNic = passengerNic; }
        
        public Integer getNumberOfSeats() { return numberOfSeats; }
        public void setNumberOfSeats(Integer numberOfSeats) { this.numberOfSeats = numberOfSeats; }
        
        public String getSelectedSeats() { return selectedSeats; }
        public void setSelectedSeats(String selectedSeats) { this.selectedSeats = selectedSeats; }
        
        @Override
        public String toString() {
            return "BookingRequest{" +
                    "userId=" + userId +
                    ", routeId=" + routeId +
                    ", busId=" + busId +
                    ", passengerName='" + passengerName + '\'' +
                    ", passengerEmail='" + passengerEmail + '\'' +
                    ", passengerPhone='" + passengerPhone + '\'' +
                    ", passengerNic='" + passengerNic + '\'' +
                    ", numberOfSeats=" + numberOfSeats +
                    ", selectedSeats='" + selectedSeats + '\'' +
                    '}';
        }
    }
    
    public static class StatusUpdateRequest {
        private String status;
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
    
    public static class AvailableSeatsResponse {
        private Integer availableSeats;
        
        public AvailableSeatsResponse(Integer availableSeats) {
            this.availableSeats = availableSeats;
        }
        
        public Integer getAvailableSeats() { return availableSeats; }
        public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    }
    
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    public static class SuccessResponse {
        private String message;
        
        public SuccessResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
    
    public static class OccupiedSeatsResponse {
        private List<String> occupiedSeats;
        
        public OccupiedSeatsResponse(List<String> occupiedSeats) {
            this.occupiedSeats = occupiedSeats;
        }
        
        public List<String> getOccupiedSeats() { return occupiedSeats; }
        public void setOccupiedSeats(List<String> occupiedSeats) { this.occupiedSeats = occupiedSeats; }
    }
    
    public static class SeatStatusUpdateRequest {
        private Long busId;
        private Long routeId;
        private List<String> seatNumbers;
        private String status; // "OCCUPIED" or "AVAILABLE"
        
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public Long getRouteId() { return routeId; }
        public void setRouteId(Long routeId) { this.routeId = routeId; }
        
        public List<String> getSeatNumbers() { return seatNumbers; }
        public void setSeatNumbers(List<String> seatNumbers) { this.seatNumbers = seatNumbers; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
    
    public static class SeatStatusResponse {
        private List<String> occupiedSeats;
        private List<String> availableSeats;
        private Integer totalSeats;
        private Integer occupiedCount;
        private Integer availableCount;
        
        public SeatStatusResponse(List<String> occupiedSeats, List<String> availableSeats, 
                                Integer totalSeats, Integer occupiedCount, Integer availableCount) {
            this.occupiedSeats = occupiedSeats;
            this.availableSeats = availableSeats;
            this.totalSeats = totalSeats;
            this.occupiedCount = occupiedCount;
            this.availableCount = availableCount;
        }
        
        public List<String> getOccupiedSeats() { return occupiedSeats; }
        public void setOccupiedSeats(List<String> occupiedSeats) { this.occupiedSeats = occupiedSeats; }
        
        public List<String> getAvailableSeats() { return availableSeats; }
        public void setAvailableSeats(List<String> availableSeats) { this.availableSeats = availableSeats; }
        
        public Integer getTotalSeats() { return totalSeats; }
        public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
        
        public Integer getOccupiedCount() { return occupiedCount; }
        public void setOccupiedCount(Integer occupiedCount) { this.occupiedCount = occupiedCount; }
        
        public Integer getAvailableCount() { return availableCount; }
        public void setAvailableCount(Integer availableCount) { this.availableCount = availableCount; }
    }
    
    public static class RefreshSeatsRequest {
        private Long busId;
        private Long routeId;
        
        public Long getBusId() { return busId; }
        public void setBusId(Long busId) { this.busId = busId; }
        
        public Long getRouteId() { return routeId; }
        public void setRouteId(Long routeId) { this.routeId = routeId; }
    }
}

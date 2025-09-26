package com.highwayexpress.backend.service;

import com.highwayexpress.backend.model.*;
import com.highwayexpress.backend.repository.BookingRepository;
import com.highwayexpress.backend.repository.BusRepository;
import com.highwayexpress.backend.repository.RouteRepository;
import com.highwayexpress.backend.repository.UserRepository;
import com.highwayexpress.backend.dto.BookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Booking createBooking(Long userId, Long routeId, Long busId, 
                                String passengerName, String passengerEmail, 
                                String passengerPhone, String passengerNic,
                                Integer numberOfSeats, String selectedSeats) {
        
        try {
            System.out.println("Creating booking for userId: " + userId + ", routeId: " + routeId + ", busId: " + busId);
            System.out.println("Passenger details - Name: " + passengerName + ", Email: " + passengerEmail + ", Phone: " + passengerPhone);
            System.out.println("Seat details - Number of seats: " + numberOfSeats + ", Selected seats: " + selectedSeats);
            
            // Validate input parameters
            if (userId == null) {
                throw new RuntimeException("User ID cannot be null");
            }
            if (routeId == null) {
                throw new RuntimeException("Route ID cannot be null");
            }
            if (busId == null) {
                throw new RuntimeException("Bus ID cannot be null");
            }
            if (passengerName == null || passengerName.trim().isEmpty()) {
                throw new RuntimeException("Passenger name cannot be null or empty");
            }
            if (passengerEmail == null || passengerEmail.trim().isEmpty()) {
                throw new RuntimeException("Passenger email cannot be null or empty");
            }
            if (passengerPhone == null || passengerPhone.trim().isEmpty()) {
                throw new RuntimeException("Passenger phone cannot be null or empty");
            }
            if (numberOfSeats == null || numberOfSeats <= 0) {
                throw new RuntimeException("Number of seats must be greater than 0");
            }
            
            // Validate user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                System.err.println("User not found with ID: " + userId);
                throw new RuntimeException("User not found with ID: " + userId + ". Please ensure the user exists in the database.");
            }
            
            // Validate route exists
            Optional<Route> routeOpt = routeRepository.findById(routeId);
            if (!routeOpt.isPresent()) {
                System.err.println("Route not found with ID: " + routeId);
                throw new RuntimeException("Route not found with ID: " + routeId + ". Please ensure the route exists in the database.");
            }
            
            // Validate bus exists
            Optional<Bus> busOpt = busRepository.findById(busId);
            if (!busOpt.isPresent()) {
                System.err.println("Bus not found with ID: " + busId);
                throw new RuntimeException("Bus not found with ID: " + busId + ". Please ensure the bus exists in the database.");
            }
            
            User user = userOpt.get();
            Route route = routeOpt.get();
            Bus bus = busOpt.get();
            
            // Check seat availability (simplified approach)
            Integer totalSeatsBooked = 0;
            try {
                System.out.println("Checking seat availability for bus: " + bus.getBusName() + " (capacity: " + bus.getSeatingCapacity() + ")");
                
                // Use a simpler approach - get all bookings for this bus and route
                List<Booking> existingBookings = bookingRepository.findByBusAndRoute(bus, route);
                for (Booking booking : existingBookings) {
                    if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
                        totalSeatsBooked += booking.getNumberOfSeats();
                    }
                }
                
                System.out.println("Total seats already booked: " + totalSeatsBooked);
            } catch (Exception e) {
                System.err.println("Error checking seat availability: " + e.getMessage());
                e.printStackTrace();
                // Continue with 0 booked seats if there's an error
                totalSeatsBooked = 0;
            }
            
            Integer availableSeats = bus.getSeatingCapacity() - totalSeatsBooked;
            System.out.println("Available seats: " + availableSeats + ", Requested: " + numberOfSeats);
            
            if (availableSeats < numberOfSeats) {
                throw new RuntimeException("Not enough seats available. Available: " + availableSeats + ", Requested: " + numberOfSeats);
            }
            
            // Calculate total price
            Double totalPrice = route.getTicketPrice() * numberOfSeats;
            System.out.println("Total price calculated: " + totalPrice);
            
            // Create booking
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setRoute(route);
            booking.setBus(bus);
            booking.setPassengerName(passengerName);
            booking.setPassengerEmail(passengerEmail);
            booking.setPassengerPhone(passengerPhone);
            booking.setPassengerNic(passengerNic);
            booking.setNumberOfSeats(numberOfSeats);
            booking.setSelectedSeats(selectedSeats);
            booking.setTotalPrice(totalPrice);
            booking.setBookingStatus(BookingStatus.CONFIRMED);
            booking.setBookingDate(LocalDateTime.now());
            
            System.out.println("Saving booking to database...");
            System.out.println("Booking object before save: " + booking.toString());
            
            try {
                Booking savedBooking = bookingRepository.save(booking);
                System.out.println("Booking saved successfully with ID: " + savedBooking.getId());
                return savedBooking;
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                System.err.println("Database constraint violation: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Database constraint violation. Please check if all referenced data exists: " + e.getMessage());
            } catch (org.springframework.dao.DataAccessException e) {
                System.err.println("Database access error: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Database access error: " + e.getMessage());
            } catch (Exception saveException) {
                System.err.println("Database save failed: " + saveException.getMessage());
                saveException.printStackTrace();
                throw new RuntimeException("Failed to save booking to database: " + saveException.getMessage());
            }
            
        } catch (RuntimeException e) {
            System.err.println("Booking creation failed: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw RuntimeException as-is
        } catch (Exception e) {
            System.err.println("Unexpected error creating booking: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Unexpected error during booking creation: " + e.getMessage());
        }
    }
    
    public List<BookingResponse> getAllBookings() {
        try {
            // Use simple approach to avoid lazy loading issues
            List<Booking> bookings = bookingRepository.findAll();
            System.out.println("Found " + bookings.size() + " total bookings");
            
            // Convert Booking entities to BookingResponse DTOs with basic info only
            List<BookingResponse> bookingResponses = new ArrayList<>();
            for (Booking booking : bookings) {
                BookingResponse response = new BookingResponse();
                response.setId(booking.getId());
                response.setPassengerName(booking.getPassengerName());
                response.setPassengerEmail(booking.getPassengerEmail());
                response.setPassengerPhone(booking.getPassengerPhone());
                response.setPassengerNic(booking.getPassengerNic());
                response.setNumberOfSeats(booking.getNumberOfSeats());
                response.setSelectedSeats(booking.getSelectedSeats());
                response.setTotalPrice(booking.getTotalPrice());
                response.setBookingStatus(booking.getBookingStatus().toString());
                response.setPaymentStatus("PAID"); // Default to PAID for now, can be enhanced later
                response.setBookingDate(booking.getBookingDate());
                response.setTravelDate(booking.getTravelDate());
                response.setCreatedAt(booking.getCreatedAt());
                response.setUpdatedAt(booking.getUpdatedAt());
                
                // Set basic IDs without accessing lazy-loaded relationships
                try {
                    response.setUserId(booking.getUser() != null ? booking.getUser().getId() : null);
                } catch (Exception e) {
                    System.err.println("Error accessing user ID: " + e.getMessage());
                    response.setUserId(null);
                }
                
                try {
                    response.setRouteId(booking.getRoute() != null ? booking.getRoute().getId() : null);
                } catch (Exception e) {
                    System.err.println("Error accessing route ID: " + e.getMessage());
                    response.setRouteId(null);
                }
                
                try {
                    response.setBusId(booking.getBus() != null ? booking.getBus().getId() : null);
                } catch (Exception e) {
                    System.err.println("Error accessing bus ID: " + e.getMessage());
                    response.setBusId(null);
                }
                
                bookingResponses.add(response);
            }
            
            return bookingResponses;
        } catch (Exception e) {
            System.err.println("Error fetching bookings: " + e.getMessage());
            e.printStackTrace();
            // Return empty list if there's an error (e.g., table doesn't exist)
            return new ArrayList<>();
        }
    }
    
    public List<Booking> getAllBookingsSimple() {
        try {
            System.out.println("Fetching all bookings (simple)");
            List<Booking> bookings = bookingRepository.findAll();
            System.out.println("Found " + bookings.size() + " bookings");
            return bookings;
        } catch (Exception e) {
            System.err.println("Error fetching bookings: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<BookingResponse> getBookingsByUser(Long userId) {
        try {
            System.out.println("Fetching bookings for user ID: " + userId);
            
            if (userId == null) {
                throw new RuntimeException("User ID cannot be null");
            }
            
            // Test database connection first
            try {
                long userCount = userRepository.count();
                System.out.println("Database connection test - Total users in database: " + userCount);
            } catch (Exception dbError) {
                System.err.println("Database connection error: " + dbError.getMessage());
                throw new RuntimeException("Database connection failed: " + dbError.getMessage());
            }
            
            // Use direct query by userId to avoid lazy loading issues
            List<Booking> bookings = bookingRepository.findByUserId(userId);
            System.out.println("Found " + bookings.size() + " bookings for user ID: " + userId);
            
            // Convert Booking entities to BookingResponse DTOs
            List<BookingResponse> bookingResponses = new ArrayList<>();
            for (Booking booking : bookings) {
                BookingResponse response = new BookingResponse();
                response.setId(booking.getId());
                response.setUserId(booking.getUser().getId());
                response.setRouteId(booking.getRoute().getId());
                response.setBusId(booking.getBus().getId());
                response.setPassengerName(booking.getPassengerName());
                response.setPassengerEmail(booking.getPassengerEmail());
                response.setPassengerPhone(booking.getPassengerPhone());
                response.setPassengerNic(booking.getPassengerNic());
                response.setNumberOfSeats(booking.getNumberOfSeats());
                response.setSelectedSeats(booking.getSelectedSeats());
                response.setTotalPrice(booking.getTotalPrice());
                response.setBookingStatus(booking.getBookingStatus().toString());
                response.setPaymentStatus("PAID"); // Default to PAID for now, can be enhanced later
                response.setBookingDate(booking.getBookingDate());
                response.setTravelDate(booking.getTravelDate());
                response.setCreatedAt(booking.getCreatedAt());
                response.setUpdatedAt(booking.getUpdatedAt());
                
                // Add user details
                response.setUserFirstName(booking.getUser().getFirstName());
                response.setUserLastName(booking.getUser().getLastName());
                response.setUserEmail(booking.getUser().getEmail());
                
                // Add route details
                response.setFromLocation(booking.getRoute().getFromLocation());
                response.setToLocation(booking.getRoute().getToLocation());
                response.setDepartureTime(booking.getRoute().getDepartureTime().toString());
                response.setArrivalTime(booking.getRoute().getArrivalTime().toString());
                
                // Add bus details
                response.setBusName(booking.getBus().getBusName());
                response.setRegistrationNumber(booking.getBus().getRegistrationNumber());
                
                bookingResponses.add(response);
            }
            
            // Log user details if bookings found
            if (!bookings.isEmpty()) {
                User user = bookings.get(0).getUser();
                System.out.println("User details: " + user.getFirstName() + " " + user.getLastName() + " (" + user.getEmail() + ")");
            }
            
            return bookingResponses;
        } catch (org.springframework.dao.DataAccessException e) {
            System.err.println("Database access error for user ID " + userId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Database access error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error fetching bookings for user ID " + userId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch bookings for user: " + e.getMessage());
        }
    }
    
    public List<Booking> getBookingsByRoute(Long routeId) {
        Optional<Route> routeOpt = routeRepository.findById(routeId);
        if (!routeOpt.isPresent()) {
            throw new RuntimeException("Route not found with ID: " + routeId);
        }
        return bookingRepository.findByRoute(routeOpt.get());
    }
    
    public List<Booking> getBookingsByBus(Long busId) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        if (!busOpt.isPresent()) {
            throw new RuntimeException("Bus not found with ID: " + busId);
        }
        return bookingRepository.findByBus(busOpt.get());
    }
    
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }
        
        Booking booking = bookingOpt.get();
        booking.setBookingStatus(status);
        return bookingRepository.save(booking);
    }
    
    public void cancelBooking(Long bookingId) {
        updateBookingStatus(bookingId, BookingStatus.CANCELLED);
    }
    
    public void deleteBooking(Long bookingId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }
    
    public Integer getAvailableSeats(Long busId, Long routeId) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        Optional<Route> routeOpt = routeRepository.findById(routeId);
        
        if (!busOpt.isPresent() || !routeOpt.isPresent()) {
            return 0;
        }
        
        Bus bus = busOpt.get();
        Route route = routeOpt.get();
        
        Integer totalSeatsBooked = bookingRepository.getTotalSeatsBookedByBusAndRoute(bus, route);
        if (totalSeatsBooked == null) {
            totalSeatsBooked = 0;
        }
        
        return bus.getSeatingCapacity() - totalSeatsBooked;
    }
    
    public List<Booking> getRecentBookings() {
        return bookingRepository.findRecentBookings();
    }
    
    public List<Booking> getBookingsForToday() {
        return bookingRepository.findBookingsForToday(LocalDateTime.now());
    }
    
    public List<String> getOccupiedSeats(Long busId, Long routeId) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        Optional<Route> routeOpt = routeRepository.findById(routeId);
        
        if (!busOpt.isPresent() || !routeOpt.isPresent()) {
            throw new RuntimeException("Bus or Route not found");
        }
        
        Bus bus = busOpt.get();
        Route route = routeOpt.get();
        
        // Get all confirmed bookings for this bus and route
        List<Booking> bookings = bookingRepository.findByBusAndRoute(bus, route);
        
        List<String> occupiedSeats = new ArrayList<String>();
        for (Booking booking : bookings) {
            if (booking.getBookingStatus() == BookingStatus.CONFIRMED && booking.getSelectedSeats() != null) {
                try {
                    // Parse the JSON string of selected seats
                    String seatsJson = booking.getSelectedSeats();
                    // Remove brackets and quotes, then split by comma
                    seatsJson = seatsJson.replaceAll("[\\[\\]\"]", "");
                    String[] seats = seatsJson.split(",");
                    for (String seat : seats) {
                        if (!seat.trim().isEmpty()) {
                            occupiedSeats.add(seat.trim());
                        }
                    }
                } catch (Exception e) {
                    // If JSON parsing fails, skip this booking
                    System.err.println("Error parsing seats for booking " + booking.getId() + ": " + e.getMessage());
                }
            }
        }
        
        return occupiedSeats;
    }
    
    public void updateSeatStatus(Long busId, Long routeId, List<String> seatNumbers, String status) {
        // This method can be used to manually update seat status
        // For now, we'll just log the request
        System.out.println("Updating seat status for Bus " + busId + ", Route " + routeId + 
                          ", Seats: " + seatNumbers + ", Status: " + status);
        
        // In a real implementation, you might want to:
        // 1. Create a separate seat_status table
        // 2. Update existing bookings
        // 3. Or create new bookings for occupied seats
        
        // For now, we'll create a simple booking for occupied seats
        if ("OCCUPIED".equals(status)) {
            Optional<Bus> busOpt = busRepository.findById(busId);
            Optional<Route> routeOpt = routeRepository.findById(routeId);
            Optional<User> userOpt = userRepository.findById(1L); // Use default user
            
            if (busOpt.isPresent() && routeOpt.isPresent() && userOpt.isPresent()) {
                Bus bus = busOpt.get();
                Route route = routeOpt.get();
                User user = userOpt.get();
                
                // Create a system booking for occupied seats
                Booking systemBooking = new Booking();
                systemBooking.setUser(user);
                systemBooking.setRoute(route);
                systemBooking.setBus(bus);
                systemBooking.setPassengerName("System Occupied");
                systemBooking.setPassengerEmail("system@occupied.com");
                systemBooking.setPassengerPhone("+94770000000");
                systemBooking.setNumberOfSeats(seatNumbers.size());
                systemBooking.setSelectedSeats(seatNumbers.toString());
                systemBooking.setTotalPrice(0.0);
                systemBooking.setBookingStatus(BookingStatus.CONFIRMED);
                systemBooking.setBookingDate(LocalDateTime.now());
                
                bookingRepository.save(systemBooking);
            }
        }
    }
    
    public com.highwayexpress.backend.controller.BookingController.SeatStatusResponse getSeatStatus(Long busId, Long routeId) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        Optional<Route> routeOpt = routeRepository.findById(routeId);
        
        if (!busOpt.isPresent() || !routeOpt.isPresent()) {
            throw new RuntimeException("Bus or Route not found");
        }
        
        Bus bus = busOpt.get();
        // Route route = routeOpt.get(); // Not used in this method
        
        // Get occupied seats
        List<String> occupiedSeats = getOccupiedSeats(busId, routeId);
        
        // Generate all possible seat numbers (1-45 for a 45-seat bus)
        List<String> allSeats = new ArrayList<String>();
        for (int i = 1; i <= bus.getSeatingCapacity(); i++) {
            allSeats.add(String.valueOf(i));
        }
        
        // Get available seats (all seats minus occupied ones)
        List<String> availableSeats = new ArrayList<String>();
        for (String seat : allSeats) {
            if (!occupiedSeats.contains(seat)) {
                availableSeats.add(seat);
            }
        }
        
        return new com.highwayexpress.backend.controller.BookingController.SeatStatusResponse(
            occupiedSeats,
            availableSeats,
            bus.getSeatingCapacity(),
            occupiedSeats.size(),
            availableSeats.size()
        );
    }
    
    public int clearOccupiedSeats(Long busId, Long routeId) {
        Optional<Bus> busOpt = busRepository.findById(busId);
        Optional<Route> routeOpt = routeRepository.findById(routeId);
        
        if (!busOpt.isPresent() || !routeOpt.isPresent()) {
            throw new RuntimeException("Bus or Route not found");
        }
        
        Bus bus = busOpt.get();
        Route route = routeOpt.get();
        
        // Get all bookings for this bus and route
        List<Booking> bookings = bookingRepository.findByBusAndRoute(bus, route);
        
        int removedCount = 0;
        for (Booking booking : bookings) {
            // Remove system bookings and test bookings
            if (booking.getPassengerName().equals("Red Occupied Seats") ||
                booking.getPassengerName().equals("System Occupied") ||
                booking.getPassengerName().equals("Test User")) {
                bookingRepository.delete(booking);
                removedCount++;
            }
        }
        
        return removedCount;
    }
    
    public int clearAllTestBookings() {
        List<Booking> allBookings = bookingRepository.findAll();
        int removedCount = 0;
        
        for (Booking booking : allBookings) {
            // Remove test and system bookings
            if (booking.getPassengerName().equals("Red Occupied Seats") ||
                booking.getPassengerName().equals("System Occupied") ||
                booking.getPassengerName().equals("Test User") ||
                booking.getPassengerName().equals("John Doe") ||
                booking.getPassengerName().equals("Jane Smith")) {
                bookingRepository.delete(booking);
                removedCount++;
            }
        }
        
        return removedCount;
    }
}

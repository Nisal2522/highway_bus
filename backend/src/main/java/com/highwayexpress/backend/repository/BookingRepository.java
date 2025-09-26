package com.highwayexpress.backend.repository;

import com.highwayexpress.backend.model.Booking;
import com.highwayexpress.backend.model.Bus;
import com.highwayexpress.backend.model.Route;
import com.highwayexpress.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find bookings by user
    List<Booking> findByUser(User user);
    
    // Find bookings by user ID (more direct approach)
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId")
    List<Booking> findByUserId(@Param("userId") Long userId);
    
    // Find bookings by route
    List<Booking> findByRoute(Route route);
    
    // Find bookings by bus
    List<Booking> findByBus(Bus bus);
    
    // Find bookings by status
    List<Booking> findByBookingStatus(String bookingStatus);
    
    // Find bookings by date range
    List<Booking> findByTravelDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find bookings for a specific bus and route
    List<Booking> findByBusAndRoute(Bus bus, Route route);
    
    // Count total bookings for a bus on a specific route
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bus = :bus AND b.route = :route AND b.bookingStatus = 'CONFIRMED'")
    Long countConfirmedBookingsByBusAndRoute(@Param("bus") Bus bus, @Param("route") Route route);
    
    // Get total seats booked for a bus on a specific route
    @Query("SELECT COALESCE(SUM(b.numberOfSeats), 0) FROM Booking b WHERE b.bus = :bus AND b.route = :route AND b.bookingStatus = 'CONFIRMED'")
    Integer getTotalSeatsBookedByBusAndRoute(@Param("bus") Bus bus, @Param("route") Route route);
    
    // Find bookings by passenger email
    List<Booking> findByPassengerEmail(String passengerEmail);
    
    // Find bookings by passenger phone
    List<Booking> findByPassengerPhone(String passengerPhone);
    
    // Find recent bookings
    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookings();
    
    // Find bookings for today
    @Query("SELECT b FROM Booking b WHERE DATE(b.travelDate) = DATE(:today)")
    List<Booking> findBookingsForToday(@Param("today") LocalDateTime today);
    
    // Find all bookings with eager loading of relationships
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user LEFT JOIN FETCH b.route LEFT JOIN FETCH b.bus")
    List<Booking> findAllWithRelations();
}

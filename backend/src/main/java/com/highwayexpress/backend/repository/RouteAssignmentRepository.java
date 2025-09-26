package com.highwayexpress.backend.repository;

import com.highwayexpress.backend.model.RouteAssignment;
import com.highwayexpress.backend.model.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RouteAssignmentRepository extends JpaRepository<RouteAssignment, Long> {
    
    // Find assignments by route ID
    List<RouteAssignment> findByRouteIdOrderByDepartureDateAscDepartureTimeAsc(Long routeId);
    
    // Find assignments by bus ID
    List<RouteAssignment> findByBusIdOrderByDepartureDateAscDepartureTimeAsc(Long busId);
    
    // Find assignments by status
    List<RouteAssignment> findByStatus(AssignmentStatus status);
    
    // Find assignments by route ID and status
    List<RouteAssignment> findByRouteIdAndStatus(Long routeId, AssignmentStatus status);
    
    // Find assignments by bus ID and status
    List<RouteAssignment> findByBusIdAndStatus(Long busId, AssignmentStatus status);
    
    // Check if bus is already assigned at specific date and time
    @Query("SELECT COUNT(ra) > 0 FROM RouteAssignment ra WHERE ra.bus.id = :busId AND ra.departureDate = :departureDate AND ra.departureTime = :departureTime AND ra.status = 'ASSIGNED'")
    boolean existsByBusIdAndDepartureDateAndDepartureTime(@Param("busId") Long busId, 
                                                         @Param("departureDate") LocalDate departureDate, 
                                                         @Param("departureTime") LocalTime departureTime);
    
    // Find assignments by date range
    @Query("SELECT ra FROM RouteAssignment ra WHERE ra.departureDate BETWEEN :startDate AND :endDate ORDER BY ra.departureDate ASC, ra.departureTime ASC")
    List<RouteAssignment> findByDepartureDateBetween(@Param("startDate") LocalDate startDate, 
                                                    @Param("endDate") LocalDate endDate);
    
    // Find assignments by route ID and date range
    @Query("SELECT ra FROM RouteAssignment ra WHERE ra.route.id = :routeId AND ra.departureDate BETWEEN :startDate AND :endDate ORDER BY ra.departureDate ASC, ra.departureTime ASC")
    List<RouteAssignment> findByRouteIdAndDepartureDateBetween(@Param("routeId") Long routeId, 
                                                              @Param("startDate") LocalDate startDate, 
                                                              @Param("endDate") LocalDate endDate);
    
    // Find assignments by bus ID and date range
    @Query("SELECT ra FROM RouteAssignment ra WHERE ra.bus.id = :busId AND ra.departureDate BETWEEN :startDate AND :endDate ORDER BY ra.departureDate ASC, ra.departureTime ASC")
    List<RouteAssignment> findByBusIdAndDepartureDateBetween(@Param("busId") Long busId, 
                                                            @Param("startDate") LocalDate startDate, 
                                                            @Param("endDate") LocalDate endDate);
    
    // Count assignments by route ID
    long countByRouteId(Long routeId);
    
    // Count assignments by bus ID
    long countByBusId(Long busId);
    
    // Count assignments by status
    long countByStatus(AssignmentStatus status);
    
    // Find assignments with route and bus details
    @Query("SELECT ra FROM RouteAssignment ra JOIN FETCH ra.route JOIN FETCH ra.bus WHERE ra.id = :assignmentId")
    Optional<RouteAssignment> findByIdWithRouteAndBus(@Param("assignmentId") Long assignmentId);
    
    // Find all assignments with route and bus details
    @Query("SELECT ra FROM RouteAssignment ra JOIN FETCH ra.route JOIN FETCH ra.bus ORDER BY ra.departureDate ASC, ra.departureTime ASC")
    List<RouteAssignment> findAllWithRouteAndBus();
    
    // Find assignments by route ID with route and bus details
    @Query("SELECT ra FROM RouteAssignment ra JOIN FETCH ra.route JOIN FETCH ra.bus WHERE ra.route.id = :routeId ORDER BY ra.departureDate ASC, ra.departureTime ASC")
    List<RouteAssignment> findByRouteIdWithRouteAndBus(@Param("routeId") Long routeId);
}

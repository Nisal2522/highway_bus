package com.highwayexpress.backend.repository;

import com.highwayexpress.backend.model.Route;
import com.highwayexpress.backend.model.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    // Find routes by status
    List<Route> findByStatus(RouteStatus status);
    
    // Find routes by from location (case-insensitive)
    List<Route> findByFromLocationContainingIgnoreCase(String fromLocation);
    
    // Find routes by to location (case-insensitive)
    List<Route> findByToLocationContainingIgnoreCase(String toLocation);
    
    // Find routes by both from and to locations (case-insensitive)
    List<Route> findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCase(
        String fromLocation, String toLocation);
    
    // Find routes by from location and status (case-insensitive)
    List<Route> findByFromLocationContainingIgnoreCaseAndStatus(String fromLocation, RouteStatus status);
    
    // Find routes by to location and status (case-insensitive)
    List<Route> findByToLocationContainingIgnoreCaseAndStatus(String toLocation, RouteStatus status);
    
    // Find routes by from, to locations and status (case-insensitive)
    List<Route> findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndStatus(
        String fromLocation, String toLocation, RouteStatus status);
    
    // Find active routes
    List<Route> findByStatusOrderByCreatedAtDesc(RouteStatus status);
    
    // Find routes with assignments
    @Query("SELECT DISTINCT r FROM Route r LEFT JOIN FETCH r.routeAssignments ra LEFT JOIN FETCH ra.bus WHERE r.id = :routeId")
    Optional<Route> findByIdWithAssignments(@Param("routeId") Long routeId);
    
    // Find all routes with assignments
    @Query("SELECT DISTINCT r FROM Route r LEFT JOIN FETCH r.routeAssignments ra LEFT JOIN FETCH ra.bus ORDER BY r.createdAt DESC")
    List<Route> findAllWithAssignments();
    
    // Find routes by status with assignments
    @Query("SELECT DISTINCT r FROM Route r LEFT JOIN FETCH r.routeAssignments ra LEFT JOIN FETCH ra.bus WHERE r.status = :status ORDER BY r.createdAt DESC")
    List<Route> findByStatusWithAssignments(@Param("status") RouteStatus status);
    
    // Search routes by text (from or to location)
    @Query("SELECT r FROM Route r WHERE LOWER(r.fromLocation) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.toLocation) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY r.createdAt DESC")
    List<Route> searchRoutes(@Param("searchTerm") String searchTerm);
    
    // Count routes by status
    long countByStatus(RouteStatus status);
    
    // Find routes created in the last N days
    @Query("SELECT r FROM Route r WHERE r.createdAt >= :startDate ORDER BY r.createdAt DESC")
    List<Route> findRecentRoutes(@Param("startDate") java.util.Date startDate);
}

package com.highwayexpress.backend.service;

import com.highwayexpress.backend.dto.CreateRouteRequest;
import com.highwayexpress.backend.dto.RouteDto;
import com.highwayexpress.backend.dto.RouteAssignmentDto;
import com.highwayexpress.backend.model.Route;
import com.highwayexpress.backend.model.RouteStatus;
import com.highwayexpress.backend.model.RouteAssignment;
import com.highwayexpress.backend.model.Bus;
import com.highwayexpress.backend.model.AssignmentStatus;
import com.highwayexpress.backend.repository.RouteRepository;
import com.highwayexpress.backend.repository.RouteAssignmentRepository;
import com.highwayexpress.backend.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RouteService {
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private RouteAssignmentRepository routeAssignmentRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    // Create a new route
    public RouteDto createRoute(CreateRouteRequest request) {
        Route route = new Route();
        route.setFromLocation(request.getFromLocation());
        route.setToLocation(request.getToLocation());
        route.setDepartureTime(request.getDepartureTime());
        route.setArrivalTime(request.getArrivalTime());
        route.setTicketPrice(request.getTicketPrice());
        route.setStatus(request.getStatus());
        route.setDescription(request.getDescription());
        
        Route savedRoute = routeRepository.save(route);
        return convertToDto(savedRoute);
    }
    
    // Get all routes with assignments
    public List<RouteDto> getAllRoutes() {
        List<Route> routes = routeRepository.findAllWithAssignments();
        return routes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Get route by ID with assignments
    public Optional<RouteDto> getRouteById(Long routeId) {
        Optional<Route> route = routeRepository.findByIdWithAssignments(routeId);
        return route.map(this::convertToDto);
    }
    
    // Get routes by status
    public List<RouteDto> getRoutesByStatus(RouteStatus status) {
        List<Route> routes = routeRepository.findByStatusWithAssignments(status);
        return routes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Search routes by text
    public List<RouteDto> searchRoutes(String searchTerm) {
        List<Route> routes = routeRepository.searchRoutes(searchTerm);
        return routes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Search routes for passengers (by from, to, and date)
    public List<RouteDto> searchRoutesForPassenger(String from, String to, String date) {
        List<Route> routes;
        
        if (from != null && to != null && date != null) {
            // Search by all three parameters
            routes = routeRepository.findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndStatus(
                from, to, RouteStatus.ACTIVE);
        } else if (from != null && to != null) {
            // Search by from and to
            routes = routeRepository.findByFromLocationContainingIgnoreCaseAndToLocationContainingIgnoreCaseAndStatus(
                from, to, RouteStatus.ACTIVE);
        } else if (from != null) {
            // Search by from only
            routes = routeRepository.findByFromLocationContainingIgnoreCaseAndStatus(from, RouteStatus.ACTIVE);
        } else if (to != null) {
            // Search by to only
            routes = routeRepository.findByToLocationContainingIgnoreCaseAndStatus(to, RouteStatus.ACTIVE);
        } else {
            // Return all active routes
            routes = routeRepository.findByStatus(RouteStatus.ACTIVE);
        }
        
        return routes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Update route
    public Optional<RouteDto> updateRoute(Long routeId, CreateRouteRequest request) {
        Optional<Route> optionalRoute = routeRepository.findById(routeId);
        if (optionalRoute.isPresent()) {
            Route route = optionalRoute.get();
            route.setFromLocation(request.getFromLocation());
            route.setToLocation(request.getToLocation());
            route.setDepartureTime(request.getDepartureTime());
            route.setArrivalTime(request.getArrivalTime());
            route.setTicketPrice(request.getTicketPrice());
            route.setStatus(request.getStatus());
            route.setDescription(request.getDescription());
            
            Route updatedRoute = routeRepository.save(route);
            return Optional.of(convertToDto(updatedRoute));
        }
        return Optional.empty();
    }
    
    // Delete route
    public boolean deleteRoute(Long routeId) {
        if (routeRepository.existsById(routeId)) {
            // Check if route has assignments
            List<RouteAssignment> assignments = routeAssignmentRepository.findByRouteIdOrderByDepartureDateAscDepartureTimeAsc(routeId);
            if (!assignments.isEmpty()) {
                // Delete all assignments first
                routeAssignmentRepository.deleteAll(assignments);
            }
            routeRepository.deleteById(routeId);
            return true;
        }
        return false;
    }
    
    // Assign bus to route
    public Optional<RouteAssignmentDto> assignBusToRoute(Long routeId, Long busId, 
                                                       LocalDate departureDate, LocalTime departureTime, 
                                                       Integer assignedSeats) {
        // Check if route exists
        Optional<Route> optionalRoute = routeRepository.findById(routeId);
        if (!optionalRoute.isPresent()) {
            return Optional.empty();
        }
        
        // Check if bus exists and is approved
        Optional<Bus> optionalBus = busRepository.findById(busId);
        if (!optionalBus.isPresent() || !optionalBus.get().getStatus().toString().equals("APPROVED")) {
            return Optional.empty();
        }
        
        Bus bus = optionalBus.get();
        
        // Check if bus is already assigned at the same time and date
        if (routeAssignmentRepository.existsByBusIdAndDepartureDateAndDepartureTime(busId, departureDate, departureTime)) {
            return Optional.empty();
        }
        
        // Validate assigned seats
        if (assignedSeats > bus.getSeatingCapacity()) {
            return Optional.empty();
        }
        
        // Create assignment
        RouteAssignment assignment = new RouteAssignment();
        assignment.setRoute(optionalRoute.get());
        assignment.setBus(bus);
        assignment.setDepartureDate(departureDate);
        assignment.setDepartureTime(departureTime);
        assignment.setAssignedSeats(assignedSeats);
        assignment.setStatus(AssignmentStatus.ASSIGNED);
        
        RouteAssignment savedAssignment = routeAssignmentRepository.save(assignment);
        return Optional.of(convertAssignmentToDto(savedAssignment));
    }
    
    // Remove bus assignment
    public boolean removeBusAssignment(Long assignmentId) {
        if (routeAssignmentRepository.existsById(assignmentId)) {
            routeAssignmentRepository.deleteById(assignmentId);
            return true;
        }
        return false;
    }
    
    // Get route statistics
    public RouteStatistics getRouteStatistics() {
        long totalRoutes = routeRepository.count();
        long activeRoutes = routeRepository.countByStatus(RouteStatus.ACTIVE);
        long inactiveRoutes = routeRepository.countByStatus(RouteStatus.INACTIVE);
        long maintenanceRoutes = routeRepository.countByStatus(RouteStatus.MAINTENANCE);
        long totalAssignments = routeAssignmentRepository.count();
        
        return new RouteStatistics(totalRoutes, activeRoutes, inactiveRoutes, maintenanceRoutes, totalAssignments);
    }
    
    // Convert Route entity to DTO
    private RouteDto convertToDto(Route route) {
        RouteDto dto = new RouteDto();
        dto.setId(route.getId());
        dto.setFromLocation(route.getFromLocation());
        dto.setToLocation(route.getToLocation());
        dto.setDepartureTime(route.getDepartureTime());
        dto.setArrivalTime(route.getArrivalTime());
        dto.setTicketPrice(route.getTicketPrice());
        dto.setStatus(route.getStatus());
        dto.setDescription(route.getDescription());
        
        // Convert assignments
        if (route.getRouteAssignments() != null) {
            List<RouteAssignmentDto> assignmentDtos = route.getRouteAssignments().stream()
                    .map(this::convertAssignmentToDto)
                    .collect(Collectors.toList());
            dto.setRouteAssignments(assignmentDtos);
        }
        
        return dto;
    }
    
    // Convert RouteAssignment entity to DTO
    private RouteAssignmentDto convertAssignmentToDto(RouteAssignment assignment) {
        RouteAssignmentDto dto = new RouteAssignmentDto();
        dto.setId(assignment.getId());
        dto.setRouteId(assignment.getRoute().getId());
        dto.setBusId(assignment.getBus().getId());
        dto.setBusName(assignment.getBus().getBusName());
        dto.setRegistrationNumber(assignment.getBus().getRegistrationNumber());
        dto.setBusCapacity(assignment.getBus().getSeatingCapacity());
        dto.setDepartureDate(assignment.getDepartureDate());
        dto.setDepartureTime(assignment.getDepartureTime());
        dto.setAssignedSeats(assignment.getAssignedSeats());
        dto.setStatus(assignment.getStatus());
        
        // Get owner name from bus
        if (assignment.getBus().getOwner() != null) {
            dto.setOwnerName(assignment.getBus().getOwner().getFirstName() + " " + assignment.getBus().getOwner().getLastName());
        }
        
        return dto;
    }
    
    // Inner class for statistics
    public static class RouteStatistics {
        private final long totalRoutes;
        private final long activeRoutes;
        private final long inactiveRoutes;
        private final long maintenanceRoutes;
        private final long totalAssignments;
        
        public RouteStatistics(long totalRoutes, long activeRoutes, long inactiveRoutes, 
                             long maintenanceRoutes, long totalAssignments) {
            this.totalRoutes = totalRoutes;
            this.activeRoutes = activeRoutes;
            this.inactiveRoutes = inactiveRoutes;
            this.maintenanceRoutes = maintenanceRoutes;
            this.totalAssignments = totalAssignments;
        }
        
        // Getters
        public long getTotalRoutes() { return totalRoutes; }
        public long getActiveRoutes() { return activeRoutes; }
        public long getInactiveRoutes() { return inactiveRoutes; }
        public long getMaintenanceRoutes() { return maintenanceRoutes; }
        public long getTotalAssignments() { return totalAssignments; }
    }
}

package com.highwayexpress.backend.controller;

import com.highwayexpress.backend.dto.CreateRouteRequest;
import com.highwayexpress.backend.dto.CreateAssignmentRequest;
import com.highwayexpress.backend.dto.RouteDto;
import com.highwayexpress.backend.dto.RouteAssignmentDto;
import com.highwayexpress.backend.model.RouteStatus;
import com.highwayexpress.backend.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {
    
    @Autowired
    private RouteService routeService;
    
    // Test endpoint to verify security configuration
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Route test endpoint is working!");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    // Health check endpoint (no database access)
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Route service is healthy");
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    // Database check endpoint
    @GetMapping("/db-check")
    public ResponseEntity<Map<String, Object>> databaseCheck() {
        try {
            // Try to get routes count to test database connection
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection successful");
            response.put("routesCount", routes.size());
            response.put("status", "CONNECTED");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database connection failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "DISCONNECTED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Create test route endpoint
    @PostMapping("/create-test")
    public ResponseEntity<Map<String, Object>> createTestRoute() {
        try {
            CreateRouteRequest testRequest = new CreateRouteRequest();
            testRequest.setFromLocation("Test From");
            testRequest.setToLocation("Test To");
            testRequest.setTicketPrice(1000.0);
            testRequest.setStatus(RouteStatus.ACTIVE);
            
            RouteDto route = routeService.createRoute(testRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test route created successfully");
            response.put("data", route);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create test route: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Schema check endpoint
    @GetMapping("/schema-check")
    public ResponseEntity<Map<String, Object>> schemaCheck() {
        try {
            // Try to create a simple route to test schema
            CreateRouteRequest testRequest = new CreateRouteRequest();
            testRequest.setFromLocation("Schema Test");
            testRequest.setToLocation("Schema Test");
            testRequest.setTicketPrice(500.0);
            testRequest.setStatus(RouteStatus.ACTIVE);
            
            RouteDto route = routeService.createRoute(testRequest);
            
            // Delete the test route
            routeService.deleteRoute(route.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database schema is working correctly");
            response.put("status", "SCHEMA_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database schema issue detected");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "SCHEMA_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Simple ping endpoint (no database access)
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "pong");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    // Database table check endpoint
    @GetMapping("/table-check")
    public ResponseEntity<Map<String, Object>> tableCheck() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database tables exist and are accessible");
            response.put("routesCount", routes.size());
            response.put("status", "TABLES_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table access failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "TABLES_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database connection test endpoint
    @GetMapping("/connection-test")
    public ResponseEntity<Map<String, Object>> connectionTest() {
        try {
            // Try to get routes count to test database connection
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection is working");
            response.put("routesCount", routes.size());
            response.put("status", "CONNECTION_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database connection failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "CONNECTION_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database schema validation endpoint
    @GetMapping("/schema-validation")
    public ResponseEntity<Map<String, Object>> schemaValidation() {
        try {
            // Try to create a simple route to test schema
            CreateRouteRequest testRequest = new CreateRouteRequest();
            testRequest.setFromLocation("Validation Test");
            testRequest.setToLocation("Validation Test");
            testRequest.setTicketPrice(750.0);
            testRequest.setStatus(RouteStatus.ACTIVE);
            
            RouteDto route = routeService.createRoute(testRequest);
            
            // Delete the test route
            routeService.deleteRoute(route.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database schema validation successful");
            response.put("status", "VALIDATION_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database schema validation failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "VALIDATION_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database table existence check endpoint
    @GetMapping("/table-existence")
    public ResponseEntity<Map<String, Object>> tableExistenceCheck() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database tables exist and are accessible");
            response.put("routesCount", routes.size());
            response.put("status", "TABLES_EXIST");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table existence check failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "TABLES_MISSING");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database connection status endpoint
    @GetMapping("/connection-status")
    public ResponseEntity<Map<String, Object>> connectionStatus() {
        try {
            // Try to get routes count to test database connection
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection is healthy");
            response.put("routesCount", routes.size());
            response.put("status", "CONNECTION_HEALTHY");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database connection is unhealthy");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "CONNECTION_UNHEALTHY");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database schema health check endpoint
    @GetMapping("/schema-health")
    public ResponseEntity<Map<String, Object>> schemaHealthCheck() {
        try {
            // Try to create a simple route to test schema
            CreateRouteRequest testRequest = new CreateRouteRequest();
            testRequest.setFromLocation("Health Test");
            testRequest.setToLocation("Health Test");
            testRequest.setTicketPrice(600.0);
            testRequest.setStatus(RouteStatus.ACTIVE);
            
            RouteDto route = routeService.createRoute(testRequest);
            
            // Delete the test route
            routeService.deleteRoute(route.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database schema is healthy");
            response.put("status", "SCHEMA_HEALTHY");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database schema is unhealthy");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "SCHEMA_UNHEALTHY");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database table structure check endpoint
    @GetMapping("/table-structure")
    public ResponseEntity<Map<String, Object>> tableStructureCheck() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database table structure is correct");
            response.put("routesCount", routes.size());
            response.put("status", "STRUCTURE_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table structure issue detected");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "STRUCTURE_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database table access check endpoint
    @GetMapping("/table-access")
    public ResponseEntity<Map<String, Object>> tableAccessCheck() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database table access is working");
            response.put("routesCount", routes.size());
            response.put("status", "ACCESS_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table access failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "ACCESS_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database table existence verification endpoint
    @GetMapping("/table-verification")
    public ResponseEntity<Map<String, Object>> tableVerification() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database table verification successful");
            response.put("routesCount", routes.size());
            response.put("status", "VERIFICATION_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table verification failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "VERIFICATION_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database table existence confirmation endpoint
    @GetMapping("/table-confirmation")
    public ResponseEntity<Map<String, Object>> tableConfirmation() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database table confirmation successful");
            response.put("routesCount", routes.size());
            response.put("status", "CONFIRMATION_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table confirmation failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "CONFIRMATION_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Database table existence final check endpoint
    @GetMapping("/table-final-check")
    public ResponseEntity<Map<String, Object>> tableFinalCheck() {
        try {
            // Try to get routes count to test if tables exist
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database table final check successful");
            response.put("routesCount", routes.size());
            response.put("status", "FINAL_CHECK_OK");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database table final check failed");
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            response.put("status", "FINAL_CHECK_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Create a new route
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRoute(@Valid @RequestBody CreateRouteRequest request) {
        try {
            RouteDto route = routeService.createRoute(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Route created successfully");
            response.put("data", route);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create route: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get all routes
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRoutes() {
        try {
            List<RouteDto> routes = routeService.getAllRoutes();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Routes retrieved successfully");
            response.put("data", routes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve routes: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get route by ID
    @GetMapping("/{routeId}")
    public ResponseEntity<Map<String, Object>> getRouteById(@PathVariable Long routeId) {
        try {
            var route = routeService.getRouteById(routeId);
            if (route.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Route retrieved successfully");
                response.put("data", route.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Route not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve route: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get routes by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getRoutesByStatus(@PathVariable RouteStatus status) {
        try {
            List<RouteDto> routes = routeService.getRoutesByStatus(status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Routes retrieved successfully");
            response.put("data", routes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve routes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Search routes
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRoutes(@RequestParam String q) {
        try {
            List<RouteDto> routes = routeService.searchRoutes(q);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Routes searched successfully");
            response.put("data", routes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to search routes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Search routes for passengers (by from, to, and date)
    @GetMapping("/search/passenger")
    public ResponseEntity<Map<String, Object>> searchRoutesForPassenger(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String date) {
        try {
            List<RouteDto> routes = routeService.searchRoutesForPassenger(from, to, date);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Routes searched successfully");
            response.put("data", routes);
            response.put("totalCount", routes.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to search routes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Update route
    @PutMapping("/{routeId}")
    public ResponseEntity<Map<String, Object>> updateRoute(@PathVariable Long routeId, 
                                                         @Valid @RequestBody CreateRouteRequest request) {
        try {
            var route = routeService.updateRoute(routeId, request);
            if (route.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Route updated successfully");
                response.put("data", route.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Route not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update route: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Delete route
    @DeleteMapping("/{routeId}")
    public ResponseEntity<Map<String, Object>> deleteRoute(@PathVariable Long routeId) {
        try {
            boolean deleted = routeService.deleteRoute(routeId);
            if (deleted) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Route deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Route not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete route: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Assign bus to route
    @PostMapping("/{routeId}/assign")
    public ResponseEntity<Map<String, Object>> assignBusToRoute(@PathVariable Long routeId,
                                                              @Valid @RequestBody CreateAssignmentRequest request) {
        try {
            var assignment = routeService.assignBusToRoute(routeId, request.getBusId(), 
                                                        request.getDepartureDate(), request.getDepartureTime(), 
                                                        request.getAssignedSeats());
            if (assignment.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Bus assigned to route successfully");
                response.put("data", assignment.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Failed to assign bus to route. Check if bus is available or route exists.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to assign bus to route: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Remove bus assignment
    @DeleteMapping("/assignments/{assignmentId}")
    public ResponseEntity<Map<String, Object>> removeBusAssignment(@PathVariable Long assignmentId) {
        try {
            boolean removed = routeService.removeBusAssignment(assignmentId);
            if (removed) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Bus assignment removed successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Assignment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to remove bus assignment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get route statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getRouteStatistics() {
        try {
            var statistics = routeService.getRouteStatistics();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Route statistics retrieved successfully");
            response.put("data", statistics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve route statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

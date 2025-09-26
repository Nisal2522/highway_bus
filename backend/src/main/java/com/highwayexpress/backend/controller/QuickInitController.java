package com.highwayexpress.backend.controller;

import com.highwayexpress.backend.model.*;
import com.highwayexpress.backend.repository.BusRepository;
import com.highwayexpress.backend.repository.RouteRepository;
import com.highwayexpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quick")
@CrossOrigin(origins = "http://localhost:3000")
public class QuickInitController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @GetMapping("/init")
    public ResponseEntity<?> quickInit() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // Check if data already exists
            long userCount = userRepository.count();
            long busCount = busRepository.count();
            long routeCount = routeRepository.count();
            
            if (userCount > 0 && busCount > 0 && routeCount > 0) {
                result.put("message", "Database already initialized");
                result.put("users", userCount);
                result.put("buses", busCount);
                result.put("routes", routeCount);
                return ResponseEntity.ok(result);
            }
            
            // Create sample users
            User user1 = new User();
            user1.setFirstName("John");
            user1.setLastName("Doe");
            user1.setEmail("john.doe@email.com");
            user1.setPhone("+94771234567");
            user1.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi");
            user1.setUserType(UserType.PASSENGER);
            user1.setIdNumber("123456789V");
            userRepository.save(user1);
            
            User user2 = new User();
            user2.setFirstName("Jane");
            user2.setLastName("Smith");
            user2.setEmail("jane.smith@email.com");
            user2.setPhone("+94771234568");
            user2.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi");
            user2.setUserType(UserType.PASSENGER);
            user2.setIdNumber("987654321V");
            userRepository.save(user2);
            
            User busOwner = new User();
            busOwner.setFirstName("Bus");
            busOwner.setLastName("Owner");
            busOwner.setEmail("bus.owner@email.com");
            busOwner.setPhone("+94771234569");
            busOwner.setPassword("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi");
            busOwner.setUserType(UserType.OWNER);
            busOwner.setIdNumber("456789123V");
            userRepository.save(busOwner);
            
            // Create sample buses
            Bus bus1 = new Bus();
            bus1.setBusName("Express Bus 1");
            bus1.setRegistrationNumber("ABC-1234");
            bus1.setSeatingCapacity(40);
            bus1.setOwner(busOwner);
            bus1.setStatus(BusStatus.APPROVED);
            busRepository.save(bus1);
            
            Bus bus2 = new Bus();
            bus2.setBusName("Comfort Bus 2");
            bus2.setRegistrationNumber("XYZ-5678");
            bus2.setSeatingCapacity(35);
            bus2.setOwner(busOwner);
            bus2.setStatus(BusStatus.APPROVED);
            busRepository.save(bus2);
            
            Bus bus3 = new Bus();
            bus3.setBusName("Luxury Bus 3");
            bus3.setRegistrationNumber("DEF-9012");
            bus3.setSeatingCapacity(45);
            bus3.setOwner(busOwner);
            bus3.setStatus(BusStatus.APPROVED);
            busRepository.save(bus3);
            
            // Create sample routes
            Route route1 = new Route();
            route1.setFromLocation("Colombo");
            route1.setToLocation("Kandy");
            route1.setDepartureTime(LocalTime.of(8, 0));
            route1.setArrivalTime(LocalTime.of(11, 0));
            route1.setTicketPrice(1800.00);
            route1.setStatus(RouteStatus.ACTIVE);
            routeRepository.save(route1);
            
            Route route2 = new Route();
            route2.setFromLocation("Colombo");
            route2.setToLocation("Galle");
            route2.setDepartureTime(LocalTime.of(14, 0));
            route2.setArrivalTime(LocalTime.of(17, 30));
            route2.setTicketPrice(1200.00);
            route2.setStatus(RouteStatus.ACTIVE);
            routeRepository.save(route2);
            
            Route route3 = new Route();
            route3.setFromLocation("Kandy");
            route3.setToLocation("Jaffna");
            route3.setDepartureTime(LocalTime.of(6, 0));
            route3.setArrivalTime(LocalTime.of(12, 0));
            route3.setTicketPrice(2500.00);
            route3.setStatus(RouteStatus.ACTIVE);
            routeRepository.save(route3);
            
            result.put("message", "Database initialized successfully");
            result.put("users", userRepository.count());
            result.put("buses", busRepository.count());
            result.put("routes", routeRepository.count());
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to initialize database: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        try {
            Map<String, Object> result = new HashMap<>();
            result.put("users", userRepository.count());
            result.put("buses", busRepository.count());
            result.put("routes", routeRepository.count());
            result.put("status", "Database is accessible");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Database error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}

package com.highwayexpress.backend.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import java.time.LocalDate;
import java.time.LocalTime;

public class CreateAssignmentRequest {
    
    @NotNull(message = "Route ID is required")
    private Long routeId;
    
    @NotNull(message = "Bus ID is required")
    private Long busId;
    
    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;
    
    @NotNull(message = "Departure time is required")
    private LocalTime departureTime;
    
    @NotNull(message = "Assigned seats is required")
    @Min(value = 1, message = "Assigned seats must be at least 1")
    private Integer assignedSeats;
    
    // Default constructor
    public CreateAssignmentRequest() {}
    
    // Constructor with all fields
    public CreateAssignmentRequest(Long routeId, Long busId, LocalDate departureDate, 
                                 LocalTime departureTime, Integer assignedSeats) {
        this.routeId = routeId;
        this.busId = busId;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.assignedSeats = assignedSeats;
    }
    
    // Getters and Setters
    public Long getRouteId() {
        return routeId;
    }
    
    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }
    
    public Long getBusId() {
        return busId;
    }
    
    public void setBusId(Long busId) {
        this.busId = busId;
    }
    
    public LocalDate getDepartureDate() {
        return departureDate;
    }
    
    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }
    
    public LocalTime getDepartureTime() {
        return departureTime;
    }
    
    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }
    
    public Integer getAssignedSeats() {
        return assignedSeats;
    }
    
    public void setAssignedSeats(Integer assignedSeats) {
        this.assignedSeats = assignedSeats;
    }
    
    @Override
    public String toString() {
        return "CreateAssignmentRequest{" +
                "routeId=" + routeId +
                ", busId=" + busId +
                ", departureDate=" + departureDate +
                ", departureTime=" + departureTime +
                ", assignedSeats=" + assignedSeats +
                '}';
    }
}

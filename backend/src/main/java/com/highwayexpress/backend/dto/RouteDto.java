package com.highwayexpress.backend.dto;

import com.highwayexpress.backend.model.RouteStatus;
import java.time.LocalTime;
import java.util.List;

public class RouteDto {
    
    private Long id;
    private String fromLocation;
    private String toLocation;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private Double ticketPrice;
    private RouteStatus status;
    private String description;
    private List<RouteAssignmentDto> routeAssignments;
    
    // Default constructor
    public RouteDto() {}
    
    // Constructor with all fields
    public RouteDto(Long id, String fromLocation, String toLocation, LocalTime departureTime,
                   LocalTime arrivalTime, Double ticketPrice, RouteStatus status, String description) {
        this.id = id;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.ticketPrice = ticketPrice;
        this.status = status;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFromLocation() {
        return fromLocation;
    }
    
    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }
    
    public String getToLocation() {
        return toLocation;
    }
    
    public void setToLocation(String toLocation) {
        this.toLocation = toLocation;
    }
    
    public LocalTime getDepartureTime() {
        return departureTime;
    }
    
    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }
    
    public LocalTime getArrivalTime() {
        return arrivalTime;
    }
    
    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    
    public Double getTicketPrice() {
        return ticketPrice;
    }
    
    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }
    
    public RouteStatus getStatus() {
        return status;
    }
    
    public void setStatus(RouteStatus status) {
        this.status = status;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<RouteAssignmentDto> getRouteAssignments() {
        return routeAssignments;
    }
    
    public void setRouteAssignments(List<RouteAssignmentDto> routeAssignments) {
        this.routeAssignments = routeAssignments;
    }
    
    @Override
    public String toString() {
        return "RouteDto{" +
                "id=" + id +
                ", fromLocation='" + fromLocation + '\'' +
                ", toLocation='" + toLocation + '\'' +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                ", ticketPrice=" + ticketPrice +
                ", status=" + status +
                ", description='" + description + '\'' +
                '}';
    }
}

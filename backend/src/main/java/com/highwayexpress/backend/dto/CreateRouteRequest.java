package com.highwayexpress.backend.dto;

import com.highwayexpress.backend.model.RouteStatus;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import java.time.LocalTime;

public class CreateRouteRequest {
    
    @NotBlank(message = "From location is required")
    private String fromLocation;
    
    @NotBlank(message = "To location is required")
    private String toLocation;
    
    private LocalTime departureTime;
    
    private LocalTime arrivalTime;
    
    @NotNull(message = "Ticket price is required")
    @Min(value = 0, message = "Ticket price must be non-negative")
    private Double ticketPrice;
    
    private RouteStatus status = RouteStatus.ACTIVE;
    
    private String description;
    
    // Default constructor
    public CreateRouteRequest() {}
    
    // Constructor with required fields
    public CreateRouteRequest(String fromLocation, String toLocation, Double ticketPrice) {
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.ticketPrice = ticketPrice;
    }
    
    // Getters and Setters
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
    
    @Override
    public String toString() {
        return "CreateRouteRequest{" +
                "fromLocation='" + fromLocation + '\'' +
                ", toLocation='" + toLocation + '\'' +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                ", ticketPrice=" + ticketPrice +
                ", status=" + status +
                ", description='" + description + '\'' +
                '}';
    }
}

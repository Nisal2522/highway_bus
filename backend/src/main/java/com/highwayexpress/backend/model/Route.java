package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "from_location", nullable = false)
    private String fromLocation;
    
    @Column(name = "to_location", nullable = false)
    private String toLocation;
    
    @Column(name = "departure_time")
    private LocalTime departureTime;
    
    @Column(name = "arrival_time")
    private LocalTime arrivalTime;
    
    @Column(name = "ticket_price", nullable = false)
    private Double ticketPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RouteStatus status;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    @Column(name = "updated_at")
    private Date updatedAt;
    
    // One-to-Many relationship with RouteAssignment
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RouteAssignment> routeAssignments = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
    
    // Default constructor
    public Route() {}
    
    // Constructor with required fields
    public Route(String fromLocation, String toLocation, LocalTime departureTime, 
                LocalTime arrivalTime, Double ticketPrice, RouteStatus status) {
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.ticketPrice = ticketPrice;
        this.status = status;
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
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<RouteAssignment> getRouteAssignments() {
        return routeAssignments;
    }
    
    public void setRouteAssignments(List<RouteAssignment> routeAssignments) {
        this.routeAssignments = routeAssignments;
    }
    
    // Helper methods
    public void addRouteAssignment(RouteAssignment assignment) {
        routeAssignments.add(assignment);
        assignment.setRoute(this);
    }
    
    public void removeRouteAssignment(RouteAssignment assignment) {
        routeAssignments.remove(assignment);
        assignment.setRoute(null);
    }
    
    @Override
    public String toString() {
        return "Route{" +
                "id=" + id +
                ", fromLocation='" + fromLocation + '\'' +
                ", toLocation='" + toLocation + '\'' +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                ", ticketPrice=" + ticketPrice +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

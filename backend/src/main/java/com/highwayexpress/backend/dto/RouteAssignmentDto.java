package com.highwayexpress.backend.dto;

import com.highwayexpress.backend.model.AssignmentStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public class RouteAssignmentDto {
    
    private Long id;
    private Long routeId;
    private Long busId;
    private String busName;
    private String registrationNumber;
    private Integer busCapacity;
    private LocalDate departureDate;
    private LocalTime departureTime;
    private Integer assignedSeats;
    private AssignmentStatus status;
    private String ownerName;
    
    // Default constructor
    public RouteAssignmentDto() {}
    
    // Constructor with all fields
    public RouteAssignmentDto(Long id, Long routeId, Long busId, String busName,
                            String registrationNumber, Integer busCapacity,
                            LocalDate departureDate, LocalTime departureTime,
                            Integer assignedSeats, AssignmentStatus status, String ownerName) {
        this.id = id;
        this.routeId = routeId;
        this.busId = busId;
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.busCapacity = busCapacity;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.assignedSeats = assignedSeats;
        this.status = status;
        this.ownerName = ownerName;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getBusName() {
        return busName;
    }
    
    public void setBusName(String busName) {
        this.busName = busName;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
    
    public Integer getBusCapacity() {
        return busCapacity;
    }
    
    public void setBusCapacity(Integer busCapacity) {
        this.busCapacity = busCapacity;
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
    
    public AssignmentStatus getStatus() {
        return status;
    }
    
    public void setStatus(AssignmentStatus status) {
        this.status = status;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    @Override
    public String toString() {
        return "RouteAssignmentDto{" +
                "id=" + id +
                ", routeId=" + routeId +
                ", busId=" + busId +
                ", busName='" + busName + '\'' +
                ", registrationNumber='" + registrationNumber + '\'' +
                ", busCapacity=" + busCapacity +
                ", departureDate=" + departureDate +
                ", departureTime=" + departureTime +
                ", assignedSeats=" + assignedSeats +
                ", status=" + status +
                ", ownerName='" + ownerName + '\'' +
                '}';
    }
}

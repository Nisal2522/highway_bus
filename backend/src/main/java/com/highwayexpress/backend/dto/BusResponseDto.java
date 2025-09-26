package com.highwayexpress.backend.dto;

import com.highwayexpress.backend.model.BusStatus;
import java.time.LocalDateTime;

public class BusResponseDto {
    
    private Long id;
    private String busName;
    private String registrationNumber;
    private Integer seatingCapacity;
    private String busBookCopyUrl;
    private String ownerIdCopyUrl;
    private Long ownerId;
    private String ownerName;
    private BusStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public BusResponseDto() {}
    
    public BusResponseDto(Long id, String busName, String registrationNumber, Integer seatingCapacity, 
                         String busBookCopyUrl, String ownerIdCopyUrl, Long ownerId, String ownerName, 
                         BusStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.seatingCapacity = seatingCapacity;
        this.busBookCopyUrl = busBookCopyUrl;
        this.ownerIdCopyUrl = ownerIdCopyUrl;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Integer getSeatingCapacity() {
        return seatingCapacity;
    }
    
    public void setSeatingCapacity(Integer seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }
    
    public String getBusBookCopyUrl() {
        return busBookCopyUrl;
    }
    
    public void setBusBookCopyUrl(String busBookCopyUrl) {
        this.busBookCopyUrl = busBookCopyUrl;
    }
    
    public String getOwnerIdCopyUrl() {
        return ownerIdCopyUrl;
    }
    
    public void setOwnerIdCopyUrl(String ownerIdCopyUrl) {
        this.ownerIdCopyUrl = ownerIdCopyUrl;
    }
    
    public Long getOwnerId() {
        return ownerId;
    }
    
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }
    
    public BusStatus getStatus() {
        return status;
    }
    
    public void setStatus(BusStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

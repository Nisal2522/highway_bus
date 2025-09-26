package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import javax.validation.constraints.Max;
import java.time.LocalDateTime;
import javax.validation.constraints.Size;

@Entity
@Table(name = "buses")
public class Bus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Bus name is required")
    @Size(max = 100, message = "Bus name cannot exceed 100 characters")
    @Column(name = "bus_name", nullable = false)
    private String busName;
    
    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    @Column(name = "registration_number", unique = true, nullable = false)
    private String registrationNumber;
    
    @NotNull(message = "Seating capacity is required")
    @Min(value = 1, message = "Seating capacity must be at least 1")
    @Max(value = 100, message = "Seating capacity cannot exceed 100")
    @Column(name = "seating_capacity", nullable = false)
    private Integer seatingCapacity;
    
    @Column(name = "bus_book_copy_url")
    private String busBookCopyUrl;
    
    @Column(name = "owner_id_copy_url")
    private String ownerIdCopyUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BusStatus status = BusStatus.PENDING;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Bus() {}
    
    public Bus(String busName, String registrationNumber, Integer seatingCapacity, User owner) {
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.seatingCapacity = seatingCapacity;
        this.owner = owner;
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
    
    public User getOwner() {
        return owner;
    }
    
    public void setOwner(User owner) {
        this.owner = owner;
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

package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "TourRoutePackages")
public class TourRoutePackage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @NotNull(message = "Route is required")
    private TourRoute route;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    @NotNull(message = "Package is required")
    private TourPackage package_;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Default constructor
    public TourRoutePackage() {}
    
    // Constructor with required fields
    public TourRoutePackage(TourRoute route, TourPackage package_) {
        this.route = route;
        this.package_ = package_;
        this.isAvailable = true;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TourRoute getRoute() {
        return route;
    }
    
    public void setRoute(TourRoute route) {
        this.route = route;
    }
    
    public TourPackage getPackage_() {
        return package_;
    }
    
    public void setPackage_(TourPackage package_) {
        this.package_ = package_;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "TourRoutePackage{" +
                "id=" + id +
                ", isAvailable=" + isAvailable +
                ", createdAt=" + createdAt +
                '}';
    }
}

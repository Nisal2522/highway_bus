package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TourPackageOptions")
public class TourPackageOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private TourPackage package_;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "option_type", nullable = false)
    @NotNull(message = "Option type is required")
    private OptionType optionType;
    
    @Column(name = "name", nullable = false)
    @NotBlank(message = "Option name is required")
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "price")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price = BigDecimal.ZERO;
    
    @Column(name = "is_default")
    private Boolean isDefault = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
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
    
    // Default constructor
    public TourPackageOption() {}
    
    // Constructor with required fields
    public TourPackageOption(TourPackage package_, OptionType optionType, String name) {
        this.package_ = package_;
        this.optionType = optionType;
        this.name = name;
        this.isActive = true;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TourPackage getPackage_() {
        return package_;
    }
    
    public void setPackage_(TourPackage package_) {
        this.package_ = package_;
    }
    
    public OptionType getOptionType() {
        return optionType;
    }
    
    public void setOptionType(OptionType optionType) {
        this.optionType = optionType;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public Boolean getIsDefault() {
        return isDefault;
    }
    
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
    
    @Override
    public String toString() {
        return "TourPackageOption{" +
                "id=" + id +
                ", optionType=" + optionType +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", isDefault=" + isDefault +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

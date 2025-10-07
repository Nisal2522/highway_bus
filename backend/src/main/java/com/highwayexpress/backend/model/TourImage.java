package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "TourImages")
public class TourImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private TourRoute route;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private TourCategory category;
    
    @Column(name = "image_url", nullable = false)
    @NotBlank(message = "Image URL is required")
    private String imageUrl;
    
    @Column(name = "alt_text")
    private String altText;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "image_type")
    private ImageType imageType = ImageType.GALLERY;
    
    @Column(name = "sort_order")
    @Min(value = 0, message = "Sort order must be non-negative")
    private Integer sortOrder = 0;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Default constructor
    public TourImage() {}
    
    // Constructor with required fields
    public TourImage(String imageUrl) {
        this.imageUrl = imageUrl;
        this.isActive = true;
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
    
    public TourCategory getCategory() {
        return category;
    }
    
    public void setCategory(TourCategory category) {
        this.category = category;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getAltText() {
        return altText;
    }
    
    public void setAltText(String altText) {
        this.altText = altText;
    }
    
    public ImageType getImageType() {
        return imageType;
    }
    
    public void setImageType(ImageType imageType) {
        this.imageType = imageType;
    }
    
    public Integer getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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
    
    @Override
    public String toString() {
        return "TourImage{" +
                "id=" + id +
                ", imageUrl='" + imageUrl + '\'' +
                ", altText='" + altText + '\'' +
                ", imageType=" + imageType +
                ", sortOrder=" + sortOrder +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                '}';
    }
}

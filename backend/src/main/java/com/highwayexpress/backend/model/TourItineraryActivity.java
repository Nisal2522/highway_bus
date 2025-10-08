package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "TourItineraryActivities")
public class TourItineraryActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private TourItinerary itinerary;
    
    @Column(name = "icon")
    private String icon;
    
    @Column(name = "activity_text", nullable = false)
    @NotBlank(message = "Activity text is required")
    private String activityText;
    
    @Column(name = "sort_order")
    @Min(value = 0, message = "Sort order must be non-negative")
    private Integer sortOrder = 0;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Default constructor
    public TourItineraryActivity() {}
    
    // Constructor with required fields
    public TourItineraryActivity(TourItinerary itinerary, String activityText) {
        this.itinerary = itinerary;
        this.activityText = activityText;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TourItinerary getItinerary() {
        return itinerary;
    }
    
    public void setItinerary(TourItinerary itinerary) {
        this.itinerary = itinerary;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public String getActivityText() {
        return activityText;
    }
    
    public void setActivityText(String activityText) {
        this.activityText = activityText;
    }
    
    public Integer getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "TourItineraryActivity{" +
                "id=" + id +
                ", icon='" + icon + '\'' +
                ", activityText='" + activityText + '\'' +
                ", sortOrder=" + sortOrder +
                ", createdAt=" + createdAt +
                '}';
    }
}

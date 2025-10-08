package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TourBookingItems")
public class TourBookingItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private TourBooking booking;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "option_type", nullable = false)
    @NotNull(message = "Option type is required")
    private OptionType optionType;
    
    @Column(name = "option_name", nullable = false)
    @NotBlank(message = "Option name is required")
    private String optionName;
    
    @Column(name = "option_price", nullable = false)
    @NotNull(message = "Option price is required")
    @Min(value = 0, message = "Option price must be positive")
    private BigDecimal optionPrice;
    
    @Column(name = "quantity")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;
    
    @Column(name = "total_price", nullable = false)
    @NotNull(message = "Total price is required")
    @Min(value = 0, message = "Total price must be positive")
    private BigDecimal totalPrice;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // Calculate total price if not set
        if (totalPrice == null && optionPrice != null && quantity != null) {
            totalPrice = optionPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
    
    // Default constructor
    public TourBookingItem() {}
    
    // Constructor with required fields
    public TourBookingItem(TourBooking booking, OptionType optionType, String optionName, 
                          BigDecimal optionPrice, Integer quantity) {
        this.booking = booking;
        this.optionType = optionType;
        this.optionName = optionName;
        this.optionPrice = optionPrice;
        this.quantity = quantity;
        this.totalPrice = optionPrice.multiply(BigDecimal.valueOf(quantity));
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TourBooking getBooking() {
        return booking;
    }
    
    public void setBooking(TourBooking booking) {
        this.booking = booking;
    }
    
    public OptionType getOptionType() {
        return optionType;
    }
    
    public void setOptionType(OptionType optionType) {
        this.optionType = optionType;
    }
    
    public String getOptionName() {
        return optionName;
    }
    
    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }
    
    public BigDecimal getOptionPrice() {
        return optionPrice;
    }
    
    public void setOptionPrice(BigDecimal optionPrice) {
        this.optionPrice = optionPrice;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "TourBookingItem{" +
                "id=" + id +
                ", optionType=" + optionType +
                ", optionName='" + optionName + '\'' +
                ", optionPrice=" + optionPrice +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                ", createdAt=" + createdAt +
                '}';
    }
}

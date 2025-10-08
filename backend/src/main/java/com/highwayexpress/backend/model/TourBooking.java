package com.highwayexpress.backend.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "TourBookings")
public class TourBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private TourRoute route;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private TourPackage package_;
    
    @Column(name = "booking_reference", nullable = false, unique = true)
    @NotBlank(message = "Booking reference is required")
    private String bookingReference;
    
    @Column(name = "full_name", nullable = false)
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Column(name = "email", nullable = false)
    @NotBlank(message = "Email is required")
    private String email;
    
    @Column(name = "phone", nullable = false)
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "Address is required")
    private String address;
    
    @Column(name = "start_date", nullable = false)
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    @Column(name = "number_of_days", nullable = false)
    @NotNull(message = "Number of days is required")
    @Min(value = 1, message = "Number of days must be at least 1")
    private Integer numberOfDays;
    
    @Column(name = "total_price", nullable = false)
    @NotNull(message = "Total price is required")
    @Min(value = 0, message = "Total price must be positive")
    private BigDecimal totalPrice;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Status is required")
    private TourBookingStatus status = TourBookingStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TourBookingItem> bookingItems;
    
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
    public TourBooking() {}
    
    // Constructor with required fields
    public TourBooking(User user, TourRoute route, TourPackage package_, String bookingReference, 
                      String fullName, String email, String phone, String address,
                      LocalDate startDate, LocalDate endDate, Integer numberOfDays, BigDecimal totalPrice) {
        this.user = user;
        this.route = route;
        this.package_ = package_;
        this.bookingReference = bookingReference;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfDays = numberOfDays;
        this.totalPrice = totalPrice;
        this.status = TourBookingStatus.PENDING;
        this.paymentStatus = PaymentStatus.PENDING;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    public String getBookingReference() {
        return bookingReference;
    }
    
    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Integer getNumberOfDays() {
        return numberOfDays;
    }
    
    public void setNumberOfDays(Integer numberOfDays) {
        this.numberOfDays = numberOfDays;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
    
    public TourBookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(TourBookingStatus status) {
        this.status = status;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
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
    
    public List<TourBookingItem> getBookingItems() {
        return bookingItems;
    }
    
    public void setBookingItems(List<TourBookingItem> bookingItems) {
        this.bookingItems = bookingItems;
    }
    
    @Override
    public String toString() {
        return "TourBooking{" +
                "id=" + id +
                ", bookingReference='" + bookingReference + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", numberOfDays=" + numberOfDays +
                ", totalPrice=" + totalPrice +
                ", status=" + status +
                ", paymentStatus=" + paymentStatus +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}

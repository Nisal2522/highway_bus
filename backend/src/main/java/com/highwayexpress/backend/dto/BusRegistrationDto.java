package com.highwayexpress.backend.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Min;
import javax.validation.constraints.Max;
import javax.validation.constraints.Size;

public class BusRegistrationDto {
    
    @NotBlank(message = "Bus name is required")
    @Size(max = 100, message = "Bus name cannot exceed 100 characters")
    private String busName;
    
    @NotBlank(message = "Registration number is required")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters")
    private String registrationNumber;
    
    @NotNull(message = "Seating capacity is required")
    @Min(value = 1, message = "Seating capacity must be at least 1")
    @Max(value = 100, message = "Seating capacity cannot exceed 100")
    private Integer seatingCapacity;
    
    // Constructors
    public BusRegistrationDto() {}
    
    public BusRegistrationDto(String busName, String registrationNumber, Integer seatingCapacity) {
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.seatingCapacity = seatingCapacity;
    }
    
    // Getters and Setters
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
}

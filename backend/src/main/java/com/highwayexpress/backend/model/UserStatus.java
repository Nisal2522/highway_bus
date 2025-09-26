package com.highwayexpress.backend.model;

public enum UserStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    PENDING("Pending");
    
    private final String displayName;
    
    UserStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    // Add method to handle database values that might not match exactly
    public static UserStatus fromString(String value) {
        if (value == null) {
            return ACTIVE; // Default value
        }
        
        try {
            return UserStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // If the value doesn't match any enum, return default
            return ACTIVE;
        }
    }
}

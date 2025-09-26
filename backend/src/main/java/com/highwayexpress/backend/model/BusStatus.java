package com.highwayexpress.backend.model;

public enum BusStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    ACTIVE("Active"),
    INACTIVE("Inactive");
    
    private final String displayName;
    
    BusStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

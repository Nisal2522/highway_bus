package com.highwayexpress.backend.converter;

import com.highwayexpress.backend.model.UserStatus;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class UserStatusConverter implements AttributeConverter<UserStatus, String> {

    @Override
    public String convertToDatabaseColumn(UserStatus userStatus) {
        if (userStatus == null) {
            return "ACTIVE"; // Default value
        }
        return userStatus.name();
    }

    @Override
    public UserStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return UserStatus.ACTIVE; // Default value
        }
        
        try {
            return UserStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // If the value doesn't match any enum, return default
            return UserStatus.ACTIVE;
        }
    }
}

# Bus Registration System - Highway Express Backend

This document describes the bus registration system implemented for the Highway Express application using Spring Boot and MySQL.

## Overview

The bus registration system allows bus owners to register their buses with the platform, including uploading necessary documents like bus book copies and owner ID copies. The system provides a complete CRUD API for managing bus registrations.

## Features

- ✅ Bus registration with document uploads
- ✅ File validation (JPG, PNG, PDF up to 10MB)
- ✅ Registration number uniqueness validation
- ✅ Bus status management (PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE)
- ✅ Owner-based bus filtering
- ✅ Status-based bus filtering
- ✅ Document retrieval API
- ✅ Complete REST API endpoints

## Database Schema

### Buses Table
```sql
CREATE TABLE buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    seating_capacity INT NOT NULL CHECK (seating_capacity >= 1 AND seating_capacity <= 100),
    bus_book_copy_path VARCHAR(255),
    owner_id_copy_path VARCHAR(255),
    owner_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### 1. Register New Bus
```
POST /api/buses
Content-Type: multipart/form-data

Parameters:
- busName (String, required)
- registrationNumber (String, required, unique)
- seatingCapacity (Integer, required, 1-100)
- busBookCopy (File, optional)
- ownerIdCopy (File, optional)
- ownerId (Long, required)

Response:
{
  "success": true,
  "message": "Bus registered successfully",
  "data": {
    "id": 1,
    "busName": "Express Deluxe",
    "registrationNumber": "ABC-1234",
    "seatingCapacity": 45,
    "busBookCopyPath": "bus-documents/bus_uuid.pdf",
    "ownerIdCopyPath": "owner-documents/owner_uuid.jpg",
    "ownerId": 1,
    "ownerName": "John Doe",
    "status": "PENDING",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### 2. Get All Buses
```
GET /api/buses

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "busName": "Express Deluxe",
      "registrationNumber": "ABC-1234",
      "seatingCapacity": 45,
      "ownerId": 1,
      "ownerName": "John Doe",
      "status": "PENDING",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### 3. Get Bus by ID
```
GET /api/buses/{busId}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "busName": "Express Deluxe",
    "registrationNumber": "ABC-1234",
    "seatingCapacity": 45,
    "ownerId": 1,
    "ownerName": "John Doe",
    "status": "PENDING",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### 4. Get Buses by Owner
```
GET /api/buses/owner/{ownerId}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "busName": "Express Deluxe",
      "registrationNumber": "ABC-1234",
      "seatingCapacity": 45,
      "ownerId": 1,
      "ownerName": "John Doe",
      "status": "PENDING",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### 5. Get Buses by Status
```
GET /api/buses/status/{status}

Valid statuses: PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "busName": "Express Deluxe",
      "registrationNumber": "ABC-1234",
      "seatingCapacity": 45,
      "ownerId": 1,
      "ownerName": "John Doe",
      "status": "PENDING",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### 6. Update Bus Status
```
PUT /api/buses/{busId}/status?status={newStatus}

Response:
{
  "success": true,
  "message": "Bus status updated successfully",
  "data": {
    "id": 1,
    "busName": "Express Deluxe",
    "registrationNumber": "ABC-1234",
    "seatingCapacity": 45,
    "ownerId": 1,
    "ownerName": "John Doe",
    "status": "APPROVED",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T11:00:00"
  }
}
```

### 7. Delete Bus
```
DELETE /api/buses/{busId}

Response:
{
  "success": true,
  "message": "Bus deleted successfully"
}
```

### 8. Check Registration Number Availability
```
GET /api/buses/check-registration/{registrationNumber}

Response:
{
  "success": true,
  "exists": false,
  "message": "Registration number is available"
}
```

### 9. Get Document
```
GET /api/buses/documents/{filePath}

Response: File content with appropriate Content-Type
```

## File Upload System

### Supported File Types
- Images: JPG, JPEG, PNG
- Documents: PDF
- Maximum file size: 10MB

### File Storage Structure
```
uploads/
├── bus-documents/
│   ├── bus_uuid1.pdf
│   └── bus_uuid2.jpg
└── owner-documents/
    ├── owner_uuid1.jpg
    └── owner_uuid2.pdf
```

### File Validation
- File size validation (max 10MB)
- File type validation
- Unique filename generation using UUID
- Secure file path handling

## Implementation Details

### Key Components

1. **Bus Entity** (`Bus.java`)
   - JPA entity with validation annotations
   - Relationship with User entity
   - Automatic timestamp management

2. **BusStatus Enum** (`BusStatus.java`)
   - Defines possible bus statuses
   - Includes display names for UI

3. **DTOs**
   - `BusRegistrationDto`: For incoming registration requests
   - `BusResponseDto`: For API responses

4. **Repository** (`BusRepository.java`)
   - Custom queries for efficient data retrieval
   - Support for owner and status filtering

5. **Service** (`BusService.java`)
   - Business logic implementation
   - File upload integration
   - Data validation and transformation

6. **Controller** (`BusController.java`)
   - REST API endpoints
   - Multipart file handling
   - Comprehensive error handling

7. **File Upload Service** (`FileUploadService.java`)
   - File validation and storage
   - Secure file handling
   - Document retrieval

### Error Handling

The API provides comprehensive error handling:
- Validation errors (400 Bad Request)
- Not found errors (404 Not Found)
- File upload errors (500 Internal Server Error)
- Consistent error response format

### Security Considerations

- File type validation
- File size limits
- Secure file path handling
- CORS configuration for frontend integration
- Input validation and sanitization

## Setup Instructions

### 1. Database Setup
```bash
# Run the database setup script
mysql -u root -p < bus_database_setup.sql
```

### 2. Application Properties
Ensure your `application.properties` includes:
```properties
# File upload configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 3. Frontend Integration
The frontend form (`NewbusFrom.js`) has been updated to:
- Use FormData for file uploads
- Send requests to the backend API
- Handle success and error responses
- Navigate to dashboard on success

## Testing

### Sample API Calls

1. **Register a new bus:**
```bash
curl -X POST http://localhost:8081/api/buses \
  -F "busName=Express Deluxe" \
  -F "registrationNumber=ABC-1234" \
  -F "seatingCapacity=45" \
  -F "busBookCopy=@/path/to/bus-book.pdf" \
  -F "ownerIdCopy=@/path/to/owner-id.jpg" \
  -F "ownerId=1"
```

2. **Get all buses:**
```bash
curl http://localhost:8081/api/buses
```

3. **Get buses by owner:**
```bash
curl http://localhost:8081/api/buses/owner/1
```

4. **Update bus status:**
```bash
curl -X PUT "http://localhost:8081/api/buses/1/status?status=APPROVED"
```

## Future Enhancements

1. **Image Processing**
   - Automatic image resizing
   - Thumbnail generation
   - Image compression

2. **Document Management**
   - OCR for document text extraction
   - Document versioning
   - Document approval workflow

3. **Notifications**
   - Email notifications for status changes
   - SMS notifications for urgent updates
   - Push notifications for mobile app

4. **Analytics**
   - Bus registration statistics
   - Status distribution reports
   - Owner activity tracking

## Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size (max 10MB)
   - Verify file type (JPG, PNG, PDF only)
   - Ensure upload directory permissions

2. **Database Connection Issues**
   - Verify MySQL is running on port 3307
   - Check database credentials in application.properties
   - Ensure database exists

3. **CORS Issues**
   - Verify CORS configuration in application.properties
   - Check frontend URL in allowed origins

4. **Validation Errors**
   - Check required fields are provided
   - Verify registration number uniqueness
   - Ensure seating capacity is between 1-100

### Logs
Enable debug logging in `application.properties`:
```properties
logging.level.com.highwayexpress.backend=DEBUG
logging.level.org.springframework.web=DEBUG
```

## Support

For issues or questions regarding the bus registration system, please refer to:
- Spring Boot documentation
- MySQL documentation
- JPA/Hibernate documentation
- File upload best practices

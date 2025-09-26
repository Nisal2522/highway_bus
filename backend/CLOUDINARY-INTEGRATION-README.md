# Cloudinary Integration for Bus Registration System

This document describes the Cloudinary integration implemented for the Highway Express bus registration system, replacing local file storage with cloud-based file management.

## Overview

The system now uses Cloudinary for file uploads, providing:
- ✅ Cloud-based file storage
- ✅ Automatic image optimization
- ✅ CDN delivery for fast access
- ✅ Secure file URLs
- ✅ Automatic file format detection
- ✅ Built-in image transformations

## Cloudinary Setup

### 1. Create Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 2. Update Application Properties
Update `application.properties` with your Cloudinary credentials:

```properties
# Cloudinary Configuration
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
cloudinary.secure=true
```

### 3. Dependencies
The following Cloudinary dependencies are already added to `pom.xml`:

```xml
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.33.0</version>
</dependency>
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-taglib</artifactId>
    <version>1.33.0</version>
</dependency>
```

## Implementation Details

### Key Components

1. **CloudinaryConfig** (`CloudinaryConfig.java`)
   - Configures Cloudinary client with credentials
   - Creates Cloudinary bean for dependency injection

2. **FileUploadService** (`FileUploadService.java`)
   - Handles file uploads to Cloudinary
   - Validates file types and sizes
   - Generates unique public IDs
   - Manages file deletion

3. **Updated Database Schema**
   - Changed from `bus_book_copy_path` to `bus_book_copy_url`
   - Changed from `owner_id_copy_path` to `owner_id_copy_url`
   - Increased column size to accommodate Cloudinary URLs

### File Upload Process

1. **File Validation**
   - File size limit: 10MB
   - Supported formats: JPG, JPEG, PNG, PDF
   - File name sanitization

2. **Cloudinary Upload**
   - Files uploaded to organized folders:
     - `bus-documents/` for bus book copies
     - `owner-documents/` for owner ID copies
   - Automatic resource type detection
   - Unique public ID generation

3. **URL Storage**
   - Secure HTTPS URLs stored in database
   - URLs are publicly accessible via CDN
   - Automatic image optimization

### File Management

#### Upload
```java
// Upload bus document
String busBookUrl = fileUploadService.uploadBusDocument(busBookFile);

// Upload owner document
String ownerIdUrl = fileUploadService.uploadOwnerDocument(ownerIdFile);
```

#### Delete
```java
// Delete file from Cloudinary
fileUploadService.deleteFile(fileUrl);
```

#### Access
```java
// Get file URL (directly accessible)
String fileUrl = bus.getBusBookCopyUrl();
```

## API Changes

### Updated Response Format
```json
{
  "success": true,
  "message": "Bus registered successfully",
  "data": {
    "id": 1,
    "busName": "Express Deluxe",
    "registrationNumber": "ABC-1234",
    "seatingCapacity": 45,
    "busBookCopyUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bus-documents/bus_book_1234567890.pdf",
    "ownerIdCopyUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/owner-documents/owner_id_1234567890.jpg",
    "ownerId": 1,
    "ownerName": "John Doe",
    "status": "PENDING",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### Document Access
Files are now directly accessible via their Cloudinary URLs, eliminating the need for a separate document download endpoint.

## Database Migration

### Schema Changes
```sql
-- Old columns (remove)
ALTER TABLE buses DROP COLUMN bus_book_copy_path;
ALTER TABLE buses DROP COLUMN owner_id_copy_path;

-- New columns (add)
ALTER TABLE buses ADD COLUMN bus_book_copy_url VARCHAR(500);
ALTER TABLE buses ADD COLUMN owner_id_copy_url VARCHAR(500);
```

### Migration Script
```sql
-- Migration script for existing data
-- Note: This is a placeholder - actual migration depends on your data

-- If you have existing local files, you would need to:
-- 1. Upload them to Cloudinary
-- 2. Update the database with new URLs
-- 3. Remove local files

-- Example migration (adjust based on your needs):
-- UPDATE buses SET bus_book_copy_url = 'https://cloudinary-url' WHERE bus_book_copy_path IS NOT NULL;
-- UPDATE buses SET owner_id_copy_url = 'https://cloudinary-url' WHERE owner_id_copy_path IS NOT NULL;
```

## Frontend Integration

### File Upload
The frontend form (`NewbusFrom.js`) remains the same - it still uses FormData for file uploads.

### File Display
To display uploaded files, use the URLs directly:

```javascript
// Display bus book copy
if (bus.busBookCopyUrl) {
    const link = document.createElement('a');
    link.href = bus.busBookCopyUrl;
    link.textContent = 'View Bus Book Copy';
    link.target = '_blank';
}

// Display owner ID copy
if (bus.ownerIdCopyUrl) {
    const img = document.createElement('img');
    img.src = bus.ownerIdCopyUrl;
    img.alt = 'Owner ID Copy';
}
```

## Benefits of Cloudinary Integration

### 1. **Scalability**
- No server storage limitations
- Automatic CDN distribution
- Global file access

### 2. **Performance**
- Optimized image delivery
- Automatic format conversion
- Lazy loading support

### 3. **Security**
- Secure HTTPS URLs
- Access control options
- Automatic virus scanning

### 4. **Cost Efficiency**
- Pay-as-you-use pricing
- No server storage costs
- Automatic backup

### 5. **Features**
- Automatic image optimization
- Multiple format support
- Transformation capabilities
- Analytics and insights

## Cloudinary Features

### Image Transformations
You can add transformations to URLs:

```javascript
// Resize image
const resizedUrl = bus.ownerIdCopyUrl.replace('/upload/', '/upload/w_300,h_200,c_fill/');

// Convert to webp
const webpUrl = bus.ownerIdCopyUrl.replace('/upload/', '/upload/f_webp/');

// Add watermark
const watermarkedUrl = bus.busBookCopyUrl.replace('/upload/', '/upload/l_watermark,w_100/');
```

### Folder Organization
Files are organized in Cloudinary folders:
- `bus-documents/` - Bus book copies
- `owner-documents/` - Owner ID copies

### Public IDs
Files get unique public IDs:
- Format: `filename_timestamp`
- Example: `bus_book_1234567890.pdf`

## Security Considerations

### 1. **API Key Security**
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly

### 2. **Access Control**
- Files are publicly accessible by default
- Consider signed URLs for sensitive documents
- Implement access control if needed

### 3. **File Validation**
- Server-side file type validation
- File size limits
- Malware scanning (Cloudinary feature)

## Monitoring and Analytics

### Cloudinary Dashboard
- Track upload usage
- Monitor bandwidth
- View transformation statistics
- Analyze performance

### Application Logging
```properties
# Enable Cloudinary logging
logging.level.com.cloudinary=DEBUG
```

## Troubleshooting

### Common Issues

1. **Upload Failures**
   - Check API credentials
   - Verify file size limits
   - Ensure proper file format

2. **URL Access Issues**
   - Verify HTTPS URLs
   - Check CORS settings
   - Ensure public access

3. **Performance Issues**
   - Use Cloudinary transformations
   - Implement lazy loading
   - Optimize image formats

### Error Handling
```java
try {
    String url = fileUploadService.uploadBusDocument(file);
} catch (IOException e) {
    // Handle upload error
    logger.error("File upload failed: " + e.getMessage());
}
```

## Future Enhancements

### 1. **Advanced Transformations**
- Automatic image resizing
- Format optimization
- Quality adjustments

### 2. **Access Control**
- Signed URLs for sensitive files
- Time-limited access
- User-based permissions

### 3. **Analytics**
- Upload statistics
- Usage tracking
- Performance monitoring

### 4. **Backup and Recovery**
- Automatic backups
- Version control
- Disaster recovery

## Support

For Cloudinary-specific issues:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com)
- [Cloudinary Community](https://community.cloudinary.com)

For application integration issues:
- Check application logs
- Verify configuration
- Test with sample files

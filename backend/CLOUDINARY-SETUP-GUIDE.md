# Cloudinary Setup Guide - Highway Express

## ✅ Configuration Complete!

Your Cloudinary credentials have been successfully configured in the application:

- **Cloud Name**: `dwednnm0l`
- **API Key**: `945878452227289`
- **API Secret**: `vgPKBAauY6BEmu0VepDRMVDMhwM`

## 🚀 Next Steps

### 1. **Database Setup**
Run the database migration to update the schema:

```sql
-- If you have an existing buses table, run these commands:
ALTER TABLE buses ADD COLUMN bus_book_copy_url VARCHAR(500);
ALTER TABLE buses ADD COLUMN owner_id_copy_url VARCHAR(500);

-- Or run the complete setup script:
mysql -u root -p < bus_database_setup.sql
```

### 2. **Start the Backend**
```bash
cd backend
./mvnw spring-boot:run
```

### 3. **Test File Upload**
Your `NewbusFrom.js` form will now upload files to Cloudinary instead of local storage.

## 📁 File Organization in Cloudinary

Files will be organized in your Cloudinary account as follows:

```
dwednnm0l/
├── bus-documents/
│   ├── bus_book_1234567890.pdf
│   └── bus_book_1234567891.jpg
└── owner-documents/
    ├── owner_id_1234567890.jpg
    └── owner_id_1234567891.pdf
```

## 🔗 File URLs

Uploaded files will have URLs like:
```
https://res.cloudinary.com/dwednnm0l/image/upload/v1234567890/bus-documents/bus_book_1234567890.pdf
```

## 🧪 Testing

### Test Bus Registration
1. Start your frontend application
2. Navigate to the bus registration form
3. Fill in the form and upload files
4. Submit the form
5. Check your Cloudinary dashboard to see uploaded files

### API Testing
```bash
# Test bus registration with files
curl -X POST http://localhost:8081/api/buses \
  -F "busName=Test Bus" \
  -F "registrationNumber=TEST-123" \
  -F "seatingCapacity=45" \
  -F "busBookCopy=@/path/to/test-file.pdf" \
  -F "ownerIdCopy=@/path/to/test-image.jpg" \
  -F "ownerId=1"
```

## 📊 Monitor Usage

Visit your Cloudinary dashboard at: https://cloudinary.com/console

You can monitor:
- File uploads
- Storage usage
- Bandwidth consumption
- Transformation statistics

## 🔒 Security Notes

- Your API credentials are now in the application properties
- For production, consider using environment variables
- Files uploaded to Cloudinary are publicly accessible by default
- Consider implementing access control for sensitive documents

## 🆘 Troubleshooting

### Common Issues:

1. **Upload Fails**
   - Check if backend is running on port 8081
   - Verify file size (max 10MB)
   - Ensure file format is supported (JPG, PNG, PDF)

2. **Database Errors**
   - Run the database migration script
   - Check MySQL connection settings

3. **CORS Issues**
   - Verify CORS configuration in application.properties
   - Check frontend URL in allowed origins

## 📞 Support

If you encounter any issues:
1. Check the application logs
2. Verify Cloudinary dashboard for upload status
3. Test with smaller files first
4. Ensure all dependencies are properly installed

---

**🎉 Your Cloudinary integration is ready to use!**

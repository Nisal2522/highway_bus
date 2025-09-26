package com.highwayexpress.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileUploadService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    // Allowed file types
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"};
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    
    public String uploadBusDocument(MultipartFile file) throws IOException {
        return uploadFile(file, "bus-documents");
    }
    
    public String uploadOwnerDocument(MultipartFile file) throws IOException {
        return uploadFile(file, "owner-documents");
    }
    
    private String uploadFile(MultipartFile file, String folder) throws IOException {
        // Validate file
        validateFile(file);
        
        try {
            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "auto",
                    "public_id", generatePublicId(file.getOriginalFilename())
                )
            );
            
            // Return the secure URL
            return (String) uploadResult.get("secure_url");
            
        } catch (Exception e) {
            throw new IOException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size cannot exceed 10MB");
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("File name cannot be null");
        }
        
        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        
        boolean isValidExtension = false;
        for (String allowedExtension : ALLOWED_EXTENSIONS) {
            if (allowedExtension.equals(fileExtension)) {
                isValidExtension = true;
                break;
            }
        }
        
        if (!isValidExtension) {
            throw new IllegalArgumentException("Only JPG, PNG, and PDF files are allowed");
        }
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(lastDotIndex);
        }
        return "";
    }
    
    private String generatePublicId(String originalFilename) {
        if (originalFilename == null) {
            return "file_" + System.currentTimeMillis();
        }
        
        // Remove extension and replace spaces/special characters
        String nameWithoutExtension = originalFilename;
        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            nameWithoutExtension = originalFilename.substring(0, lastDotIndex);
        }
        
        // Replace spaces and special characters with underscores
        String publicId = nameWithoutExtension
            .replaceAll("[^a-zA-Z0-9]", "_")
            .replaceAll("_+", "_")
            .toLowerCase();
        
        // Add timestamp to ensure uniqueness
        return publicId + "_" + System.currentTimeMillis();
    }
    
    public void deleteFile(String fileUrl) {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            try {
                // Extract public ID from URL
                String publicId = extractPublicIdFromUrl(fileUrl);
                if (publicId != null) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                }
            } catch (Exception e) {
                // Log error but don't throw exception
                System.err.println("Failed to delete file from Cloudinary: " + fileUrl + ", Error: " + e.getMessage());
            }
        }
    }
    
    private String extractPublicIdFromUrl(String fileUrl) {
        try {
            // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
            String[] urlParts = fileUrl.split("/upload/");
            if (urlParts.length > 1) {
                String pathPart = urlParts[1];
                // Remove version if present
                if (pathPart.startsWith("v")) {
                    int slashIndex = pathPart.indexOf("/");
                    if (slashIndex > 0) {
                        pathPart = pathPart.substring(slashIndex + 1);
                    }
                }
                // Remove file extension
                int lastDotIndex = pathPart.lastIndexOf('.');
                if (lastDotIndex > 0) {
                    pathPart = pathPart.substring(0, lastDotIndex);
                }
                return pathPart;
            }
        } catch (Exception e) {
            System.err.println("Failed to extract public ID from URL: " + fileUrl);
        }
        return null;
    }
    
    public String getFileUrl(String fileUrl) {
        // For Cloudinary, the URL is already the complete URL
        return fileUrl;
    }
    
    public byte[] getFileContent(String fileUrl) throws IOException {
        if (fileUrl == null || fileUrl.isEmpty()) {
            throw new IllegalArgumentException("File URL cannot be null or empty");
        }
        
        try {
            // For Cloudinary, we can return the URL directly since it's publicly accessible
            // If you need the actual file content, you would need to make an HTTP request
            // For now, we'll throw an exception indicating this method needs to be implemented differently
            throw new UnsupportedOperationException("File content download not implemented for Cloudinary. Use the URL directly.");
        } catch (Exception e) {
            throw new IOException("Failed to get file content from Cloudinary: " + e.getMessage(), e);
        }
    }
}

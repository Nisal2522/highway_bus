package com.highwayexpress.backend.service;

import com.highwayexpress.backend.dto.BusRegistrationDto;
import com.highwayexpress.backend.dto.BusResponseDto;
import com.highwayexpress.backend.model.Bus;
import com.highwayexpress.backend.model.BusStatus;
import com.highwayexpress.backend.model.User;
import com.highwayexpress.backend.repository.BusRepository;
import com.highwayexpress.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BusService {
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileUploadService fileUploadService;
    
    public BusResponseDto registerBus(BusRegistrationDto busRegistrationDto, 
                                    MultipartFile busBookCopy, 
                                    MultipartFile ownerIdCopy, 
                                    Long ownerId) throws IOException {
        
        // Validate owner exists
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found with ID: " + ownerId));
        
        // Check if registration number already exists
        if (busRepository.existsByRegistrationNumber(busRegistrationDto.getRegistrationNumber())) {
            throw new IllegalArgumentException("Bus with registration number " + 
                    busRegistrationDto.getRegistrationNumber() + " already exists");
        }
        
        // Upload documents
        String busBookCopyUrl = null;
        String ownerIdCopyUrl = null;
        
        if (busBookCopy != null && !busBookCopy.isEmpty()) {
            busBookCopyUrl = fileUploadService.uploadBusDocument(busBookCopy);
        }
        
        if (ownerIdCopy != null && !ownerIdCopy.isEmpty()) {
            ownerIdCopyUrl = fileUploadService.uploadOwnerDocument(ownerIdCopy);
        }
        
        // Create bus entity
        Bus bus = new Bus();
        bus.setBusName(busRegistrationDto.getBusName());
        bus.setRegistrationNumber(busRegistrationDto.getRegistrationNumber());
        bus.setSeatingCapacity(busRegistrationDto.getSeatingCapacity());
        bus.setBusBookCopyUrl(busBookCopyUrl);
        bus.setOwnerIdCopyUrl(ownerIdCopyUrl);
        bus.setOwner(owner);
        bus.setStatus(BusStatus.PENDING);
        
        // Save bus
        Bus savedBus = busRepository.save(bus);
        
        // Convert to response DTO
        return convertToResponseDto(savedBus);
    }
    
    public BusResponseDto getBusById(Long busId) {
        Bus bus = busRepository.findBusWithOwnerById(busId)
                .orElseThrow(() -> new IllegalArgumentException("Bus not found with ID: " + busId));
        return convertToResponseDto(bus);
    }
    
    public List<BusResponseDto> getAllBuses() {
        List<Bus> buses = busRepository.findAllBusesWithOwner();
        return buses.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<BusResponseDto> getBusesByOwner(Long ownerId) {
        List<Bus> buses = busRepository.findBusesWithOwnerByOwnerId(ownerId);
        return buses.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<BusResponseDto> getBusesByStatus(BusStatus status) {
        List<Bus> buses = busRepository.findBusesByStatusWithOwner(status);
        return buses.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public BusResponseDto updateBusStatus(Long busId, BusStatus status) {
        return updateBusStatus(busId, status, null);
    }
    
    public BusResponseDto updateBusStatus(Long busId, BusStatus status, String reason) {
        Bus bus = busRepository.findBusWithOwnerById(busId)
                .orElseThrow(() -> new IllegalArgumentException("Bus not found with ID: " + busId));
        
        bus.setStatus(status);
        // You might want to add a rejectionReason field to the Bus model if needed
        Bus updatedBus = busRepository.save(bus);
        
        return convertToResponseDto(updatedBus);
    }
    
    public void deleteBus(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new IllegalArgumentException("Bus not found with ID: " + busId));
        
        // Delete associated files
        if (bus.getBusBookCopyUrl() != null) {
            fileUploadService.deleteFile(bus.getBusBookCopyUrl());
        }
        if (bus.getOwnerIdCopyUrl() != null) {
            fileUploadService.deleteFile(bus.getOwnerIdCopyUrl());
        }
        
        // Delete bus from database
        busRepository.delete(bus);
    }
    
    public boolean existsByRegistrationNumber(String registrationNumber) {
        return busRepository.existsByRegistrationNumber(registrationNumber);
    }
    
    private BusResponseDto convertToResponseDto(Bus bus) {
        BusResponseDto dto = new BusResponseDto();
        dto.setId(bus.getId());
        dto.setBusName(bus.getBusName());
        dto.setRegistrationNumber(bus.getRegistrationNumber());
        dto.setSeatingCapacity(bus.getSeatingCapacity());
        dto.setBusBookCopyUrl(bus.getBusBookCopyUrl());
        dto.setOwnerIdCopyUrl(bus.getOwnerIdCopyUrl());
        dto.setOwnerId(bus.getOwner().getId());
        dto.setOwnerName(bus.getOwner().getFirstName() + " " + bus.getOwner().getLastName());
        dto.setStatus(bus.getStatus());
        dto.setCreatedAt(bus.getCreatedAt());
        dto.setUpdatedAt(bus.getUpdatedAt());
        
        return dto;
    }
}

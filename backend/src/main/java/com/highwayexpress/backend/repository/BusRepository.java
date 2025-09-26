package com.highwayexpress.backend.repository;

import com.highwayexpress.backend.model.Bus;
import com.highwayexpress.backend.model.BusStatus;
import com.highwayexpress.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    
    // Find bus by registration number
    Optional<Bus> findByRegistrationNumber(String registrationNumber);
    
    // Check if registration number exists
    boolean existsByRegistrationNumber(String registrationNumber);
    
    // Find all buses by owner
    List<Bus> findByOwner(User owner);
    
    // Find all buses by owner ID
    List<Bus> findByOwnerId(Long ownerId);
    
    // Find all buses by status
    List<Bus> findByStatus(BusStatus status);
    
    // Find all buses by owner and status
    List<Bus> findByOwnerAndStatus(User owner, BusStatus status);
    
    // Find all buses by owner ID and status
    List<Bus> findByOwnerIdAndStatus(Long ownerId, BusStatus status);
    
    // Custom query to find buses with owner information
    @Query("SELECT b FROM Bus b JOIN FETCH b.owner WHERE b.owner.id = :ownerId")
    List<Bus> findBusesWithOwnerByOwnerId(@Param("ownerId") Long ownerId);
    
    // Custom query to find all buses with owner information
    @Query("SELECT b FROM Bus b JOIN FETCH b.owner ORDER BY b.createdAt DESC")
    List<Bus> findAllBusesWithOwner();
    
    // Custom query to find buses by status with owner information
    @Query("SELECT b FROM Bus b JOIN FETCH b.owner WHERE b.status = :status ORDER BY b.createdAt DESC")
    List<Bus> findBusesByStatusWithOwner(@Param("status") BusStatus status);
    
    // Custom query to find a single bus with owner information by ID
    @Query("SELECT b FROM Bus b JOIN FETCH b.owner WHERE b.id = :busId")
    Optional<Bus> findBusWithOwnerById(@Param("busId") Long busId);
}

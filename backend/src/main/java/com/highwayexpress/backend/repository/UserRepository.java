package com.highwayexpress.backend.repository;

import com.highwayexpress.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByIdNumber(String idNumber);
    
    boolean existsByCompanyName(String companyName);
}

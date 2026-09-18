package com.tripura.backend.repository;

import com.tripura.backend.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    Optional<Enrollment> findByUserIdAndSessionId(Long userId, Long sessionId);
    boolean existsByUserIdAndSessionId(Long userId, Long sessionId);
}

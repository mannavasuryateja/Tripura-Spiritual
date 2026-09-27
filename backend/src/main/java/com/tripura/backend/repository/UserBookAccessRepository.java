package com.tripura.backend.repository;

import com.tripura.backend.model.UserBookAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookAccessRepository extends JpaRepository<UserBookAccess, Long> {
    Optional<UserBookAccess> findByUserIdAndBookId(Long userId, Long bookId);
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
    List<UserBookAccess> findByUserId(Long userId);
}

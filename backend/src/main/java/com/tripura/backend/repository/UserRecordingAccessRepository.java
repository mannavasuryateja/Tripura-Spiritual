package com.tripura.backend.repository;

import com.tripura.backend.model.UserRecordingAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRecordingAccessRepository extends JpaRepository<UserRecordingAccess, Long> {
    List<UserRecordingAccess> findByUserId(Long userId);
    Optional<UserRecordingAccess> findByUserIdAndRecordingId(Long userId, Long recordingId);
    List<UserRecordingAccess> findByUserIdAndValidUntilAfter(Long userId, LocalDateTime now);
}

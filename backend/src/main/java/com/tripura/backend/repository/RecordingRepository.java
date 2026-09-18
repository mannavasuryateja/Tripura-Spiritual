package com.tripura.backend.repository;

import com.tripura.backend.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordingRepository extends JpaRepository<Recording, Long> {
    List<Recording> findBySessionIdOrderByDayNumberAsc(Long sessionId);
    Optional<Recording> findBySessionIdAndDayNumber(Long sessionId, Integer dayNumber);
}

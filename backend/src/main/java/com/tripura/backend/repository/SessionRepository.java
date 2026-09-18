package com.tripura.backend.repository;

import com.tripura.backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findBySlug(String slug);
    Optional<Session> findFirstByActiveTrueOrderByStartDateAsc();
}

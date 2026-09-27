package com.tripura.backend.repository;

import com.tripura.backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByCreatedAtDesc();
    List<AuditLog> findTop50ByOrderByCreatedAtDesc();
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);
}

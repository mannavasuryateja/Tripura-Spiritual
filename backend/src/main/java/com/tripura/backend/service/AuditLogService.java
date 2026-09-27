package com.tripura.backend.service;

import com.tripura.backend.model.AuditLog;
import com.tripura.backend.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String adminEmail, String action, String entityName, String entityId, String details) {
        try {
            AuditLog auditLog = new AuditLog(adminEmail, action, entityName, entityId, details);
            auditLogRepository.save(auditLog);
            log.info("AUDIT: Admin [{}] performed [{}] on {} [{}] - {}", adminEmail, action, entityName, entityId, details);
        } catch (Exception e) {
            log.error("Failed to save audit log: ", e);
        }
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }
}

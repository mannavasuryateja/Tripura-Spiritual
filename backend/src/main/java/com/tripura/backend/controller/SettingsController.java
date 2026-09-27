package com.tripura.backend.controller;

import com.tripura.backend.model.BusinessSetting;
import com.tripura.backend.repository.BusinessSettingRepository;
import com.tripura.backend.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SettingsController {

    private final BusinessSettingRepository settingRepository;
    private final AuditLogService auditLogService;

    public SettingsController(BusinessSettingRepository settingRepository, AuditLogService auditLogService) {
        this.settingRepository = settingRepository;
        this.auditLogService = auditLogService;
    }

    /**
     * Public business settings
     */
    @GetMapping("/settings/public")
    public ResponseEntity<Map<String, String>> getPublicSettings() {
        Map<String, String> publicSettings = new HashMap<>();
        settingRepository.findAll().forEach(s -> publicSettings.put(s.getKey(), s.getValue()));
        return ResponseEntity.ok(publicSettings);
    }

    /**
     * Admin: Get all settings
     */
    @GetMapping("/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BusinessSetting>> getAllSettings() {
        return ResponseEntity.ok(settingRepository.findAll());
    }

    /**
     * Admin: Update setting
     */
    @PutMapping("/admin/settings/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusinessSetting> updateSetting(
            @PathVariable String key,
            @RequestBody Map<String, String> payload,
            Authentication auth) {

        String value = payload.get("value");
        if (value == null) {
            throw new IllegalArgumentException("Setting value cannot be null");
        }

        BusinessSetting setting = settingRepository.findByKey(key)
                .orElse(new BusinessSetting(key, value, payload.get("description")));

        setting.setValue(value);
        if (payload.containsKey("description")) {
            setting.setDescription(payload.get("description"));
        }

        BusinessSetting saved = settingRepository.save(setting);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "SETTING_UPDATED", "BusinessSetting", key, "Updated setting " + key + " = " + value);

        return ResponseEntity.ok(saved);
    }
}

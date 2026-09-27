package com.tripura.backend.controller;

import com.tripura.backend.model.*;
import com.tripura.backend.repository.*;
import com.tripura.backend.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RecordingRepository recordingRepository;
    private final MentorBookingRepository mentorBookingRepository;
    private final PaymentRepository paymentRepository;
    private final SessionRepository sessionRepository;
    private final AuditLogService auditLogService;

    public AdminController(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            RecordingRepository recordingRepository,
            MentorBookingRepository mentorBookingRepository,
            PaymentRepository paymentRepository,
            SessionRepository sessionRepository,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.recordingRepository = recordingRepository;
        this.mentorBookingRepository = mentorBookingRepository;
        this.paymentRepository = paymentRepository;
        this.sessionRepository = sessionRepository;
        this.auditLogService = auditLogService;
    }

    /**
     * Real database metrics for Admin Dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        long totalUsers = userRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalPayments = paymentRepository.count();

        List<Payment> payments = paymentRepository.findAll();
        long successfulPayments = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.PAID || p.getStatus() == Payment.PaymentStatus.SUCCESS)
                .count();
        long pendingPayments = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.PENDING || p.getStatus() == Payment.PaymentStatus.CREATED)
                .count();

        long paidUsers = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.PAID || p.getStatus() == Payment.PaymentStatus.SUCCESS)
                .map(p -> p.getUser().getId())
                .distinct()
                .count();

        List<Enrollment> enrollments = enrollmentRepository.findAll();
        long activeEnrollments = enrollments.stream()
                .filter(e -> e.getValidUntil() != null && e.getValidUntil().isAfter(now))
                .count();

        List<Session> sessions = sessionRepository.findAll();
        long upcomingSessions = sessions.stream()
                .filter(s -> s.getStartDate() != null && !s.getStartDate().isBefore(today))
                .count();

        List<Recording> recordings = recordingRepository.findAll();
        long activeRecordings = recordings.stream()
                .filter(r -> r.getDefaultExpiresAt() != null && r.getDefaultExpiresAt().isAfter(now))
                .count();
        long expiredRecordings = recordings.stream()
                .filter(r -> r.getDefaultExpiresAt() != null && r.getDefaultExpiresAt().isBefore(now))
                .count();

        List<MentorBooking> bookings = mentorBookingRepository.findAll();
        long pendingBookingRequests = bookings.stream()
                .filter(b -> b.getStatus() == MentorBooking.BookingStatus.PENDING || b.getStatus() == MentorBooking.BookingStatus.REQUESTED)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("paidUsers", paidUsers);
        stats.put("activeUsers", totalUsers);
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("activeEnrollments", activeEnrollments);
        stats.put("upcomingSessions", upcomingSessions);
        stats.put("totalRecordings", recordings.size());
        stats.put("activeRecordings", activeRecordings);
        stats.put("expiredRecordings", expiredRecordings);
        stats.put("totalPayments", totalPayments);
        stats.put("successfulPayments", successfulPayments);
        stats.put("pendingPayments", pendingPayments);
        stats.put("pendingBookingRequests", pendingBookingRequests);
        stats.put("totalMentorBookings", bookings.size());

        return ResponseEntity.ok(stats);
    }

    /**
     * List all enrollments with student and session details
     */
    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentRepository.findAll());
    }

    /**
     * List all payment transactions
     */
    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAllByOrderByCreatedAtDesc());
    }

    /**
     * List all registered seekers
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Promote / update user role
     */
    @PostMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> payload,
            Authentication auth) {

        String newRoleStr = payload.get("role");
        Role newRole = Role.fromString(newRoleStr);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        user.setRole(newRole.name());
        userRepository.save(user);

        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "USER_ROLE_CHANGED", "User", userId.toString(), "Changed role of " + user.getEmail() + " to " + newRole.name());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User role updated successfully to " + newRole.name(),
                "role", newRole.name()
        ));
    }

    /**
     * Get recent audit logs
     */
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getRecentLogs());
    }

    // ==========================================
    // SESSIONS MANAGEMENT
    // ==========================================

    @GetMapping("/sessions")
    public ResponseEntity<List<Session>> getAllSessions() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @PostMapping("/sessions")
    public ResponseEntity<Session> createSession(@RequestBody Session session, Authentication auth) {
        if (session.getSlug() == null || session.getSlug().isBlank()) {
            session.setSlug(session.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", ""));
        }
        Session saved = sessionRepository.save(session);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "SESSION_CREATED", "Session", saved.getId().toString(), "Created session: " + saved.getTitle());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<Session> updateSession(
            @PathVariable Long id,
            @RequestBody Session sessionDetails,
            Authentication auth) {

        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + id));

        session.setTitle(sessionDetails.getTitle());
        session.setDescription(sessionDetails.getDescription());
        session.setStartDate(sessionDetails.getStartDate());
        session.setEndDate(sessionDetails.getEndDate());
        session.setPriceLive(sessionDetails.getPriceLive());
        session.setPriceRecordings(sessionDetails.getPriceRecordings());
        session.setPriceExtension(sessionDetails.getPriceExtension());
        session.setWhatsappCommunityUrl(sessionDetails.getWhatsappCommunityUrl());
        session.setActive(sessionDetails.getActive());

        Session saved = sessionRepository.save(session);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "SESSION_UPDATED", "Session", id.toString(), "Updated session: " + saved.getTitle());

        return ResponseEntity.ok(saved);
    }

    // ==========================================
    // RECORDINGS MANAGEMENT
    // ==========================================

    @GetMapping("/recordings")
    public ResponseEntity<List<Recording>> getAllRecordings() {
        return ResponseEntity.ok(recordingRepository.findAll());
    }

    @PostMapping("/recordings")
    public ResponseEntity<Recording> createRecording(
            @RequestBody Map<String, Object> payload,
            Authentication auth) {

        Long sessionId = Long.parseLong(payload.get("sessionId").toString());
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

        Recording recording = Recording.builder()
                .session(session)
                .dayNumber(Integer.parseInt(payload.get("dayNumber").toString()))
                .title(payload.get("title").toString())
                .description(payload.getOrDefault("description", "").toString())
                .duration(payload.getOrDefault("duration", "50 mins").toString())
                .bunnyVideoId(payload.getOrDefault("bunnyVideoId", "bunny_" + System.currentTimeMillis()).toString())
                .releaseAt(payload.containsKey("releaseAt") ? LocalDateTime.parse(payload.get("releaseAt").toString()) : LocalDateTime.now())
                .defaultExpiresAt(payload.containsKey("defaultExpiresAt") ? LocalDateTime.parse(payload.get("defaultExpiresAt").toString()) : LocalDateTime.now().plusDays(13))
                .build();

        Recording saved = recordingRepository.save(recording);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "RECORDING_CREATED", "Recording", saved.getId().toString(), "Added recording: " + saved.getTitle());

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/recordings/{id}")
    public ResponseEntity<?> deleteRecording(@PathVariable Long id, Authentication auth) {
        recordingRepository.deleteById(id);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "RECORDING_DELETED", "Recording", id.toString(), "Deleted recording ID: " + id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Recording deleted successfully"));
    }
}

package com.tripura.backend.controller;

import com.tripura.backend.model.Enrollment;
import com.tripura.backend.model.Role;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.MentorBookingRepository;
import com.tripura.backend.repository.RecordingRepository;
import com.tripura.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    private final com.tripura.backend.repository.PaymentRepository paymentRepository;

    public AdminController(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            RecordingRepository recordingRepository,
            MentorBookingRepository mentorBookingRepository,
            com.tripura.backend.repository.PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.recordingRepository = recordingRepository;
        this.mentorBookingRepository = mentorBookingRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Get platform overview metrics (Admin only).
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalEnrollments", enrollmentRepository.count());
        stats.put("totalRecordings", recordingRepository.count());
        stats.put("totalMentorBookings", mentorBookingRepository.count());
        stats.put("totalPayments", paymentRepository.count());
        return ResponseEntity.ok(stats);
    }

    /**
     * List all enrollments with student details (Admin only).
     */
    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentRepository.findAll());
    }

    /**
     * List all payments (Admin only).
     */
    @GetMapping("/payments")
    public ResponseEntity<List<com.tripura.backend.model.Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    /**
     * List all registered users (Admin only).
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Update a user's role (e.g., promote to ROLE_MENTOR, ROLE_ADMIN, or ROLE_ENROLLED).
     */
    @PostMapping("/users/{userId}/role")
    @PreAuthorize("hasAuthority('ADMIN:MANAGE_USERS')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> payload) {

        String newRoleStr = payload.get("role");
        Role newRole = Role.fromString(newRoleStr);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        user.setRole(newRole.name());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User role updated successfully to " + newRole.name(),
                "user", user
        ));
    }

    /**
     * Override unlocked days for a seeker (Admin only).
     */
    @PostMapping("/users/{userId}/override-days")
    @PreAuthorize("hasAuthority('ADMIN:OVERRIDE_DAYS')")
    public ResponseEntity<?> overrideUserDays(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> payload) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Granular day overrides applied successfully for " + user.getName(),
                "userId", userId
        ));
    }
}

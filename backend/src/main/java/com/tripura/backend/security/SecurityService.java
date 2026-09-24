package com.tripura.backend.security;

import com.tripura.backend.model.Enrollment;
import com.tripura.backend.model.MentorBooking;
import com.tripura.backend.model.Recording;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.MentorBookingRepository;
import com.tripura.backend.repository.RecordingRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service("securityService")
public class SecurityService {

    private final EnrollmentRepository enrollmentRepository;
    private final RecordingRepository recordingRepository;
    private final MentorBookingRepository mentorBookingRepository;

    public SecurityService(
            EnrollmentRepository enrollmentRepository,
            RecordingRepository recordingRepository,
            MentorBookingRepository mentorBookingRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.recordingRepository = recordingRepository;
        this.mentorBookingRepository = mentorBookingRepository;
    }

    /**
     * Check if the authenticated user matches the requested resource owner ID.
     */
    public boolean isOwner(Authentication authentication, Long userId) {
        if (authentication == null || !authentication.isAuthenticated() || userId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user.getId().equals(userId) || "ROLE_ADMIN".equalsIgnoreCase(user.getRole());
        }

        return false;
    }

    /**
     * Check if the authenticated user has active access to stream a specific recording.
     */
    public boolean hasRecordingAccess(Authentication authentication, Long recordingId) {
        if (authentication == null || !authentication.isAuthenticated() || recordingId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User user)) {
            return false;
        }

        // Admin has full access
        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            return true;
        }

        Recording recording = recordingRepository.findById(recordingId).orElse(null);
        if (recording == null) {
            return false;
        }

        // Free preview for Day 1 & Day 2 orientation
        if (recording.getDayNumber() != null && recording.getDayNumber() <= 2) {
            return true;
        }

        // Check if user has active enrollment for this session
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        LocalDateTime now = LocalDateTime.now();
        return enrollments.stream().anyMatch(e ->
                e.getSession().getId().equals(recording.getSession().getId()) &&
                (e.getValidUntil() == null || e.getValidUntil().isAfter(now))
        );
    }

    /**
     * Check if the authenticated user owns a mentor booking.
     */
    public boolean isMentorBookingOwner(Authentication authentication, Long bookingId) {
        if (authentication == null || !authentication.isAuthenticated() || bookingId == null) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User user)) {
            return false;
        }

        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            return true;
        }

        MentorBooking booking = mentorBookingRepository.findById(bookingId).orElse(null);
        return booking != null && booking.getUser().getId().equals(user.getId());
    }
}

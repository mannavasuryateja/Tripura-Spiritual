package com.tripura.backend.controller;

import com.tripura.backend.dto.MentorBookingRequestDto;
import com.tripura.backend.model.MentorBooking;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.MentorBookingRepository;
import com.tripura.backend.service.MentorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final MentorService mentorService;
    private final MentorBookingRepository mentorBookingRepository;

    public MentorController(MentorService mentorService, MentorBookingRepository mentorBookingRepository) {
        this.mentorService = mentorService;
        this.mentorBookingRepository = mentorBookingRepository;
    }

    /**
     * Seeker: Book a 1-on-1 mentorship session.
     */
    @PostMapping("/book")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MentorBooking> bookSession(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MentorBookingRequestDto request) {

        MentorBooking booking = mentorService.createBooking(user.getId(), request);
        return ResponseEntity.ok(booking);
    }

    /**
     * Seeker: View personal bookings.
     */
    @GetMapping("/my-bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MentorBooking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mentorBookingRepository.findByUserId(user.getId()));
    }

    /**
     * Admin: View all incoming 1-on-1 mentorship bookings.
     */
    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MentorBooking>> getAllBookings() {
        return ResponseEntity.ok(mentorBookingRepository.findAll());
    }

    /**
     * Admin: Update mentorship status.
     */
    @PostMapping("/bookings/{bookingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> payload) {

        MentorBooking booking = mentorBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        if (payload.containsKey("status")) {
            String statusStr = payload.get("status").trim().toUpperCase();
            booking.setStatus(MentorBooking.BookingStatus.valueOf(statusStr));
        }

        mentorBookingRepository.save(booking);
        return ResponseEntity.ok(Map.of("success", true, "message", "Booking status updated successfully", "booking", booking));
    }
}

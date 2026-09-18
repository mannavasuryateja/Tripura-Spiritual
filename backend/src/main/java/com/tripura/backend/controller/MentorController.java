package com.tripura.backend.controller;

import com.tripura.backend.dto.MentorBookingRequestDto;
import com.tripura.backend.model.MentorBooking;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.MentorBookingRepository;
import com.tripura.backend.service.MentorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final MentorService mentorService;
    private final MentorBookingRepository mentorBookingRepository;

    public MentorController(MentorService mentorService, MentorBookingRepository mentorBookingRepository) {
        this.mentorService = mentorService;
        this.mentorBookingRepository = mentorBookingRepository;
    }

    @PostMapping("/book")
    public ResponseEntity<MentorBooking> bookSession(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MentorBookingRequestDto request) {

        MentorBooking booking = mentorService.createBooking(user.getId(), request);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<MentorBooking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mentorBookingRepository.findByUserId(user.getId()));
    }
}

package com.tripura.backend.service;

import com.tripura.backend.dto.MentorBookingRequestDto;
import com.tripura.backend.model.MentorBooking;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.MentorBookingRepository;
import com.tripura.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class MentorService {

    private final MentorBookingRepository mentorBookingRepository;
    private final UserRepository userRepository;

    public MentorService(MentorBookingRepository mentorBookingRepository, UserRepository userRepository) {
        this.mentorBookingRepository = mentorBookingRepository;
        this.userRepository = userRepository;
    }

    public MentorBooking createBooking(Long userId, MentorBookingRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        validateBookingDates(request.getPrimaryDate(), request.getSecondaryDate());

        BigDecimal amount = request.getDurationMinutes() == 30 ? new BigDecimal("499.00") : new BigDecimal("899.00");

        MentorBooking booking = MentorBooking.builder()
                .user(user)
                .category(request.getCategory())
                .durationMinutes(request.getDurationMinutes())
                .primaryDate(request.getPrimaryDate())
                .secondaryDate(request.getSecondaryDate())
                .preferredTimeSlot(request.getPreferredTimeSlot())
                .amount(amount)
                .status(MentorBooking.BookingStatus.PENDING)
                .build();

        return mentorBookingRepository.save(booking);
    }

    private void validateBookingDates(LocalDate primary, LocalDate secondary) {
        if (isDateLocked(primary)) {
            throw new IllegalArgumentException("Primary preferred date falls between the 1st and 12th of the month. " +
                    "Master is conducting 11-day live immersions and review sessions. Please select a date from the 13th onwards.");
        }

        if (isDateLocked(secondary)) {
            throw new IllegalArgumentException("Secondary preferred date falls between the 1st and 12th of the month. " +
                    "Please select a date from the 13th onwards.");
        }

        if (primary.equals(secondary)) {
            throw new IllegalArgumentException("Please choose two different preferred dates for your consultation availability.");
        }
    }

    private boolean isDateLocked(LocalDate date) {
        if (date == null) return false;
        int dayOfMonth = date.getDayOfMonth();
        return dayOfMonth >= 1 && dayOfMonth <= 12;
    }
}

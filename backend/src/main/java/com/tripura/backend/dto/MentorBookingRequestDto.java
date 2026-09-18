package com.tripura.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MentorBookingRequestDto {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Duration is required")
    private Integer durationMinutes;

    @NotNull(message = "Primary choice date is required")
    @Future(message = "Primary date must be in the future")
    private LocalDate primaryDate;

    @NotNull(message = "Secondary choice date is required")
    @Future(message = "Secondary date must be in the future")
    private LocalDate secondaryDate;

    @NotBlank(message = "Preferred time slot is required")
    private String preferredTimeSlot;

    public MentorBookingRequestDto() {}

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public LocalDate getPrimaryDate() { return primaryDate; }
    public void setPrimaryDate(LocalDate primaryDate) { this.primaryDate = primaryDate; }

    public LocalDate getSecondaryDate() { return secondaryDate; }
    public void setSecondaryDate(LocalDate secondaryDate) { this.secondaryDate = secondaryDate; }

    public String getPreferredTimeSlot() { return preferredTimeSlot; }
    public void setPreferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; }
}

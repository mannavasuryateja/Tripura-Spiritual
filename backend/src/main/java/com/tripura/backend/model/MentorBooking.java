package com.tripura.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_bookings")
public class MentorBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String category;
    private Integer durationMinutes;
    private LocalDate primaryDate;
    private LocalDate secondaryDate;
    private String preferredTimeSlot;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime createdAt;

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED
    }

    public MentorBooking() {}

    public static MentorBookingBuilder builder() {
        return new MentorBookingBuilder();
    }

    public static class MentorBookingBuilder {
        private Long id;
        private User user;
        private String category;
        private Integer durationMinutes;
        private LocalDate primaryDate;
        private LocalDate secondaryDate;
        private String preferredTimeSlot;
        private BigDecimal amount;
        private BookingStatus status = BookingStatus.PENDING;

        public MentorBookingBuilder id(Long id) { this.id = id; return this; }
        public MentorBookingBuilder user(User user) { this.user = user; return this; }
        public MentorBookingBuilder category(String category) { this.category = category; return this; }
        public MentorBookingBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public MentorBookingBuilder primaryDate(LocalDate primaryDate) { this.primaryDate = primaryDate; return this; }
        public MentorBookingBuilder secondaryDate(LocalDate secondaryDate) { this.secondaryDate = secondaryDate; return this; }
        public MentorBookingBuilder preferredTimeSlot(String preferredTimeSlot) { this.preferredTimeSlot = preferredTimeSlot; return this; }
        public MentorBookingBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public MentorBookingBuilder status(BookingStatus status) { this.status = status; return this; }

        public MentorBooking build() {
            MentorBooking m = new MentorBooking();
            m.id = this.id;
            m.user = this.user;
            m.category = this.category;
            m.durationMinutes = this.durationMinutes;
            m.primaryDate = this.primaryDate;
            m.secondaryDate = this.secondaryDate;
            m.preferredTimeSlot = this.preferredTimeSlot;
            m.amount = this.amount;
            m.status = this.status;
            return m;
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}

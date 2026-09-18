package com.tripura.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentType type;

    private BigDecimal paidAmount;
    private LocalDateTime paidAt;
    private LocalDateTime validUntil;

    public enum EnrollmentType {
        LIVE_SESSION,
        RECORDINGS_ONLY,
        RECORDING_EXTENSION
    }

    public Enrollment() {}

    public static EnrollmentBuilder builder() {
        return new EnrollmentBuilder();
    }

    public static class EnrollmentBuilder {
        private Long id;
        private User user;
        private Session session;
        private EnrollmentType type;
        private BigDecimal paidAmount;
        private LocalDateTime paidAt;
        private LocalDateTime validUntil;

        public EnrollmentBuilder id(Long id) { this.id = id; return this; }
        public EnrollmentBuilder user(User user) { this.user = user; return this; }
        public EnrollmentBuilder session(Session session) { this.session = session; return this; }
        public EnrollmentBuilder type(EnrollmentType type) { this.type = type; return this; }
        public EnrollmentBuilder paidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; return this; }
        public EnrollmentBuilder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }
        public EnrollmentBuilder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }

        public Enrollment build() {
            Enrollment e = new Enrollment();
            e.id = this.id;
            e.user = this.user;
            e.session = this.session;
            e.type = this.type;
            e.paidAmount = this.paidAmount;
            e.paidAt = this.paidAt;
            e.validUntil = this.validUntil;
            return e;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public EnrollmentType getType() { return type; }
    public void setType(EnrollmentType type) { this.type = type; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }
}

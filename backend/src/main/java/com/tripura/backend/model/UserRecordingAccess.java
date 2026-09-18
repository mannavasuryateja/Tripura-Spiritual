package com.tripura.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_recording_access")
public class UserRecordingAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recording_id", nullable = false)
    private Recording recording;

    private LocalDateTime grantedAt;
    private LocalDateTime validUntil;

    @Enumerated(EnumType.STRING)
    private AccessType accessType;

    public enum AccessType {
        STANDARD_13TH_DAY,
        EXTENDED_21_DAYS
    }

    public UserRecordingAccess() {}

    public static UserRecordingAccessBuilder builder() {
        return new UserRecordingAccessBuilder();
    }

    public static class UserRecordingAccessBuilder {
        private Long id;
        private User user;
        private Recording recording;
        private LocalDateTime grantedAt;
        private LocalDateTime validUntil;
        private AccessType accessType;

        public UserRecordingAccessBuilder id(Long id) { this.id = id; return this; }
        public UserRecordingAccessBuilder user(User user) { this.user = user; return this; }
        public UserRecordingAccessBuilder recording(Recording recording) { this.recording = recording; return this; }
        public UserRecordingAccessBuilder grantedAt(LocalDateTime grantedAt) { this.grantedAt = grantedAt; return this; }
        public UserRecordingAccessBuilder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
        public UserRecordingAccessBuilder accessType(AccessType accessType) { this.accessType = accessType; return this; }

        public UserRecordingAccess build() {
            UserRecordingAccess u = new UserRecordingAccess();
            u.id = this.id;
            u.user = this.user;
            u.recording = this.recording;
            u.grantedAt = this.grantedAt;
            u.validUntil = this.validUntil;
            u.accessType = this.accessType;
            return u;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Recording getRecording() { return recording; }
    public void setRecording(Recording recording) { this.recording = recording; }

    public LocalDateTime getGrantedAt() { return grantedAt; }
    public void setGrantedAt(LocalDateTime grantedAt) { this.grantedAt = grantedAt; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public AccessType getAccessType() { return accessType; }
    public void setAccessType(AccessType accessType) { this.accessType = accessType; }
}

package com.tripura.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recordings")
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private Session session;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;
    private String bunnyVideoId;

    private LocalDateTime releaseAt;
    private LocalDateTime defaultExpiresAt;

    public Recording() {}

    public static RecordingBuilder builder() {
        return new RecordingBuilder();
    }

    public static class RecordingBuilder {
        private Long id;
        private Session session;
        private Integer dayNumber;
        private String title;
        private String description;
        private String duration;
        private String bunnyVideoId;
        private LocalDateTime releaseAt;
        private LocalDateTime defaultExpiresAt;

        public RecordingBuilder id(Long id) { this.id = id; return this; }
        public RecordingBuilder session(Session session) { this.session = session; return this; }
        public RecordingBuilder dayNumber(Integer dayNumber) { this.dayNumber = dayNumber; return this; }
        public RecordingBuilder title(String title) { this.title = title; return this; }
        public RecordingBuilder description(String description) { this.description = description; return this; }
        public RecordingBuilder duration(String duration) { this.duration = duration; return this; }
        public RecordingBuilder bunnyVideoId(String bunnyVideoId) { this.bunnyVideoId = bunnyVideoId; return this; }
        public RecordingBuilder releaseAt(LocalDateTime releaseAt) { this.releaseAt = releaseAt; return this; }
        public RecordingBuilder defaultExpiresAt(LocalDateTime defaultExpiresAt) { this.defaultExpiresAt = defaultExpiresAt; return this; }

        public Recording build() {
            Recording r = new Recording();
            r.id = this.id;
            r.session = this.session;
            r.dayNumber = this.dayNumber;
            r.title = this.title;
            r.description = this.description;
            r.duration = this.duration;
            r.bunnyVideoId = this.bunnyVideoId;
            r.releaseAt = this.releaseAt;
            r.defaultExpiresAt = this.defaultExpiresAt;
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Session getSession() { return session; }
    public void setSession(Session session) { this.session = session; }

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getBunnyVideoId() { return bunnyVideoId; }
    public void setBunnyVideoId(String bunnyVideoId) { this.bunnyVideoId = bunnyVideoId; }

    public LocalDateTime getReleaseAt() { return releaseAt; }
    public void setReleaseAt(LocalDateTime releaseAt) { this.releaseAt = releaseAt; }

    public LocalDateTime getDefaultExpiresAt() { return defaultExpiresAt; }
    public void setDefaultExpiresAt(LocalDateTime defaultExpiresAt) { this.defaultExpiresAt = defaultExpiresAt; }
}

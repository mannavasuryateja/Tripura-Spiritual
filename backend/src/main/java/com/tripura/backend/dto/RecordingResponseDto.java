package com.tripura.backend.dto;

import java.time.LocalDateTime;

public class RecordingResponseDto {

    private Long id;
    private Integer dayNumber;
    private String title;
    private String description;
    private String duration;
    private Boolean isUnlocked;
    private LocalDateTime releaseAt;
    private LocalDateTime validUntil;
    private String statusMessage;

    public RecordingResponseDto() {}

    public static RecordingResponseDtoBuilder builder() {
        return new RecordingResponseDtoBuilder();
    }

    public static class RecordingResponseDtoBuilder {
        private Long id;
        private Integer dayNumber;
        private String title;
        private String description;
        private String duration;
        private Boolean isUnlocked;
        private LocalDateTime releaseAt;
        private LocalDateTime validUntil;
        private String statusMessage;

        public RecordingResponseDtoBuilder id(Long id) { this.id = id; return this; }
        public RecordingResponseDtoBuilder dayNumber(Integer dayNumber) { this.dayNumber = dayNumber; return this; }
        public RecordingResponseDtoBuilder title(String title) { this.title = title; return this; }
        public RecordingResponseDtoBuilder description(String description) { this.description = description; return this; }
        public RecordingResponseDtoBuilder duration(String duration) { this.duration = duration; return this; }
        public RecordingResponseDtoBuilder isUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; return this; }
        public RecordingResponseDtoBuilder releaseAt(LocalDateTime releaseAt) { this.releaseAt = releaseAt; return this; }
        public RecordingResponseDtoBuilder validUntil(LocalDateTime validUntil) { this.validUntil = validUntil; return this; }
        public RecordingResponseDtoBuilder statusMessage(String statusMessage) { this.statusMessage = statusMessage; return this; }

        public RecordingResponseDto build() {
            RecordingResponseDto r = new RecordingResponseDto();
            r.id = this.id;
            r.dayNumber = this.dayNumber;
            r.title = this.title;
            r.description = this.description;
            r.duration = this.duration;
            r.isUnlocked = this.isUnlocked;
            r.releaseAt = this.releaseAt;
            r.validUntil = this.validUntil;
            r.statusMessage = this.statusMessage;
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }

    public LocalDateTime getReleaseAt() { return releaseAt; }
    public void setReleaseAt(LocalDateTime releaseAt) { this.releaseAt = releaseAt; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
}

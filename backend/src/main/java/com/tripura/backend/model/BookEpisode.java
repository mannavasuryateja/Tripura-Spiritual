package com.tripura.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_episodes")
public class BookEpisode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonBackReference
    private Book book;

    @Column(nullable = false)
    private Integer episodeNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;
    private Integer durationSeconds = 0;

    @Column(length = 50)
    private String mediaType = "AUDIO"; // AUDIO, VIDEO

    @Column(columnDefinition = "TEXT")
    private String audioUrl;

    @Column(columnDefinition = "TEXT")
    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String thumbnailUrl;

    private Boolean isFree = false;
    private Boolean isPublished = true;
    private Integer sortOrder = 0;

    private LocalDateTime createdAt;

    public BookEpisode() {}

    public static BookEpisodeBuilder builder() {
        return new BookEpisodeBuilder();
    }

    public static class BookEpisodeBuilder {
        private Long id;
        private Book book;
        private Integer episodeNumber;
        private String title;
        private String description;
        private String duration;
        private Integer durationSeconds = 0;
        private String mediaType = "AUDIO";
        private String audioUrl;
        private String videoUrl;
        private String thumbnailUrl;
        private Boolean isFree = false;
        private Boolean isPublished = true;
        private Integer sortOrder = 0;

        public BookEpisodeBuilder id(Long id) { this.id = id; return this; }
        public BookEpisodeBuilder book(Book book) { this.book = book; return this; }
        public BookEpisodeBuilder episodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; return this; }
        public BookEpisodeBuilder title(String title) { this.title = title; return this; }
        public BookEpisodeBuilder description(String description) { this.description = description; return this; }
        public BookEpisodeBuilder duration(String duration) { this.duration = duration; return this; }
        public BookEpisodeBuilder durationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; return this; }
        public BookEpisodeBuilder mediaType(String mediaType) { this.mediaType = mediaType; return this; }
        public BookEpisodeBuilder audioUrl(String audioUrl) { this.audioUrl = audioUrl; return this; }
        public BookEpisodeBuilder videoUrl(String videoUrl) { this.videoUrl = videoUrl; return this; }
        public BookEpisodeBuilder thumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; return this; }
        public BookEpisodeBuilder isFree(Boolean isFree) { this.isFree = isFree; return this; }
        public BookEpisodeBuilder isPublished(Boolean isPublished) { this.isPublished = isPublished; return this; }
        public BookEpisodeBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }

        public BookEpisode build() {
            BookEpisode e = new BookEpisode();
            e.id = this.id;
            e.book = this.book;
            e.episodeNumber = this.episodeNumber;
            e.title = this.title;
            e.description = this.description;
            e.duration = this.duration;
            e.durationSeconds = this.durationSeconds;
            e.mediaType = this.mediaType;
            e.audioUrl = this.audioUrl;
            e.videoUrl = this.videoUrl;
            e.thumbnailUrl = this.thumbnailUrl;
            e.isFree = this.isFree;
            e.isPublished = this.isPublished;
            e.sortOrder = this.sortOrder;
            return e;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.sortOrder == null) {
            this.sortOrder = this.episodeNumber != null ? this.episodeNumber : 0;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public Integer getEpisodeNumber() { return episodeNumber; }
    public void setEpisodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}

package com.tripura.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "book_episodes")
public class BookEpisode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    private Book book;

    @Column(nullable = false)
    private Integer episodeNumber;

    @Column(nullable = false)
    private String title;

    private String duration;
    private String audioUrl;

    public BookEpisode() {}

    public static BookEpisodeBuilder builder() {
        return new BookEpisodeBuilder();
    }

    public static class BookEpisodeBuilder {
        private Long id;
        private Book book;
        private Integer episodeNumber;
        private String title;
        private String duration;
        private String audioUrl;

        public BookEpisodeBuilder id(Long id) { this.id = id; return this; }
        public BookEpisodeBuilder book(Book book) { this.book = book; return this; }
        public BookEpisodeBuilder episodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; return this; }
        public BookEpisodeBuilder title(String title) { this.title = title; return this; }
        public BookEpisodeBuilder duration(String duration) { this.duration = duration; return this; }
        public BookEpisodeBuilder audioUrl(String audioUrl) { this.audioUrl = audioUrl; return this; }

        public BookEpisode build() {
            BookEpisode e = new BookEpisode();
            e.id = this.id;
            e.book = this.book;
            e.episodeNumber = this.episodeNumber;
            e.title = this.title;
            e.duration = this.duration;
            e.audioUrl = this.audioUrl;
            return e;
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

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
}

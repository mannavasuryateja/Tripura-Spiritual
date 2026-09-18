package com.tripura.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String masterCommentarySummary;

    private String coverImage;
    private Integer episodesCount;

    private BigDecimal price = new BigDecimal("199.00");

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookEpisode> episodes = new ArrayList<>();

    public Book() {}

    public static BookBuilder builder() {
        return new BookBuilder();
    }

    public static class BookBuilder {
        private Long id;
        private String title;
        private String author;
        private String description;
        private String masterCommentarySummary;
        private String coverImage;
        private Integer episodesCount;
        private BigDecimal price = new BigDecimal("199.00");
        private List<BookEpisode> episodes = new ArrayList<>();

        public BookBuilder id(Long id) { this.id = id; return this; }
        public BookBuilder title(String title) { this.title = title; return this; }
        public BookBuilder author(String author) { this.author = author; return this; }
        public BookBuilder description(String description) { this.description = description; return this; }
        public BookBuilder masterCommentarySummary(String masterCommentarySummary) { this.masterCommentarySummary = masterCommentarySummary; return this; }
        public BookBuilder coverImage(String coverImage) { this.coverImage = coverImage; return this; }
        public BookBuilder episodesCount(Integer episodesCount) { this.episodesCount = episodesCount; return this; }
        public BookBuilder price(BigDecimal price) { this.price = price; return this; }

        public Book build() {
            Book b = new Book();
            b.id = this.id;
            b.title = this.title;
            b.author = this.author;
            b.description = this.description;
            b.masterCommentarySummary = this.masterCommentarySummary;
            b.coverImage = this.coverImage;
            b.episodesCount = this.episodesCount;
            b.price = this.price;
            b.episodes = this.episodes;
            return b;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMasterCommentarySummary() { return masterCommentarySummary; }
    public void setMasterCommentarySummary(String masterCommentarySummary) { this.masterCommentarySummary = masterCommentarySummary; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Integer getEpisodesCount() { return episodesCount; }
    public void setEpisodesCount(Integer episodesCount) { this.episodesCount = episodesCount; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public List<BookEpisode> getEpisodes() { return episodes; }
    public void setEpisodes(List<BookEpisode> episodes) { this.episodes = episodes; }
}

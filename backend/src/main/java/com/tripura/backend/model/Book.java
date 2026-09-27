package com.tripura.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false)
    private String title;

    private String teluguTitle;

    @Column(nullable = false)
    private String author;

    private String tag;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @Column(columnDefinition = "TEXT")
    private String summaryStory;

    @Column(columnDefinition = "TEXT")
    private String problemStatement;

    @Column(columnDefinition = "TEXT")
    private String masterQuote;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String masterCommentarySummary;

    private String coverImage;
    private Integer episodesCount = 0;
    private Integer previewDurationMinutes = 5;

    @Column(precision = 10, scale = 2)
    private BigDecimal price = new BigDecimal("199.00");

    private Boolean isPublished = true;
    private Integer sortOrder = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC, episodeNumber ASC")
    @JsonManagedReference
    private List<BookEpisode> episodes = new ArrayList<>();

    public Book() {}

    public static BookBuilder builder() {
        return new BookBuilder();
    }

    public static class BookBuilder {
        private Long id;
        private String slug;
        private String title;
        private String teluguTitle;
        private String author;
        private String tag;
        private String synopsis;
        private String summaryStory;
        private String problemStatement;
        private String masterQuote;
        private String description;
        private String masterCommentarySummary;
        private String coverImage;
        private Integer episodesCount = 0;
        private Integer previewDurationMinutes = 5;
        private BigDecimal price = new BigDecimal("199.00");
        private Boolean isPublished = true;
        private Integer sortOrder = 0;
        private List<BookEpisode> episodes = new ArrayList<>();

        public BookBuilder id(Long id) { this.id = id; return this; }
        public BookBuilder slug(String slug) { this.slug = slug; return this; }
        public BookBuilder title(String title) { this.title = title; return this; }
        public BookBuilder teluguTitle(String teluguTitle) { this.teluguTitle = teluguTitle; return this; }
        public BookBuilder author(String author) { this.author = author; return this; }
        public BookBuilder tag(String tag) { this.tag = tag; return this; }
        public BookBuilder synopsis(String synopsis) { this.synopsis = synopsis; return this; }
        public BookBuilder summaryStory(String summaryStory) { this.summaryStory = summaryStory; return this; }
        public BookBuilder problemStatement(String problemStatement) { this.problemStatement = problemStatement; return this; }
        public BookBuilder masterQuote(String masterQuote) { this.masterQuote = masterQuote; return this; }
        public BookBuilder description(String description) { this.description = description; return this; }
        public BookBuilder masterCommentarySummary(String masterCommentarySummary) { this.masterCommentarySummary = masterCommentarySummary; return this; }
        public BookBuilder coverImage(String coverImage) { this.coverImage = coverImage; return this; }
        public BookBuilder episodesCount(Integer episodesCount) { this.episodesCount = episodesCount; return this; }
        public BookBuilder previewDurationMinutes(Integer previewDurationMinutes) { this.previewDurationMinutes = previewDurationMinutes; return this; }
        public BookBuilder price(BigDecimal price) { this.price = price; return this; }
        public BookBuilder isPublished(Boolean isPublished) { this.isPublished = isPublished; return this; }
        public BookBuilder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }
        public BookBuilder episodes(List<BookEpisode> episodes) { this.episodes = episodes; return this; }

        public Book build() {
            Book b = new Book();
            b.id = this.id;
            b.slug = this.slug;
            b.title = this.title;
            b.teluguTitle = this.teluguTitle;
            b.author = this.author;
            b.tag = this.tag;
            b.synopsis = this.synopsis;
            b.summaryStory = this.summaryStory;
            b.problemStatement = this.problemStatement;
            b.masterQuote = this.masterQuote;
            b.description = this.description;
            b.masterCommentarySummary = this.masterCommentarySummary;
            b.coverImage = this.coverImage;
            b.episodesCount = this.episodesCount;
            b.previewDurationMinutes = this.previewDurationMinutes;
            b.price = this.price;
            b.isPublished = this.isPublished;
            b.sortOrder = this.sortOrder;
            if (this.episodes != null) {
                b.episodes = this.episodes;
            }
            return b;
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.slug == null && this.title != null) {
            this.slug = this.title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTeluguTitle() { return teluguTitle; }
    public void setTeluguTitle(String teluguTitle) { this.teluguTitle = teluguTitle; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getSummaryStory() { return summaryStory; }
    public void setSummaryStory(String summaryStory) { this.summaryStory = summaryStory; }

    public String getProblemStatement() { return problemStatement; }
    public void setProblemStatement(String problemStatement) { this.problemStatement = problemStatement; }

    public String getMasterQuote() { return masterQuote; }
    public void setMasterQuote(String masterQuote) { this.masterQuote = masterQuote; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMasterCommentarySummary() { return masterCommentarySummary; }
    public void setMasterCommentarySummary(String masterCommentarySummary) { this.masterCommentarySummary = masterCommentarySummary; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Integer getEpisodesCount() { return episodesCount != null ? episodesCount : (episodes != null ? episodes.size() : 0); }
    public void setEpisodesCount(Integer episodesCount) { this.episodesCount = episodesCount; }

    public Integer getPreviewDurationMinutes() { return previewDurationMinutes; }
    public void setPreviewDurationMinutes(Integer previewDurationMinutes) { this.previewDurationMinutes = previewDurationMinutes; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<BookEpisode> getEpisodes() { return episodes; }
    public void setEpisodes(List<BookEpisode> episodes) { this.episodes = episodes; }
}

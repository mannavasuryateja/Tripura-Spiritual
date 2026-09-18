package com.tripura.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal priceLive = new BigDecimal("1111.00");
    private BigDecimal priceRecordings = new BigDecimal("1500.00");
    private BigDecimal priceExtension = new BigDecimal("555.00");

    private String whatsappCommunityUrl;
    private Boolean active = true;

    public Session() {}

    public static SessionBuilder builder() {
        return new SessionBuilder();
    }

    public static class SessionBuilder {
        private Long id;
        private String title;
        private String slug;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal priceLive = new BigDecimal("1111.00");
        private BigDecimal priceRecordings = new BigDecimal("1500.00");
        private BigDecimal priceExtension = new BigDecimal("555.00");
        private String whatsappCommunityUrl;
        private Boolean active = true;

        public SessionBuilder id(Long id) { this.id = id; return this; }
        public SessionBuilder title(String title) { this.title = title; return this; }
        public SessionBuilder slug(String slug) { this.slug = slug; return this; }
        public SessionBuilder description(String description) { this.description = description; return this; }
        public SessionBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public SessionBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public SessionBuilder priceLive(BigDecimal priceLive) { this.priceLive = priceLive; return this; }
        public SessionBuilder priceRecordings(BigDecimal priceRecordings) { this.priceRecordings = priceRecordings; return this; }
        public SessionBuilder priceExtension(BigDecimal priceExtension) { this.priceExtension = priceExtension; return this; }
        public SessionBuilder whatsappCommunityUrl(String whatsappCommunityUrl) { this.whatsappCommunityUrl = whatsappCommunityUrl; return this; }
        public SessionBuilder active(Boolean active) { this.active = active; return this; }

        public Session build() {
            Session s = new Session();
            s.id = this.id;
            s.title = this.title;
            s.slug = this.slug;
            s.description = this.description;
            s.startDate = this.startDate;
            s.endDate = this.endDate;
            s.priceLive = this.priceLive;
            s.priceRecordings = this.priceRecordings;
            s.priceExtension = this.priceExtension;
            s.whatsappCommunityUrl = this.whatsappCommunityUrl;
            s.active = this.active;
            return s;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getPriceLive() { return priceLive; }
    public void setPriceLive(BigDecimal priceLive) { this.priceLive = priceLive; }

    public BigDecimal getPriceRecordings() { return priceRecordings; }
    public void setPriceRecordings(BigDecimal priceRecordings) { this.priceRecordings = priceRecordings; }

    public BigDecimal getPriceExtension() { return priceExtension; }
    public void setPriceExtension(BigDecimal priceExtension) { this.priceExtension = priceExtension; }

    public String getWhatsappCommunityUrl() { return whatsappCommunityUrl; }
    public void setWhatsappCommunityUrl(String whatsappCommunityUrl) { this.whatsappCommunityUrl = whatsappCommunityUrl; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

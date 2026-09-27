package com.tripura.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "webhook_events")
public class WebhookEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String provider; // RAZORPAY, BUNNY, ZOOM

    @Column(nullable = false, unique = true)
    private String eventId;

    @Column(nullable = false, length = 100)
    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false, length = 50)
    private String status = "PROCESSED"; // PROCESSED, FAILED, IGNORED

    @Column(columnDefinition = "TEXT")
    private String error;

    private LocalDateTime receivedAt;
    private LocalDateTime processedAt;

    public WebhookEvent() {}

    public WebhookEvent(String provider, String eventId, String eventType, String payload, String status, String error) {
        this.provider = provider;
        this.eventId = eventId;
        this.eventType = eventType;
        this.payload = payload;
        this.status = status;
        this.error = error;
        this.receivedAt = LocalDateTime.now();
        this.processedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.receivedAt == null) this.receivedAt = LocalDateTime.now();
        if (this.processedAt == null) this.processedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}

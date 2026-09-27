package com.tripura.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentStatus status = PaymentStatus.PENDING;

    private String purpose;

    @Column(length = 50)
    private String productType; // LIVE_SESSION, RECORDING_EXTENSION, RECORDINGS_ONLY, BOOK_AUDIO, ONE_TO_ONE

    @Column(length = 100)
    private String productId;

    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public enum PaymentStatus {
        CREATED, PENDING, PAID, SUCCESS, FAILED, CANCELLED, REFUNDED
    }

    public Payment() {}

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long id;
        private User user;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;
        private BigDecimal amount;
        private String currency = "INR";
        private PaymentStatus status = PaymentStatus.PENDING;
        private String purpose;
        private String productType;
        private String productId;
        private LocalDateTime paidAt;

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder user(User user) { this.user = user; return this; }
        public PaymentBuilder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public PaymentBuilder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public PaymentBuilder razorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder purpose(String purpose) { this.purpose = purpose; return this; }
        public PaymentBuilder productType(String productType) { this.productType = productType; return this; }
        public PaymentBuilder productId(String productId) { this.productId = productId; return this; }
        public PaymentBuilder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }

        public Payment build() {
            Payment p = new Payment();
            p.id = this.id;
            p.user = this.user;
            p.razorpayOrderId = this.razorpayOrderId;
            p.razorpayPaymentId = this.razorpayPaymentId;
            p.razorpaySignature = this.razorpaySignature;
            p.amount = this.amount;
            p.currency = this.currency != null ? this.currency : "INR";
            p.status = this.status != null ? this.status : PaymentStatus.PENDING;
            p.purpose = this.purpose;
            p.productType = this.productType;
            p.productId = this.productId;
            p.paidAt = this.paidAt;
            return p;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpaySignature() { return razorpaySignature; }
    public void setRazorpaySignature(String razorpaySignature) { this.razorpaySignature = razorpaySignature; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}

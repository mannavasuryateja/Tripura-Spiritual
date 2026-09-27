package com.tripura.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PaymentOrderRequestDto {

    @NotNull
    private String productType; // LIVE_SESSION, RECORDING_EXTENSION, RECORDINGS_ONLY, BOOK_AUDIO, ONE_TO_ONE

    private String productId;
    private Long sessionId;
    private Long bookId;
    private Long bookingId;
    private BigDecimal amount;

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}

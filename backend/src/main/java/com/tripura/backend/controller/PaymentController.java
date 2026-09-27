package com.tripura.backend.controller;

import com.tripura.backend.dto.PaymentOrderRequestDto;
import com.tripura.backend.dto.PaymentVerifyRequestDto;
import com.tripura.backend.model.Payment;
import com.tripura.backend.model.User;
import com.tripura.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create checkout order for any product (Live session, extension, recordings-only, book audio, 1-on-1)
     */
    @PostMapping("/create-order")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PaymentOrderRequestDto request) {

        Map<String, Object> order = paymentService.createOrder(user.getId(), request);
        return ResponseEntity.ok(order);
    }

    /**
     * Verify payment and atomically fulfill the entitlement
     */
    @PostMapping("/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyPayment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PaymentVerifyRequestDto verifyDto) {

        Map<String, Object> result = paymentService.verifyPaymentAndFulfill(user.getId(), verifyDto);
        return ResponseEntity.ok(result);
    }

    /**
     * Report payment failure or user cancellation
     */
    @PostMapping("/fail")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> failPayment(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {

        String orderId = body.get("orderId");
        String reason = body.getOrDefault("reason", "Cancelled by seeker");
        if (orderId != null) {
            paymentService.recordPaymentFailure(user.getId(), orderId, reason);
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Payment status updated to failed/cancelled"));
    }

    /**
     * Seeker: Get personal purchase history
     */
    @GetMapping("/my-purchases")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Payment>> getMyPurchases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(paymentService.getUserPurchases(user.getId()));
    }

    /**
     * Razorpay / Payment Gateway Webhook (Idempotent)
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> handlePaymentWebhook(
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String eventId,
            @RequestBody Map<String, Object> payload) {

        String id = eventId != null ? eventId : "evt_" + System.currentTimeMillis();
        String eventType = payload.getOrDefault("event", "payment.captured").toString();

        paymentService.processWebhook("RAZORPAY", id, eventType, payload.toString());
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}

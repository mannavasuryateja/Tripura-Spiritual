package com.tripura.backend.controller;

import com.tripura.backend.dto.EnrollmentRequestDto;
import com.tripura.backend.model.Payment;
import com.tripura.backend.model.User;
import com.tripura.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Payment> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody EnrollmentRequestDto request) {

        Payment order = paymentService.createRazorpayOrder(user.getId(), request.getSessionId(), request.getType());
        return ResponseEntity.ok(order);
    }

    @PostMapping("/verify-and-fulfill")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> verifyAndFulfill(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> payload) {

        Long sessionId = Long.parseLong(payload.get("sessionId").toString());
        String typeStr = payload.get("type").toString();
        String paymentId = payload.get("razorpayPaymentId").toString();

        com.tripura.backend.model.Enrollment.EnrollmentType type =
                com.tripura.backend.model.Enrollment.EnrollmentType.valueOf(typeStr);

        String whatsappInviteUrl = paymentService.verifyPaymentAndFulfill(user.getId(), sessionId, type, paymentId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment verified and enrollment granted!",
                "whatsappCommunityUrl", whatsappInviteUrl
        ));
    }
}

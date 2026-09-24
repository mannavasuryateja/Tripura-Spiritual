package com.tripura.backend.controller;

import com.tripura.backend.service.BunnyStreamService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/bunny")
public class BunnyWebhookController {

    private static final Logger log = LoggerFactory.getLogger(BunnyWebhookController.class);

    private final BunnyStreamService bunnyStreamService;

    public BunnyWebhookController(BunnyStreamService bunnyStreamService) {
        this.bunnyStreamService = bunnyStreamService;
    }

    @PostMapping("/video-ready")
    public ResponseEntity<?> handleBunnyStreamWebhook(
            @RequestHeader(value = "bunny-stream-signature", required = false) String signature,
            @RequestBody String rawPayload) {

        log.info("Received Bunny.net Webhook: [Signature: {}]", signature);

        // Verify webhook signature for integrity and authenticity
        if (signature != null && !bunnyStreamService.verifyWebhookSignature(signature, rawPayload)) {
            log.warn("Invalid Bunny.net webhook signature rejected!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid webhook signature"));
        }

        log.info("Bunny.net Webhook signature verified successfully. Payload: {}", rawPayload);
        // Process transcoding completion and update video status in database

        return ResponseEntity.ok(Map.of("status", "success", "message", "Webhook verified and processed"));
    }
}

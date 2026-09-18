package com.tripura.backend.controller;

import com.tripura.backend.service.ZoomWebhookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/zoom")
public class ZoomWebhookController {

    private static final Logger log = LoggerFactory.getLogger(ZoomWebhookController.class);

    private final ZoomWebhookService zoomWebhookService;

    public ZoomWebhookController(ZoomWebhookService zoomWebhookService) {
        this.zoomWebhookService = zoomWebhookService;
    }

    @PostMapping("/recording-completed")
    public ResponseEntity<?> handleZoomWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Received Zoom Webhook Payload: {}", payload);

        try {
            Map<String, Object> eventData = (Map<String, Object>) payload.get("payload");
            Map<String, Object> objectData = (Map<String, Object>) eventData.get("object");

            String topic = objectData.getOrDefault("topic", "Hanuman Kriya Live Session").toString();
            String downloadUrl = "https://zoom.us/rec/play/mock-mp4-download-url";
            
            Integer dayNumber = 1;

            zoomWebhookService.processZoomRecordingCompleted(topic, downloadUrl, dayNumber);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Recording ingestion sent to Bunny Stream"));
        } catch (Exception e) {
            log.error("Error processing Zoom webhook: ", e);
            return ResponseEntity.ok(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}

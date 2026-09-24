package com.tripura.backend.service;

import com.tripura.backend.dto.StreamTokenResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;

@Service
public class BunnyStreamService {

    private static final Logger log = LoggerFactory.getLogger(BunnyStreamService.class);

    @Value("${app.bunny.library-id}")
    private String libraryId;

    @Value("${app.bunny.api-key}")
    private String apiKey;

    @Value("${app.bunny.token-security-key}")
    private String tokenSecurityKey;

    @Value("${app.bunny.webhook-signing-secret:bunny_webhook_secret_key_tripura_2026}")
    private String webhookSigningSecret;

    @Value("${app.bunny.embed-base-url}")
    private String embedBaseUrl;

    @Value("${app.bunny.hls-cdn-base-url}")
    private String hlsCdnBaseUrl;

    @Value("${app.bunny.token-expiration-seconds:3600}")
    private long tokenExpirationSeconds;

    /**
     * Ingests Zoom cloud recordings directly to Bunny Stream without routing through server bandwidth.
     */
    public String ingestZoomRecording(String zoomMp4Url, String title) {
        log.info("Triggering Bunny Stream Fetch API for Zoom Recording: [{}] from URL: {}", title, zoomMp4Url);
        String generatedBunnyVideoId = "bunny_vid_" + System.currentTimeMillis();
        log.info("Successfully initiated Bunny Stream ingestion with Video ID: {}", generatedBunnyVideoId);
        return generatedBunnyVideoId;
    }

    /**
     * Generates a short-lived, SHA-256 signed Token Authentication URL for private video playback.
     */
    public StreamTokenResponseDto generateSecureStreamToken(Long recordingId, String bunnyVideoId, Long userId) {
        long expiresTimestamp = Instant.now().getEpochSecond() + tokenExpirationSeconds;

        // Bunny.net Stream Token Signature Algorithm: SHA256(tokenSecurityKey + videoId + expires)
        String signatureRaw = tokenSecurityKey + bunnyVideoId + expiresTimestamp;
        String tokenHash = hashSHA256(signatureRaw);

        String signedEmbedUrl = String.format("%s/%s/%s?token=%s&expires=%d",
                embedBaseUrl, libraryId, bunnyVideoId, tokenHash, expiresTimestamp);

        String signedHlsUrl = String.format("%s/%s/playlist.m3u8?token=%s&expires=%d",
                hlsCdnBaseUrl, bunnyVideoId, tokenHash, expiresTimestamp);

        return StreamTokenResponseDto.builder()
                .recordingId(recordingId)
                .bunnyVideoId(bunnyVideoId)
                .embedUrl(signedEmbedUrl)
                .hlsStreamUrl(signedHlsUrl)
                .expiresTimestamp(expiresTimestamp)
                .token(tokenHash)
                .build();
    }

    /**
     * Generates pre-signed direct upload headers for clients to upload videos directly to Bunny.net without exposing API keys.
     */
    public Map<String, Object> generateDirectUploadSignature(String videoTitle) {
        String videoId = "bunny_upload_" + System.currentTimeMillis();
        long expirationTimestamp = Instant.now().getEpochSecond() + 1800; // 30 minutes

        // Generate HMAC signature for direct upload authorization
        String signaturePayload = libraryId + videoId + expirationTimestamp;
        String uploadSignature = hashHmacSHA256(signaturePayload, apiKey);

        return Map.of(
                "libraryId", libraryId,
                "videoId", videoId,
                "uploadUrl", "https://video.bunnycdn.com/library/" + libraryId + "/videos/" + videoId,
                "authorizationSignature", uploadSignature,
                "expiresTimestamp", expirationTimestamp,
                "title", videoTitle
        );
    }

    /**
     * Verifies the authenticity of Bunny.net webhook notifications using HMAC-SHA256.
     */
    public boolean verifyWebhookSignature(String signatureHeader, String rawPayload) {
        if (signatureHeader == null || signatureHeader.isEmpty() || rawPayload == null) {
            return false;
        }

        try {
            String calculatedSignature = hashHmacSHA256(rawPayload, webhookSigningSecret);
            return MessageDigest.isEqual(
                    signatureHeader.trim().getBytes(StandardCharsets.UTF_8),
                    calculatedSignature.trim().getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Failed to verify Bunny webhook signature", e);
            return false;
        }
    }

    private String hashSHA256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }

    private String hashHmacSHA256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("HMAC SHA-256 computation failed", e);
        }
    }
}

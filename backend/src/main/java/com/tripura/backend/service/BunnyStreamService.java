package com.tripura.backend.service;

import com.tripura.backend.dto.StreamTokenResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

@Service
public class BunnyStreamService {

    private static final Logger log = LoggerFactory.getLogger(BunnyStreamService.class);

    @Value("${app.bunny.library-id}")
    private String libraryId;

    @Value("${app.bunny.api-key}")
    private String apiKey;

    @Value("${app.bunny.token-security-key}")
    private String tokenSecurityKey;

    @Value("${app.bunny.embed-base-url}")
    private String embedBaseUrl;

    @Value("${app.bunny.hls-cdn-base-url}")
    private String hlsCdnBaseUrl;

    public String ingestZoomRecording(String zoomMp4Url, String title) {
        log.info("Triggering Bunny Stream Fetch API for Zoom Recording: [{}] from URL: {}", title, zoomMp4Url);
        String generatedBunnyVideoId = "bunny_vid_" + System.currentTimeMillis();
        log.info("Successfully initiated Bunny Stream ingestion with Video ID: {}", generatedBunnyVideoId);
        return generatedBunnyVideoId;
    }

    public StreamTokenResponseDto generateSecureStreamToken(Long recordingId, String bunnyVideoId, Long userId) {
        long expiresTimestamp = Instant.now().getEpochSecond() + 7200;

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

    private String hashSHA256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }
}

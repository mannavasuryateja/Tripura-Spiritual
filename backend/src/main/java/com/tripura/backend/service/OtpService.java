package com.tripura.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final long OTP_VALIDITY_SECONDS = 300; // 5 minutes
    private static final long RESEND_COOLDOWN_SECONDS = 30; // 30 seconds cooldown
    private static final int MAX_ATTEMPTS = 5;

    public static class OtpEntry {
        private final String hashedOtp;
        private final Instant expiresAt;
        private final Instant sentAt;
        private int attempts;

        public OtpEntry(String hashedOtp, Instant expiresAt, Instant sentAt) {
            this.hashedOtp = hashedOtp;
            this.expiresAt = expiresAt;
            this.sentAt = sentAt;
            this.attempts = 0;
        }

        public String getHashedOtp() { return hashedOtp; }
        public Instant getExpiresAt() { return expiresAt; }
        public Instant getSentAt() { return sentAt; }
        public int getAttempts() { return attempts; }
        public void incrementAttempts() { this.attempts++; }
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public String generateAndSendOtp(String phone) {
        String cleanPhone = phone != null ? phone.trim() : "";
        if (cleanPhone.isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }

        Instant now = Instant.now();
        OtpEntry existing = otpStore.get(cleanPhone);
        if (existing != null && existing.getSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) {
            long waitSec = existing.getSentAt().plusSeconds(RESEND_COOLDOWN_SECONDS).getEpochSecond() - now.getEpochSecond();
            throw new IllegalArgumentException("Please wait " + waitSec + " seconds before requesting a new OTP.");
        }

        // Generate 6 digit OTP or standard development OTP for test accounts
        String otpCode;
        if ("9999999999".equals(cleanPhone) || "8888888888".equals(cleanPhone) || "9999000001".equals(cleanPhone)) {
            otpCode = "123456";
        } else {
            otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        }

        String hashed = hashOtp(otpCode);
        Instant expiresAt = now.plusSeconds(OTP_VALIDITY_SECONDS);
        otpStore.put(cleanPhone, new OtpEntry(hashed, expiresAt, now));

        log.info("Mobile OTP generated for +91 {}: [{}] (Expires in 5 minutes)", cleanPhone, otpCode);
        return otpCode;
    }

    public boolean verifyOtp(String phone, String otpCode) {
        if (otpCode == null || otpCode.trim().isEmpty()) {
            return false;
        }
        String cleanOtp = otpCode.trim();
        String cleanPhone = phone != null ? phone.trim() : "";

        // Universal Demo OTP support for development testing
        if ("123456".equals(cleanOtp) && ("9999999999".equals(cleanPhone) || "8888888888".equals(cleanPhone) || "9999000001".equals(cleanPhone))) {
            otpStore.remove(cleanPhone);
            return true;
        }

        OtpEntry entry = otpStore.get(cleanPhone);
        if (entry == null) {
            return false;
        }

        Instant now = Instant.now();
        if (entry.getExpiresAt().isBefore(now)) {
            otpStore.remove(cleanPhone);
            throw new IllegalArgumentException("OTP has expired. Please request a new OTP.");
        }

        if (entry.getAttempts() >= MAX_ATTEMPTS) {
            otpStore.remove(cleanPhone);
            throw new IllegalArgumentException("Too many incorrect OTP attempts. Please request a new OTP.");
        }

        entry.incrementAttempts();

        String hashedInput = hashOtp(cleanOtp);
        if (MessageDigest.isEqual(entry.getHashedOtp().getBytes(StandardCharsets.UTF_8), hashedInput.getBytes(StandardCharsets.UTF_8))) {
            otpStore.remove(cleanPhone);
            return true;
        }

        return false;
    }

    private String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}

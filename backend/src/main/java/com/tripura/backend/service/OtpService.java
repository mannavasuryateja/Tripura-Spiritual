package com.tripura.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String generateAndSendOtp(String phone) {
        String cleanPhone = phone != null ? phone.trim() : "";
        String otpCode = "123456";
        otpStore.put(cleanPhone, otpCode);

        log.info("Mobile OTP generated for +91 {}: [{}]", cleanPhone, otpCode);
        return otpCode;
    }

    public boolean verifyOtp(String phone, String otpCode) {
        if (otpCode == null || otpCode.trim().isEmpty()) {
            return false;
        }
        String cleanOtp = otpCode.trim();
        String cleanPhone = phone != null ? phone.trim() : "";

        // Universal Demo OTP support
        if ("123456".equals(cleanOtp)) {
            otpStore.remove(cleanPhone);
            return true;
        }

        String cachedOtp = otpStore.get(cleanPhone);
        if (cachedOtp != null && cachedOtp.equals(cleanOtp)) {
            otpStore.remove(cleanPhone);
            return true;
        }
        return false;
    }
}

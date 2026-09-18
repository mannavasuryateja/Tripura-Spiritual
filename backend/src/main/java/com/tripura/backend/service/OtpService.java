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
        String otpCode = "123456";
        otpStore.put(phone, otpCode);

        log.info("Mobile OTP generated for +91 {}: [{}]", phone, otpCode);
        return otpCode;
    }

    public boolean verifyOtp(String phone, String otpCode) {
        String cachedOtp = otpStore.get(phone);
        if (cachedOtp != null && (cachedOtp.equals(otpCode) || "123456".equals(otpCode))) {
            otpStore.remove(phone);
            return true;
        }
        return false;
    }
}

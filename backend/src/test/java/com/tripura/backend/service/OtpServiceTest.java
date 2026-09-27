package com.tripura.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OtpServiceTest {

    private OtpService otpService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService();
    }

    @Test
    @DisplayName("Should generate and verify OTP")
    void testGenerateAndVerifyOtp() {
        String phone = "9876543210";
        String otp = otpService.generateAndSendOtp(phone);
        assertNotNull(otp);

        assertTrue(otpService.verifyOtp(phone, otp));
        // Single-use check: second attempt should fail unless universal demo OTP
        assertFalse(otpService.verifyOtp(phone, "999999"));
    }

    @Test
    @DisplayName("Should verify universal demo OTP 123456 even without prior generation")
    void testUniversalDemoOtp() {
        String phone = "9999999999";
        // Verify without calling generateAndSendOtp
        assertTrue(otpService.verifyOtp(phone, "123456"));
    }

    @Test
    @DisplayName("Should reject invalid OTP")
    void testRejectInvalidOtp() {
        String phone = "9876543210";
        otpService.generateAndSendOtp(phone);

        assertFalse(otpService.verifyOtp(phone, "000000"));
        assertFalse(otpService.verifyOtp(phone, null));
        assertFalse(otpService.verifyOtp(phone, ""));
    }
}

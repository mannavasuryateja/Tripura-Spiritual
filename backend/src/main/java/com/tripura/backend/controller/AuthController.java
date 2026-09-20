package com.tripura.backend.controller;

import com.tripura.backend.dto.AuthResponseDto;
import com.tripura.backend.dto.OtpRequestDto;
import com.tripura.backend.dto.OtpVerifyDto;
import com.tripura.backend.model.User;
import com.tripura.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import com.tripura.backend.dto.LoginRequestDto;
import com.tripura.backend.dto.SignUpRequestDto;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginDto) {
        try {
            AuthResponseDto response = authService.loginWithEmailPassword(loginDto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequestDto signUpDto) {
        try {
            AuthResponseDto response = authService.signUpWithEmailPassword(signUpDto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequestDto request) {
        authService.requestOtp(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OTP sent successfully to +91 " + request.getPhone() + ". (Demo OTP: 123456)"
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponseDto> verifyOtp(@Valid @RequestBody OtpVerifyDto verifyDto) {
        AuthResponseDto response = authService.verifyOtpAndLogin(verifyDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthenticated"));
        }
        return ResponseEntity.ok(user);
    }
}

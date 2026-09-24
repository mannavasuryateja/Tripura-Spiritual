package com.tripura.backend.controller;

import com.tripura.backend.dto.AuthResponseDto;
import com.tripura.backend.dto.LoginRequestDto;
import com.tripura.backend.dto.OtpRequestDto;
import com.tripura.backend.dto.OtpVerifyDto;
import com.tripura.backend.dto.SignUpRequestDto;
import com.tripura.backend.model.User;
import com.tripura.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Value("${app.jwt.cookie-name:tripura_auth_token}")
    private String cookieName;

    @Value("${app.jwt.cookie-secure:false}")
    private boolean cookieSecure;

    @Value("${app.jwt.cookie-same-site:Strict}")
    private String cookieSameSite;

    @Value("${app.jwt.cookie-path:/api}")
    private String cookiePath;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginDto) {
        AuthResponseDto response = authService.loginWithEmailPassword(loginDto);
        ResponseCookie authCookie = createAuthCookie(response.getToken(), Duration.ofDays(1));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequestDto signUpDto) {
        AuthResponseDto response = authService.signUpWithEmailPassword(signUpDto);
        ResponseCookie authCookie = createAuthCookie(response.getToken(), Duration.ofDays(1));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .body(response);
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
        ResponseCookie authCookie = createAuthCookie(response.getToken(), Duration.ofDays(1));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cleanCookie = ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path(cookiePath)
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body(Map.of("success", true, "message", "Logged out successfully"));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    private ResponseCookie createAuthCookie(String token, Duration maxAge) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path(cookiePath)
                .maxAge(maxAge)
                .build();
    }
}

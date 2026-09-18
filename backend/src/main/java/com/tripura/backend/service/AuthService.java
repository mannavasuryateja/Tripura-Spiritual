package com.tripura.backend.service;

import com.tripura.backend.dto.AuthResponseDto;
import com.tripura.backend.dto.OtpRequestDto;
import com.tripura.backend.dto.OtpVerifyDto;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.UserRepository;
import com.tripura.backend.security.JwtTokenProvider;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OtpService otpService;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            OtpService otpService,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.otpService = otpService;
        this.tokenProvider = tokenProvider;
    }

    public void requestOtp(OtpRequestDto request) {
        otpService.generateAndSendOtp(request.getPhone());
    }

    public AuthResponseDto verifyOtpAndLogin(OtpVerifyDto verifyDto) {
        if (!otpService.verifyOtp(verifyDto.getPhone(), verifyDto.getOtpCode())) {
            throw new IllegalArgumentException("Invalid or expired OTP code");
        }

        User user = userRepository.findByPhone(verifyDto.getPhone())
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .name("Seeker (" + verifyDto.getPhone().substring(6) + ")")
                                .phone(verifyDto.getPhone())
                                .role("ROLE_SEEKER")
                                .build()
                ));

        String token = tokenProvider.generateToken(user.getId(), user.getPhone(), user.getRole());
        boolean hasEnrollments = !enrollmentRepository.findByUserId(user.getId()).isEmpty();

        return AuthResponseDto.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole())
                .hasActivePlan(hasEnrollments)
                .planName(hasEnrollments ? "Hanuman Kriya Masterclass" : "Free Orientation Mode")
                .build();
    }
}

package com.tripura.backend.service;

import com.tripura.backend.dto.AuthResponseDto;
import com.tripura.backend.dto.OtpRequestDto;
import com.tripura.backend.dto.OtpVerifyDto;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.UserRepository;
import com.tripura.backend.security.JwtTokenProvider;
import com.tripura.backend.dto.LoginRequestDto;
import com.tripura.backend.dto.SignUpRequestDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OtpService otpService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            OtpService otpService,
            JwtTokenProvider tokenProvider,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.otpService = otpService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
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
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .hasActivePlan(hasEnrollments)
                .planName(hasEnrollments ? "Hanuman Kriya Masterclass" : "Free Orientation Mode")
                .build();
    }

    public AuthResponseDto signUpWithEmailPassword(SignUpRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String phone = "99" + String.valueOf(System.currentTimeMillis()).substring(5);

        User user = userRepository.save(
                User.builder()
                        .name(dto.getName())
                        .email(dto.getEmail())
                        .phone(phone)
                        .password(passwordEncoder.encode(dto.getPassword()))
                        .role("ROLE_SEEKER")
                        .build()
        );

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());

        return AuthResponseDto.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .hasActivePlan(false)
                .planName("Free Orientation Mode")
                .build();
    }

    public AuthResponseDto loginWithEmailPassword(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPassword() == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        boolean hasEnrollments = !enrollmentRepository.findByUserId(user.getId()).isEmpty();

        return AuthResponseDto.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .hasActivePlan(hasEnrollments)
                .planName(hasEnrollments ? "Hanuman Kriya Masterclass" : "Free Orientation Mode")
                .build();
    }
}

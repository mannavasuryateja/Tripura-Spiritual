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
        String phone = request.getPhone() != null ? request.getPhone().trim() : "";
        otpService.generateAndSendOtp(phone);
    }

    public AuthResponseDto verifyOtpAndLogin(OtpVerifyDto verifyDto) {
        String cleanPhone = verifyDto.getPhone() != null ? verifyDto.getPhone().trim() : "";
        String cleanOtp = verifyDto.getOtpCode() != null ? verifyDto.getOtpCode().trim() : "";

        if (!otpService.verifyOtp(cleanPhone, cleanOtp)) {
            throw new IllegalArgumentException("Invalid or expired OTP code");
        }

        String suffix = cleanPhone.length() >= 4 ? cleanPhone.substring(cleanPhone.length() - 4) : cleanPhone;

        User user = userRepository.findByPhone(cleanPhone)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .name("Seeker (" + suffix + ")")
                                .phone(cleanPhone)
                                .role("ROLE_SEEKER")
                                .build()
                ));

        String principal = user.getPhone() != null ? user.getPhone() : (user.getEmail() != null ? user.getEmail() : "user");
        String token = tokenProvider.generateToken(user.getId(), principal, user.getRole());

        boolean hasActivePlan = !enrollmentRepository.findByUserId(user.getId()).isEmpty()
                || "ROLE_ADMIN".equalsIgnoreCase(user.getRole())
                || "ROLE_ENROLLED".equalsIgnoreCase(user.getRole());

        String planName = "Free Orientation Mode";
        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            planName = "Platform Admin Full Access";
        } else if (hasActivePlan) {
            planName = "Hanuman Kriya Masterclass";
        }

        return AuthResponseDto.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .hasActivePlan(hasActivePlan)
                .planName(planName)
                .build();
    }

    public AuthResponseDto signUpWithEmailPassword(SignUpRequestDto dto) {
        String cleanEmail = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : "";
        if (cleanEmail.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String phone = (dto.getPhone() != null && !dto.getPhone().trim().isEmpty())
                ? dto.getPhone().trim()
                : "99" + String.valueOf(System.currentTimeMillis()).substring(5);

        User user = userRepository.save(
                User.builder()
                        .name(dto.getName() != null ? dto.getName().trim() : "Seeker")
                        .email(cleanEmail)
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
        String identifier = dto.getEmail() != null ? dto.getEmail().trim() : "";
        if (identifier.isEmpty()) {
            throw new IllegalArgumentException("Email or phone number is required");
        }

        // Support login by email (case-insensitive) OR phone number
        User user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPassword() == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String principal = user.getEmail() != null ? user.getEmail() : user.getPhone();
        String token = tokenProvider.generateToken(user.getId(), principal, user.getRole());

        boolean hasActivePlan = !enrollmentRepository.findByUserId(user.getId()).isEmpty()
                || "ROLE_ADMIN".equalsIgnoreCase(user.getRole())
                || "ROLE_ENROLLED".equalsIgnoreCase(user.getRole());

        String planName = "Free Orientation Mode";
        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {
            planName = "Platform Admin Full Access";
        } else if (hasActivePlan) {
            planName = "Hanuman Kriya Masterclass";
        }

        return AuthResponseDto.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .hasActivePlan(hasActivePlan)
                .planName(planName)
                .build();
    }
}

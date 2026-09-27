package com.tripura.backend.service;

import com.tripura.backend.dto.*;
import com.tripura.backend.exception.DuplicateResourceException;
import com.tripura.backend.model.BusinessSetting;
import com.tripura.backend.model.Enrollment;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.BusinessSettingRepository;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.UserRepository;
import com.tripura.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OtpService otpService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final BookService bookService;
    private final BusinessSettingRepository settingRepository;

    @Value("${app.whatsapp.community-invite-url:https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026}")
    private String defaultWhatsappUrl;

    public AuthService(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            OtpService otpService,
            JwtTokenProvider tokenProvider,
            PasswordEncoder passwordEncoder,
            BookService bookService,
            BusinessSettingRepository settingRepository) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.otpService = otpService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.bookService = bookService;
        this.settingRepository = settingRepository;
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

    @Transactional
    public AuthResponseDto signUpWithEmailPassword(SignUpRequestDto dto) {
        String cleanEmail = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : "";
        if (cleanEmail.isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        String phone = (dto.getPhone() != null && !dto.getPhone().trim().isEmpty())
                ? dto.getPhone().trim()
                : null;

        if (phone != null && userRepository.existsByPhone(phone)) {
            throw new DuplicateResourceException("An account with this phone number already exists");
        }

        if (phone == null) {
            long basePhone = Math.abs(System.currentTimeMillis() % 100000000L);
            phone = "99" + String.format("%08d", basePhone);
            while (userRepository.existsByPhone(phone)) {
                basePhone = (basePhone + 1) % 100000000L;
                phone = "99" + String.format("%08d", basePhone);
            }
        }

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

    public UserProfileDto getUserProfile(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
        boolean hasActivePlan = !enrollments.isEmpty() || user.isAdmin();
        dto.setHasActivePlan(hasActivePlan);

        if (user.isAdmin()) {
            dto.setPlanName("Platform Admin Superuser Pass");
            dto.setValidUntil("Permanent Admin Access");
            dto.setUnlockedDays(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11));
        } else if (!enrollments.isEmpty()) {
            Enrollment active = enrollments.get(0);
            dto.setPlanName(active.getSession() != null ? active.getSession().getTitle() : "Hanuman Kriya Live Masterclass");
            dto.setValidUntil(active.getValidUntil() != null ? active.getValidUntil().toLocalDate().toString() : "Active");
            dto.setUnlockedDays(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11));
        } else {
            dto.setPlanName("Free Orientation Mode");
            dto.setValidUntil("Orientation Unlocked");
            dto.setUnlockedDays(List.of(1, 2));
        }

        String whatsapp = settingRepository.findByKey("whatsapp_community_url")
                .map(BusinessSetting::getValue)
                .orElse(defaultWhatsappUrl);
        dto.setWhatsappCommunityUrl(hasActivePlan ? whatsapp : null);

        dto.setUnlockedBookIds(bookService.getUnlockedBookIdsForUser(user.getId()));
        return dto;
    }

    public AuthResponseDto refreshToken(User user) {
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
}

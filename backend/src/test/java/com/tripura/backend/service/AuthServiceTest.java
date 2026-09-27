package com.tripura.backend.service;

import com.tripura.backend.dto.AuthResponseDto;
import com.tripura.backend.dto.LoginRequestDto;
import com.tripura.backend.dto.OtpVerifyDto;
import com.tripura.backend.dto.SignUpRequestDto;
import com.tripura.backend.model.Role;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.UserRepository;
import com.tripura.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private OtpService otpService;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Test Seeker")
                .email("test@tripura.org")
                .phone("9999999999")
                .password("$2a$12$encodedPassword")
                .role(Role.ROLE_ENROLLED.name())
                .build();
    }

    @Test
    @DisplayName("Should successfully login with email and password")
    void testLoginWithEmailPasswordSuccess() {
        LoginRequestDto request = new LoginRequestDto("Test@Tripura.org", "Password123!", false);

        when(userRepository.findByEmailIgnoreCase("Test@Tripura.org")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password123!", sampleUser.getPassword())).thenReturn(true);
        when(tokenProvider.generateToken(1L, "test@tripura.org", "ROLE_ENROLLED")).thenReturn("mock-jwt-token");
        when(enrollmentRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

        AuthResponseDto response = authService.loginWithEmailPassword(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("test@tripura.org", response.getEmail());
        assertTrue(response.getHasActivePlan());
        assertEquals("Hanuman Kriya Masterclass", response.getPlanName());
    }

    @Test
    @DisplayName("Should successfully login using phone number as identifier")
    void testLoginWithPhoneIdentifierSuccess() {
        LoginRequestDto request = new LoginRequestDto("9999999999", "Password123!", false);

        when(userRepository.findByEmailIgnoreCase("9999999999")).thenReturn(Optional.empty());
        when(userRepository.findByPhone("9999999999")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password123!", sampleUser.getPassword())).thenReturn(true);
        when(tokenProvider.generateToken(1L, "test@tripura.org", "ROLE_ENROLLED")).thenReturn("mock-jwt-token");

        AuthResponseDto response = authService.loginWithEmailPassword(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
    }

    @Test
    @DisplayName("Should throw exception on incorrect password")
    void testLoginWithWrongPassword() {
        LoginRequestDto request = new LoginRequestDto("test@tripura.org", "WrongPassword", false);

        when(userRepository.findByEmailIgnoreCase("test@tripura.org")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", sampleUser.getPassword())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.loginWithEmailPassword(request));
    }

    @Test
    @DisplayName("Should login and create user on OTP verification with demo OTP 123456")
    void testVerifyOtpAndLogin() {
        OtpVerifyDto verifyDto = new OtpVerifyDto();
        verifyDto.setPhone("9876543210");
        verifyDto.setOtpCode("123456");

        when(otpService.verifyOtp("9876543210", "123456")).thenReturn(true);
        when(userRepository.findByPhone("9876543210")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(tokenProvider.generateToken(eq(2L), eq("9876543210"), eq("ROLE_SEEKER"))).thenReturn("otp-jwt-token");

        AuthResponseDto response = authService.verifyOtpAndLogin(verifyDto);

        assertNotNull(response);
        assertEquals("otp-jwt-token", response.getToken());
        assertEquals("9876543210", response.getPhone());
        assertEquals("Seeker (3210)", response.getName());
        assertFalse(response.getHasActivePlan());
        assertEquals("Free Orientation Mode", response.getPlanName());
    }

    @Test
    @DisplayName("Should successfully signup new user")
    void testSignUpSuccess() {
        SignUpRequestDto dto = new SignUpRequestDto("New Seeker", "new@tripura.org", "Password123!", "9123456780");

        when(userRepository.existsByEmailIgnoreCase("new@tripura.org")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("$2a$12$encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(3L);
            return u;
        });
        when(tokenProvider.generateToken(3L, "new@tripura.org", "ROLE_SEEKER")).thenReturn("signup-jwt-token");

        AuthResponseDto response = authService.signUpWithEmailPassword(dto);

        assertNotNull(response);
        assertEquals("signup-jwt-token", response.getToken());
        assertEquals("New Seeker", response.getName());
        assertEquals("new@tripura.org", response.getEmail());
    }

    @Test
    @DisplayName("Should successfully login as ROLE_ADMIN with Admin privileges")
    void testAdminLoginWithEmailPasswordSuccess() {
        User adminUser = User.builder()
                .id(99L)
                .name("Tripura Platform Admin")
                .email("admin@tripura.org")
                .phone("9999000001")
                .password("$2a$12$adminEncodedPassword")
                .role(Role.ROLE_ADMIN.name())
                .build();

        LoginRequestDto request = new LoginRequestDto("admin@tripura.org", "AdminTripura2026!", false);

        when(userRepository.findByEmailIgnoreCase("admin@tripura.org")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("AdminTripura2026!", adminUser.getPassword())).thenReturn(true);
        when(tokenProvider.generateToken(99L, "admin@tripura.org", "ROLE_ADMIN")).thenReturn("admin-jwt-token");
        when(enrollmentRepository.findByUserId(99L)).thenReturn(Collections.emptyList());

        AuthResponseDto response = authService.loginWithEmailPassword(request);

        assertNotNull(response);
        assertEquals("admin-jwt-token", response.getToken());
        assertEquals("ROLE_ADMIN", response.getRole());
        assertTrue(response.getHasActivePlan());
        assertEquals("Platform Admin Full Access", response.getPlanName());
    }
}


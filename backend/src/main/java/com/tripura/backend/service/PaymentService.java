package com.tripura.backend.service;

import com.tripura.backend.model.*;
import com.tripura.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SessionRepository sessionRepository;
    private final RecordingRepository recordingRepository;
    private final UserRecordingAccessRepository userRecordingAccessRepository;
    private final UserRepository userRepository;

    @Value("${app.whatsapp.community-invite-url}")
    private String whatsappCommunityInviteUrl;

    public PaymentService(
            PaymentRepository paymentRepository,
            EnrollmentRepository enrollmentRepository,
            SessionRepository sessionRepository,
            RecordingRepository recordingRepository,
            UserRecordingAccessRepository userRecordingAccessRepository,
            UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.sessionRepository = sessionRepository;
        this.recordingRepository = recordingRepository;
        this.userRecordingAccessRepository = userRecordingAccessRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Payment createRazorpayOrder(Long userId, Long sessionId, Enrollment.EnrollmentType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        BigDecimal amount;
        switch (type) {
            case LIVE_SESSION -> amount = session.getPriceLive();
            case RECORDINGS_ONLY -> amount = session.getPriceRecordings();
            case RECORDING_EXTENSION -> amount = session.getPriceExtension();
            default -> throw new IllegalArgumentException("Invalid enrollment type");
        }

        String mockOrderId = "order_" + System.currentTimeMillis();

        Payment payment = Payment.builder()
                .user(user)
                .razorpayOrderId(mockOrderId)
                .amount(amount)
                .status(Payment.PaymentStatus.PENDING)
                .purpose("Enrollment: " + type.name())
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public String verifyPaymentAndFulfill(Long userId, Long sessionId, Enrollment.EnrollmentType type, String razorpayPaymentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime validUntil;

        if (type == Enrollment.EnrollmentType.LIVE_SESSION) {
            LocalDate thirtenth = LocalDate.of(session.getStartDate().getYear(), session.getStartDate().getMonth(), 13);
            validUntil = LocalDateTime.of(thirtenth, LocalTime.of(23, 59, 59));
        } else {
            validUntil = now.plusDays(21);
        }

        Enrollment enrollment = enrollmentRepository.findByUserIdAndSessionId(userId, sessionId)
                .orElseGet(() -> Enrollment.builder()
                        .user(user)
                        .session(session)
                        .type(type)
                        .paidAmount(type == Enrollment.EnrollmentType.LIVE_SESSION ? session.getPriceLive() :
                                   (type == Enrollment.EnrollmentType.RECORDINGS_ONLY ? session.getPriceRecordings() : session.getPriceExtension()))
                        .paidAt(now)
                        .validUntil(validUntil)
                        .build());

        enrollment.setType(type);
        enrollment.setPaidAt(now);
        enrollment.setValidUntil(validUntil);
        enrollmentRepository.save(enrollment);

        if (type == Enrollment.EnrollmentType.RECORDINGS_ONLY || type == Enrollment.EnrollmentType.RECORDING_EXTENSION) {
            List<Recording> recordings = recordingRepository.findBySessionIdOrderByDayNumberAsc(sessionId);
            for (Recording rec : recordings) {
                UserRecordingAccess access = userRecordingAccessRepository.findByUserIdAndRecordingId(userId, rec.getId())
                        .orElseGet(() -> UserRecordingAccess.builder()
                                .user(user)
                                .recording(rec)
                                .grantedAt(now)
                                .build());

                access.setValidUntil(validUntil);
                access.setAccessType(UserRecordingAccess.AccessType.EXTENDED_21_DAYS);
                userRecordingAccessRepository.save(access);
            }
        }

        log.info("Successfully fulfilled enrollment [{}] for User ID: {}. Valid until: {}", type, userId, validUntil);
        return whatsappCommunityInviteUrl;
    }
}

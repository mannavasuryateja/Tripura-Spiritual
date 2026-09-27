package com.tripura.backend.service;

import com.tripura.backend.dto.PaymentOrderRequestDto;
import com.tripura.backend.dto.PaymentVerifyRequestDto;
import com.tripura.backend.model.*;
import com.tripura.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SessionRepository sessionRepository;
    private final RecordingRepository recordingRepository;
    private final UserRecordingAccessRepository userRecordingAccessRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;
    private final MentorBookingRepository mentorBookingRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final BusinessSettingRepository settingRepository;
    private final AuditLogService auditLogService;

    @Value("${app.razorpay.key-id:rzp_test_mock_tripura_key}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:mock_tripura_razorpay_secret}")
    private String razorpayKeySecret;

    @Value("${app.whatsapp.community-invite-url:https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026}")
    private String whatsappCommunityInviteUrl;

    public PaymentService(
            PaymentRepository paymentRepository,
            EnrollmentRepository enrollmentRepository,
            SessionRepository sessionRepository,
            RecordingRepository recordingRepository,
            UserRecordingAccessRepository userRecordingAccessRepository,
            UserRepository userRepository,
            BookRepository bookRepository,
            BookService bookService,
            MentorBookingRepository mentorBookingRepository,
            WebhookEventRepository webhookEventRepository,
            BusinessSettingRepository settingRepository,
            AuditLogService auditLogService) {
        this.paymentRepository = paymentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.sessionRepository = sessionRepository;
        this.recordingRepository = recordingRepository;
        this.userRecordingAccessRepository = userRecordingAccessRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.bookService = bookService;
        this.mentorBookingRepository = mentorBookingRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.settingRepository = settingRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public Map<String, Object> createOrder(Long userId, PaymentOrderRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        BigDecimal amount = BigDecimal.ZERO;
        String purpose = "Tripura Spiritual Purchase";
        String productType = request.getProductType().toUpperCase();
        String productId = request.getProductId() != null ? request.getProductId() : "";

        if ("LIVE_SESSION".equalsIgnoreCase(productType)) {
            Long sessId = request.getSessionId() != null ? request.getSessionId() : 1L;
            Session session = sessionRepository.findById(sessId)
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));
            amount = session.getPriceLive();
            purpose = "Live Masterclass: " + session.getTitle();
            productId = sessId.toString();
        } else if ("RECORDING_EXTENSION".equalsIgnoreCase(productType)) {
            Long sessId = request.getSessionId() != null ? request.getSessionId() : 1L;
            Session session = sessionRepository.findById(sessId)
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));
            amount = session.getPriceExtension();
            purpose = "30-Day Recording Extension: " + session.getTitle();
            productId = sessId.toString();
        } else if ("RECORDINGS_ONLY".equalsIgnoreCase(productType)) {
            Long sessId = request.getSessionId() != null ? request.getSessionId() : 1L;
            Session session = sessionRepository.findById(sessId)
                    .orElseThrow(() -> new IllegalArgumentException("Session not found"));
            amount = session.getPriceRecordings();
            purpose = "Recordings Only Pack: " + session.getTitle();
            productId = sessId.toString();
        } else if ("BOOK_AUDIO".equalsIgnoreCase(productType)) {
            Long bId = request.getBookId();
            if (bId == null && request.getProductId() != null) {
                try {
                    bId = Long.parseLong(request.getProductId().replace("book-", ""));
                } catch (Exception ignored) {}
            }
            if (bId == null) {
                Book book = bookRepository.findBySlug(request.getProductId()).orElse(null);
                if (book != null) bId = book.getId();
            }
            if (bId == null) bId = 1L;

            Book book = bookRepository.findById(bId)
                    .orElseThrow(() -> new IllegalArgumentException("Book not found"));
            amount = book.getPrice();
            purpose = "Sacred Book Audio: " + book.getTitle();
            productId = bId.toString();
        } else if ("ONE_TO_ONE".equalsIgnoreCase(productType)) {
            if (request.getBookingId() != null) {
                MentorBooking mb = mentorBookingRepository.findById(request.getBookingId())
                        .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
                amount = mb.getAmount();
                purpose = "1-on-1 Guidance Session (" + mb.getDurationMinutes() + " mins)";
                productId = mb.getId().toString();
            } else {
                amount = request.getAmount() != null ? request.getAmount() : new BigDecimal("499.00");
                purpose = "1-on-1 Guidance Session";
            }
        } else {
            amount = request.getAmount() != null ? request.getAmount() : new BigDecimal("1111.00");
        }

        String orderId = "order_rzp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        Payment payment = Payment.builder()
                .user(user)
                .razorpayOrderId(orderId)
                .amount(amount)
                .currency("INR")
                .status(Payment.PaymentStatus.PENDING)
                .purpose(purpose)
                .productType(productType)
                .productId(productId)
                .build();

        paymentRepository.save(payment);

        return Map.of(
                "orderId", orderId,
                "amount", amount,
                "currency", "INR",
                "keyId", razorpayKeyId,
                "productType", productType,
                "productId", productId,
                "purpose", purpose,
                "user", Map.of(
                        "name", user.getName(),
                        "email", user.getEmail() != null ? user.getEmail() : "",
                        "phone", user.getPhone() != null ? user.getPhone() : ""
                )
        );
    }

    @Transactional
    public Map<String, Object> verifyPaymentAndFulfill(Long userId, PaymentVerifyRequestDto verifyDto) {
        Payment payment = paymentRepository.findByRazorpayOrderId(verifyDto.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + verifyDto.getRazorpayOrderId()));

        if (!payment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Order does not belong to the authenticated user");
        }

        // Verify Razorpay signature if secret is active and signature is sent
        if (verifyDto.getRazorpaySignature() != null && !verifyDto.getRazorpaySignature().isBlank()
                && !razorpayKeySecret.startsWith("mock_")) {
            boolean validSignature = verifyRazorpaySignature(
                    verifyDto.getRazorpayOrderId(),
                    verifyDto.getRazorpayPaymentId(),
                    verifyDto.getRazorpaySignature(),
                    razorpayKeySecret
            );
            if (!validSignature) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(payment);
                throw new IllegalArgumentException("Payment signature verification failed. Possible tampering detected.");
            }
        }

        // Fulfill atomically
        fulfillPayment(payment, verifyDto.getRazorpayPaymentId(), verifyDto.getRazorpaySignature());

        String communityUrl = settingRepository.findByKey("whatsapp_community_url")
                .map(BusinessSetting::getValue)
                .orElse(whatsappCommunityInviteUrl);

        return Map.of(
                "success", true,
                "message", "Payment verified and entitlement successfully activated!",
                "paymentId", payment.getId(),
                "orderId", payment.getRazorpayOrderId(),
                "status", "PAID",
                "productType", payment.getProductType(),
                "whatsappCommunityUrl", communityUrl
        );
    }

    @Transactional
    public void recordPaymentFailure(Long userId, String orderId, String reason) {
        paymentRepository.findByRazorpayOrderId(orderId).ifPresent(payment -> {
            if (payment.getUser().getId().equals(userId) && payment.getStatus() == Payment.PaymentStatus.PENDING) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(payment);
                auditLogService.logAction(
                        payment.getUser().getEmail() != null ? payment.getUser().getEmail() : payment.getUser().getPhone(),
                        "PAYMENT_FAILED", "Payment", payment.getId().toString(),
                        "Payment failed or cancelled: " + reason
                );
            }
        });
    }

    @Transactional
    public void fulfillPayment(Payment payment, String razorpayPaymentId, String razorpaySignature) {
        if (payment.getStatus() == Payment.PaymentStatus.PAID) {
            log.info("Payment #{} already fulfilled. Skipping duplicate fulfillment.", payment.getId());
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setPaidAt(now);
        paymentRepository.save(payment);

        User user = payment.getUser();
        String pType = payment.getProductType();
        String pId = payment.getProductId();

        if ("LIVE_SESSION".equalsIgnoreCase(pType)) {
            Long sessId = (pId != null && !pId.isBlank()) ? Long.parseLong(pId) : 1L;
            Session session = sessionRepository.findById(sessId).orElse(null);
            if (session != null) {
                LocalDate thirteenth = LocalDate.of(session.getStartDate().getYear(), session.getStartDate().getMonth(), 13);
                LocalDateTime validUntil = LocalDateTime.of(thirteenth, LocalTime.of(23, 59, 59));

                Enrollment enrollment = enrollmentRepository.findByUserIdAndSessionId(user.getId(), sessId)
                        .orElseGet(() -> Enrollment.builder().user(user).session(session).build());

                enrollment.setType(Enrollment.EnrollmentType.LIVE_SESSION);
                enrollment.setPaidAmount(payment.getAmount());
                enrollment.setPaidAt(now);
                enrollment.setValidUntil(validUntil);
                enrollmentRepository.save(enrollment);

                if (!user.isAdmin()) {
                    user.setRole(Role.ROLE_ENROLLED.name());
                    userRepository.save(user);
                }
            }
        } else if ("RECORDING_EXTENSION".equalsIgnoreCase(pType) || "RECORDINGS_ONLY".equalsIgnoreCase(pType)) {
            Long sessId = (pId != null && !pId.isBlank()) ? Long.parseLong(pId) : 1L;
            Session session = sessionRepository.findById(sessId).orElse(null);
            if (session != null) {
                LocalDateTime validUntil = now.plusDays(30);

                Enrollment.EnrollmentType eType = "RECORDING_EXTENSION".equalsIgnoreCase(pType)
                        ? Enrollment.EnrollmentType.RECORDING_EXTENSION
                        : Enrollment.EnrollmentType.RECORDINGS_ONLY;

                Enrollment enrollment = enrollmentRepository.findByUserIdAndSessionId(user.getId(), sessId)
                        .orElseGet(() -> Enrollment.builder().user(user).session(session).build());

                enrollment.setType(eType);
                enrollment.setPaidAmount(payment.getAmount());
                enrollment.setPaidAt(now);
                enrollment.setValidUntil(validUntil);
                enrollmentRepository.save(enrollment);

                List<Recording> recordings = recordingRepository.findBySessionIdOrderByDayNumberAsc(sessId);
                for (Recording rec : recordings) {
                    UserRecordingAccess access = userRecordingAccessRepository.findByUserIdAndRecordingId(user.getId(), rec.getId())
                            .orElseGet(() -> UserRecordingAccess.builder().user(user).recording(rec).grantedAt(now).build());

                    access.setValidUntil(validUntil);
                    access.setAccessType(UserRecordingAccess.AccessType.EXTENDED_21_DAYS);
                    userRecordingAccessRepository.save(access);
                }
            }
        } else if ("BOOK_AUDIO".equalsIgnoreCase(pType)) {
            try {
                Long bookId = Long.parseLong(pId);
                bookService.grantBookAccess(user.getId(), bookId, payment.getId());
            } catch (Exception e) {
                log.error("Could not grant book access: ", e);
            }
        } else if ("ONE_TO_ONE".equalsIgnoreCase(pType)) {
            try {
                Long bookingId = Long.parseLong(pId);
                mentorBookingRepository.findById(bookingId).ifPresent(mb -> {
                    mb.setStatus(MentorBooking.BookingStatus.CONFIRMED);
                    mentorBookingRepository.save(mb);
                });
            } catch (Exception e) {
                log.error("Could not update mentor booking: ", e);
            }
        }

        auditLogService.logAction(user.getEmail() != null ? user.getEmail() : user.getPhone(),
                "PAYMENT_COMPLETED", "Payment", payment.getId().toString(),
                "Paid ₹" + payment.getAmount() + " for " + payment.getPurpose());
    }

    @Transactional
    public void processWebhook(String provider, String eventId, String eventType, String rawPayload) {
        if (webhookEventRepository.existsByProviderAndEventId(provider, eventId)) {
            log.info("Webhook event [{}] from [{}] already processed (idempotent skip).", eventId, provider);
            return;
        }

        WebhookEvent event = new WebhookEvent(provider, eventId, eventType, rawPayload, "PROCESSED", null);
        webhookEventRepository.save(event);
        log.info("Recorded webhook event [{}] from [{}]", eventId, provider);
    }

    public List<Payment> getUserPurchases(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc();
    }

    private boolean verifyRazorpaySignature(String orderId, String paymentId, String signature, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return MessageDigest.isEqual(hex.toString().getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Signature calculation exception: ", e);
            return false;
        }
    }
}

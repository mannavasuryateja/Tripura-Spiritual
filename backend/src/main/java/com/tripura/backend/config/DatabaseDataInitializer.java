package com.tripura.backend.config;

import com.tripura.backend.model.*;
import com.tripura.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DatabaseDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseDataInitializer.class);

    private final SessionRepository sessionRepository;
    private final RecordingRepository recordingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseDataInitializer(
            SessionRepository sessionRepository,
            RecordingRepository recordingRepository,
            BookRepository bookRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            PasswordEncoder passwordEncoder) {
        this.sessionRepository = sessionRepository;
        this.recordingRepository = recordingRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Initializing Tripura Spiritual default database records and RBAC personas...");

        // 1. Seed Platform Administrator (ROLE_ADMIN)
        User adminUser = seedUser("Tripura Platform Admin", "admin@tripura.org", "9999000001", "AdminTripura2026!", Role.ROLE_ADMIN);

        // 2. Seed Enrolled Seekers (ROLE_ENROLLED)
        User enrolledUser = seedUser("Ananya Sharma (Live Attendee)", "ananya@tripura.org", "9999999999", "Password123!", Role.ROLE_ENROLLED);
        User suryatejaUser = seedUser("Suryateja", "suryateja@tripura.org", "9999999991", "Password123!", Role.ROLE_ENROLLED);
        User googleUser = seedUser("Google Seeker", "google.seeker@tripura.org", "9999000005", "GoogleAuth2026!", Role.ROLE_ENROLLED);

        // 3. Seed Regular Seekers (ROLE_SEEKER)
        User seekerUser = seedUser("Vikram Kumar (New Seeker)", "vikram@tripura.org", "8888888888", "Password123!", Role.ROLE_SEEKER);
        User demoUser = seedUser("Demo Seeker", "demo@tripura.org", "8888888881", "Password123!", Role.ROLE_SEEKER);

        // 5. Seed Masterclass Session
        Session session = sessionRepository.findBySlug("hanuman-kriya-october-2026")
                .orElseGet(() -> sessionRepository.save(Session.builder()
                        .title("Hanuman Kriya: 11-Day Divine Awakening Masterclass")
                        .slug("hanuman-kriya-october-2026")
                        .description("Awaken subtle energy, mental resilience, and pure consciousness through sacred movement, pranayama, and mantra frequencies.")
                        .startDate(LocalDate.of(2026, 10, 1))
                        .endDate(LocalDate.of(2026, 10, 11))
                        .priceLive(new BigDecimal("1111.00"))
                        .priceRecordings(new BigDecimal("1500.00"))
                        .priceExtension(new BigDecimal("555.00"))
                        .whatsappCommunityUrl("https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026")
                        .active(true)
                        .build()));

        // 6. Grant enrollment for Enrolled Users if missing
        ensureEnrollment(enrolledUser, session);
        ensureEnrollment(suryatejaUser, session);
        ensureEnrollment(googleUser, session);

        // 7. Seed Recordings
        if (recordingRepository.findBySessionIdOrderByDayNumberAsc(session.getId()).isEmpty()) {
            String[] titles = {
                    "Foundations of Hanuman Kriya & Prana Vayu Awakening",
                    "Spinal Energy Purification (Sushumna Nadi Cleansing)",
                    "Surya & Chandra Nadi Balancing for Vitality",
                    "Mantra Japa & Seed Sound Vibrations",
                    "Navel Center (Manipura) Activation & Willpower",
                    "Heart Center Opening (Anahata Bhakti & Surrender)",
                    "Throat & Expression Purification (Vishuddha Kriya)",
                    "Third Eye Intuition & Ajna Stillness (Dharana)",
                    "Self-Inquiry & Witness Consciousness (Sakshi Bhava)",
                    "Integrating Kriya Wisdom into Daily Family & Work Life",
                    "Grand Culmination, Sankalpa & Master's Blessings"
            };

            LocalDate thirteenth = LocalDate.of(2026, 10, 13);
            LocalDateTime defaultExpires = LocalDateTime.of(thirteenth, LocalTime.of(23, 59, 59));

            for (int i = 0; i < titles.length; i++) {
                int dayNum = i + 1;
                LocalDate releaseDate = LocalDate.of(2026, 10, dayNum + 1);
                LocalDateTime releaseAt = LocalDateTime.of(releaseDate, LocalTime.of(12, 0));

                recordingRepository.save(Recording.builder()
                        .session(session)
                        .dayNumber(dayNum)
                        .title(titles[i])
                        .description("Daily Hanuman Kriya practice guided by Master Gorli Peddi Raju Garu.")
                        .duration((50 + (i % 5)) + " mins")
                        .bunnyVideoId("bunny_sample_vid_" + dayNum)
                        .releaseAt(releaseAt)
                        .defaultExpiresAt(defaultExpires)
                        .build());
            }
        }

        // 8. Seed Sacred Books
        if (bookRepository.findAll().isEmpty()) {
            Book book1 = Book.builder()
                    .title("Tripura Rahasya (The Mystery Beyond Trinity)")
                    .author("Ancient Sacred Text • Commentated by Master Peddi Raju Garu")
                    .description("The pinnacle non-dual text on supreme consciousness, Jnana Yoga, and transcending the three worlds.")
                    .masterCommentarySummary("Master Peddi Raju Garu breaks down Princess Hemalata's discourse to Prince Hemachuda into clear daily contemplations.")
                    .episodesCount(12)
                    .price(new BigDecimal("199.00"))
                    .build();

            book1.getEpisodes().add(BookEpisode.builder()
                    .book(book1)
                    .episodeNumber(1)
                    .title("Discourse 1: The Nature of Unconditioned Consciousness")
                    .duration("28 mins")
                    .audioUrl("https://assets.tripuraspiritual.org/audio/tripura_rahasya_ep1.mp3")
                    .build());

            bookRepository.save(book1);

            Book book2 = Book.builder()
                    .title("Bhagavad Gita: Sthitaprajna Chapter 2 & 6")
                    .author("Vyasa • Master's Direct Audio Radio")
                    .description("The characteristics of an unshakeable mind, detached action, and dhyana yoga mastery.")
                    .masterCommentarySummary("Practical application of Krishna's advice for modern working professionals and householders.")
                    .episodesCount(18)
                    .price(new BigDecimal("199.00"))
                    .build();

            bookRepository.save(book2);
        }

        log.info("Tripura Spiritual RBAC Personas and default database records initialized successfully!");
    }

    private User seedUser(String name, String email, String phone, String password, Role role) {
        return userRepository.findByEmailIgnoreCase(email)
                .or(() -> userRepository.findByPhone(phone))
                .map(existing -> {
                    existing.setName(name);
                    existing.setEmail(email);
                    existing.setPhone(phone);
                    existing.setPassword(passwordEncoder.encode(password));
                    existing.setRole(role.name());
                    return userRepository.save(existing);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .name(name)
                        .email(email)
                        .phone(phone)
                        .password(passwordEncoder.encode(password))
                        .role(role.name())
                        .build()));
    }

    private void ensureEnrollment(User user, Session session) {
        if (enrollmentRepository.findByUserId(user.getId()).isEmpty()) {
            enrollmentRepository.save(Enrollment.builder()
                    .user(user)
                    .session(session)
                    .type(Enrollment.EnrollmentType.LIVE_SESSION)
                    .paidAmount(new BigDecimal("1111.00"))
                    .paidAt(LocalDateTime.now().minusDays(1))
                    .validUntil(LocalDateTime.of(2026, 10, 13, 23, 59, 59))
                    .build());
        }
    }
}

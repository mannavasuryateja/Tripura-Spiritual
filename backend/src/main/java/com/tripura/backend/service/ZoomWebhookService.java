package com.tripura.backend.service;

import com.tripura.backend.model.Recording;
import com.tripura.backend.model.Session;
import com.tripura.backend.repository.RecordingRepository;
import com.tripura.backend.repository.SessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class ZoomWebhookService {

    private static final Logger log = LoggerFactory.getLogger(ZoomWebhookService.class);

    private final SessionRepository sessionRepository;
    private final RecordingRepository recordingRepository;
    private final BunnyStreamService bunnyStreamService;

    public ZoomWebhookService(
            SessionRepository sessionRepository,
            RecordingRepository recordingRepository,
            BunnyStreamService bunnyStreamService) {
        this.sessionRepository = sessionRepository;
        this.recordingRepository = recordingRepository;
        this.bunnyStreamService = bunnyStreamService;
    }

    @Transactional
    public void processZoomRecordingCompleted(String topic, String mp4DownloadUrl, Integer dayNumber) {
        log.info("Processing Zoom Webhook Event [recording.completed]: Topic = {}, Day = {}", topic, dayNumber);

        Session session = sessionRepository.findFirstByActiveTrueOrderByStartDateAsc()
                .orElseThrow(() -> new IllegalStateException("No active session found to associate Zoom recording"));

        String bunnyVideoId = bunnyStreamService.ingestZoomRecording(mp4DownloadUrl, topic);

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDateTime releaseAt = LocalDateTime.of(tomorrow, LocalTime.of(12, 0));

        LocalDate thirteenthDay = LocalDate.of(tomorrow.getYear(), tomorrow.getMonth(), 13);
        LocalDateTime defaultExpiresAt = LocalDateTime.of(thirteenthDay, LocalTime.of(23, 59, 59));

        Recording recording = recordingRepository.findBySessionIdAndDayNumber(session.getId(), dayNumber)
                .orElseGet(() -> Recording.builder()
                        .session(session)
                        .dayNumber(dayNumber)
                        .title(topic)
                        .description("Daily Hanuman Kriya guided live practice recording with Master Gorli Peddi Raju Garu.")
                        .duration("50 mins")
                        .build());

        recording.setBunnyVideoId(bunnyVideoId);
        recording.setReleaseAt(releaseAt);
        recording.setDefaultExpiresAt(defaultExpiresAt);

        recordingRepository.save(recording);

        log.info("Successfully registered automated recording Day {} (Bunny Video ID: {}) with release date: {}",
                dayNumber, bunnyVideoId, releaseAt);
    }
}

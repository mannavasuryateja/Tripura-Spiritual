package com.tripura.backend.service;

import com.tripura.backend.dto.RecordingResponseDto;
import com.tripura.backend.model.Enrollment;
import com.tripura.backend.model.Recording;
import com.tripura.backend.model.UserRecordingAccess;
import com.tripura.backend.repository.EnrollmentRepository;
import com.tripura.backend.repository.RecordingRepository;
import com.tripura.backend.repository.UserRecordingAccessRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RecordingAccessService {

    private final RecordingRepository recordingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRecordingAccessRepository accessRepository;

    public RecordingAccessService(
            RecordingRepository recordingRepository,
            EnrollmentRepository enrollmentRepository,
            UserRecordingAccessRepository accessRepository) {
        this.recordingRepository = recordingRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.accessRepository = accessRepository;
    }

    public List<RecordingResponseDto> getRecordingsForUser(Long userId, Long sessionId) {
        List<Recording> recordings = recordingRepository.findBySessionIdOrderByDayNumberAsc(sessionId);
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);

        boolean isEnrolledInSession = enrollments.stream()
                .anyMatch(e -> e.getSession().getId().equals(sessionId));

        List<UserRecordingAccess> grantedAccessList = accessRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();

        List<RecordingResponseDto> dtos = new ArrayList<>();

        for (Recording rec : recordings) {
            boolean unlocked = false;
            LocalDateTime validUntil = rec.getDefaultExpiresAt();
            String statusMsg = "Requires Active Enrollment";

            if (isEnrolledInSession) {
                Optional<UserRecordingAccess> granted = grantedAccessList.stream()
                        .filter(a -> a.getRecording().getId().equals(rec.getId()))
                        .findFirst();

                if (granted.isPresent()) {
                    validUntil = granted.get().getValidUntil();
                    if (now.isAfter(rec.getReleaseAt()) && now.isBefore(validUntil)) {
                        unlocked = true;
                        statusMsg = "Unlocked (Valid till " + validUntil.toLocalDate() + ")";
                    } else if (now.isAfter(validUntil)) {
                        statusMsg = "Access Expired on " + validUntil.toLocalDate();
                    } else {
                        statusMsg = "Releases at " + rec.getReleaseAt();
                    }
                } else {
                    if (now.isAfter(rec.getReleaseAt()) && now.isBefore(rec.getDefaultExpiresAt())) {
                        unlocked = true;
                        statusMsg = "Unlocked (Available until Oct 13, 12:00 PM)";
                    } else if (now.isAfter(rec.getDefaultExpiresAt())) {
                        statusMsg = "Live access expired on 13th day. Extend for 21 days @ ₹555";
                    } else {
                        statusMsg = "Releases tomorrow 12:00 PM";
                    }
                }
            }

            dtos.add(RecordingResponseDto.builder()
                    .id(rec.getId())
                    .dayNumber(rec.getDayNumber())
                    .title(rec.getTitle())
                    .description(rec.getDescription())
                    .duration(rec.getDuration())
                    .isUnlocked(unlocked)
                    .releaseAt(rec.getReleaseAt())
                    .validUntil(validUntil)
                    .statusMessage(statusMsg)
                    .build());
        }

        return dtos;
    }
}

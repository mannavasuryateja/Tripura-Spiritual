package com.tripura.backend.controller;

import com.tripura.backend.dto.RecordingResponseDto;
import com.tripura.backend.dto.StreamTokenResponseDto;
import com.tripura.backend.model.Recording;
import com.tripura.backend.model.User;
import com.tripura.backend.repository.RecordingRepository;
import com.tripura.backend.service.BunnyStreamService;
import com.tripura.backend.service.RecordingAccessService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recordings")
public class RecordingController {

    private final RecordingAccessService recordingAccessService;
    private final BunnyStreamService bunnyStreamService;
    private final RecordingRepository recordingRepository;

    public RecordingController(
            RecordingAccessService recordingAccessService,
            BunnyStreamService bunnyStreamService,
            RecordingRepository recordingRepository) {
        this.recordingAccessService = recordingAccessService;
        this.bunnyStreamService = bunnyStreamService;
        this.recordingRepository = recordingRepository;
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<RecordingResponseDto>> getSessionRecordings(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal User user) {

        Long userId = (user != null) ? user.getId() : 0L;
        List<RecordingResponseDto> recordings = recordingAccessService.getRecordingsForUser(userId, sessionId);
        return ResponseEntity.ok(recordings);
    }

    @GetMapping("/{recordingId}/stream-token")
    @PreAuthorize("@securityService.hasRecordingAccess(authentication, #recordingId)")
    public ResponseEntity<StreamTokenResponseDto> getSignedStreamToken(
            @PathVariable Long recordingId,
            @AuthenticationPrincipal User user) {

        Recording recording = recordingRepository.findById(recordingId)
                .orElseThrow(() -> new IllegalArgumentException("Recording not found"));

        StreamTokenResponseDto streamToken = bunnyStreamService.generateSecureStreamToken(
                recording.getId(),
                recording.getBunnyVideoId(),
                user.getId()
        );

        return ResponseEntity.ok(streamToken);
    }
}

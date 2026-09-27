package com.tripura.backend.controller;

import com.tripura.backend.model.*;
import com.tripura.backend.repository.*;
import com.tripura.backend.service.AuditLogService;
import com.tripura.backend.service.BookService;
import com.tripura.backend.service.MediaStorageService;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MediaController {

    private final MediaStorageService mediaStorageService;
    private final AuditLogService auditLogService;
    private final MediaAssetRepository mediaAssetRepository;
    private final BookEpisodeRepository episodeRepository;
    private final BookService bookService;
    private final RecordingRepository recordingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final BusinessSettingRepository settingRepository;

    public MediaController(
            MediaStorageService mediaStorageService,
            AuditLogService auditLogService,
            MediaAssetRepository mediaAssetRepository,
            BookEpisodeRepository episodeRepository,
            BookService bookService,
            RecordingRepository recordingRepository,
            EnrollmentRepository enrollmentRepository,
            BusinessSettingRepository settingRepository) {
        this.mediaStorageService = mediaStorageService;
        this.auditLogService = auditLogService;
        this.mediaAssetRepository = mediaAssetRepository;
        this.episodeRepository = episodeRepository;
        this.bookService = bookService;
        this.recordingRepository = recordingRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.settingRepository = settingRepository;
    }

    /**
     * Admin: Upload audio/video/image file
     */
    @PostMapping("/admin/media/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "mediaType", required = false) String mediaType,
            Authentication auth) throws IOException {

        MediaAsset asset = mediaStorageService.uploadFile(file, title, mediaType);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "MEDIA_UPLOADED", "MediaAsset", asset.getId().toString(), "Uploaded " + asset.getFileName());

        return ResponseEntity.ok(asset);
    }

    /**
     * Admin: List all media assets
     */
    @GetMapping("/admin/media")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MediaAsset>> getAllMedia() {
        return ResponseEntity.ok(mediaStorageService.getAllMedia());
    }

    /**
     * Admin: Delete media asset
     */
    @DeleteMapping("/admin/media/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMedia(@PathVariable Long id, Authentication auth) {
        mediaStorageService.deleteMedia(id);
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        auditLogService.logAction(adminEmail, "MEDIA_DELETED", "MediaAsset", id.toString(), "Deleted media ID: " + id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Media asset deleted successfully"));
    }

    /**
     * Stream media file with HTTP 206 Partial Content (Range requests for seeking)
     * Enforces entitlement: images and free episodes/orientations are public;
     * locked episodes and recordings require authentication and active purchase/enrollment.
     */
    @GetMapping("/media/stream/{storageKey:.+}")
    public ResponseEntity<ResourceRegion> streamMedia(
            @PathVariable String storageKey,
            @RequestHeader HttpHeaders headers,
            @AuthenticationPrincipal User user) throws IOException {

        // 1. Check if media asset is an IMAGE (covers, profile pictures, thumbnails are public)
        Optional<MediaAsset> optAsset = mediaAssetRepository.findByStorageKey(storageKey);
        if (optAsset.isPresent() && "IMAGE".equalsIgnoreCase(optAsset.get().getMediaType())) {
            return mediaStorageService.getMediaStreamRegion(storageKey, headers);
        }

        // 2. Check if this is the public orientation video
        String orientationUrl = settingRepository.findByKey("free_orientation_video_url")
                .map(BusinessSetting::getValue).orElse("");
        if (!orientationUrl.isEmpty() && orientationUrl.contains(storageKey)) {
            return mediaStorageService.getMediaStreamRegion(storageKey, headers);
        }

        // 3. Check if media belongs to any BookEpisode
        List<BookEpisode> episodes = episodeRepository.findByAudioUrlContainingOrVideoUrlContaining(storageKey, storageKey);
        if (!episodes.isEmpty()) {
            boolean hasFreeEpisode = episodes.stream().anyMatch(e -> Boolean.TRUE.equals(e.getIsFree()));
            if (hasFreeEpisode) {
                return mediaStorageService.getMediaStreamRegion(storageKey, headers);
            }

            // Locked episode: requires authentication and entitlement
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            if (user.isAdmin()) {
                return mediaStorageService.getMediaStreamRegion(storageKey, headers);
            }

            boolean hasUnlockedBook = episodes.stream().anyMatch(e ->
                    bookService.isBookUnlockedForUser(user.getId(), e.getBook().getId()));
            if (hasUnlockedBook) {
                return mediaStorageService.getMediaStreamRegion(storageKey, headers);
            }

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 4. Check if media belongs to a Recording
        List<Recording> recordings = recordingRepository.findByBunnyVideoId(storageKey);
        if (!recordings.isEmpty()) {
            boolean isDemoPreview = recordings.stream().anyMatch(r -> r.getDayNumber() != null && r.getDayNumber() <= 2);
            if (isDemoPreview) {
                return mediaStorageService.getMediaStreamRegion(storageKey, headers);
            }

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            if (user.isAdmin()) {
                return mediaStorageService.getMediaStreamRegion(storageKey, headers);
            }

            LocalDateTime now = LocalDateTime.now();
            List<Enrollment> enrollments = enrollmentRepository.findByUserId(user.getId());
            boolean hasActiveSession = recordings.stream().anyMatch(r ->
                    enrollments.stream().anyMatch(e ->
                            e.getSession().getId().equals(r.getSession().getId()) &&
                            (e.getValidUntil() == null || e.getValidUntil().isAfter(now))
                    )
            );
            if (hasActiveSession) {
                return mediaStorageService.getMediaStreamRegion(storageKey, headers);
            }

            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 5. Unassigned media: only accessible by Admin
        if (user != null && user.isAdmin()) {
            return mediaStorageService.getMediaStreamRegion(storageKey, headers);
        }

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}

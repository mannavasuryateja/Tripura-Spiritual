package com.tripura.backend.service;

import com.tripura.backend.model.MediaAsset;
import com.tripura.backend.repository.MediaAssetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class MediaStorageService {

    private static final Logger log = LoggerFactory.getLogger(MediaStorageService.class);
    private static final String UPLOAD_DIR = "uploads";
    private final MediaAssetRepository mediaAssetRepository;

    public MediaStorageService(MediaAssetRepository mediaAssetRepository) {
        this.mediaAssetRepository = mediaAssetRepository;
        initUploadDir();
    }

    private void initUploadDir() {
        try {
            Path path = Paths.get(UPLOAD_DIR);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (IOException e) {
            log.error("Could not initialize upload directory: ", e);
        }
    }

    public MediaAsset uploadFile(MultipartFile file, String title, String customMediaType) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename with path traversal attempt");
        }

        String mimeType = file.getContentType();
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }

        // Validate MIME type
        String detectedType = "DOCUMENT";
        if (mimeType.startsWith("audio/")) {
            detectedType = "AUDIO";
        } else if (mimeType.startsWith("video/")) {
            detectedType = "VIDEO";
        } else if (mimeType.startsWith("image/")) {
            detectedType = "IMAGE";
        }

        if (customMediaType != null && !customMediaType.isBlank()) {
            detectedType = customMediaType.toUpperCase();
        }

        // Generate safe unique storage key
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }
        String storageKey = UUID.randomUUID().toString() + extension;

        Path targetPath = Paths.get(UPLOAD_DIR).resolve(storageKey);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        MediaAsset asset = new MediaAsset();
        asset.setTitle(title != null && !title.isBlank() ? title : originalFilename);
        asset.setFileName(originalFilename);
        asset.setStorageKey(storageKey);
        asset.setMediaType(detectedType);
        asset.setMimeType(mimeType);
        asset.setFileSize(file.getSize());
        asset.setStatus("READY");
        asset.setPublicUrl("/api/media/stream/" + storageKey);

        return mediaAssetRepository.save(asset);
    }

    public List<MediaAsset> getAllMedia() {
        return mediaAssetRepository.findAllByOrderByCreatedAtDesc();
    }

    public MediaAsset getMediaByStorageKey(String storageKey) {
        return mediaAssetRepository.findByStorageKey(storageKey)
                .orElseThrow(() -> new IllegalArgumentException("Media not found with key: " + storageKey));
    }

    public void deleteMedia(Long id) {
        MediaAsset asset = mediaAssetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Media not found with ID: " + id));

        Path path = Paths.get(UPLOAD_DIR).resolve(asset.getStorageKey());
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Could not delete physical file: {}", path, e);
        }
        mediaAssetRepository.delete(asset);
    }

    /**
     * Range streaming support for HTML5 Audio & Video players (HTTP 206 Partial Content)
     */
    public ResponseEntity<ResourceRegion> getMediaStreamRegion(String storageKey, HttpHeaders headers) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(storageKey);
        File file = filePath.toFile();
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        long contentLength = resource.contentLength();
        HttpRange range = headers.getRange().isEmpty() ? null : headers.getRange().get(0);

        String mimeType = Files.probeContentType(filePath);
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }

        if (range != null) {
            long start = range.getRangeStart(contentLength);
            long end = range.getRangeEnd(contentLength);
            long rangeLength = Math.min(1024 * 1024L, end - start + 1); // 1MB chunks
            ResourceRegion region = new ResourceRegion(resource, start, rangeLength);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(MediaType.parseMediaType(mimeType))
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(region);
        } else {
            long rangeLength = Math.min(1024 * 1024L, contentLength);
            ResourceRegion region = new ResourceRegion(resource, 0, rangeLength);
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.parseMediaType(mimeType))
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(region);
        }
    }
}

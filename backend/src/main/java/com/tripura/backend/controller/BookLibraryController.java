package com.tripura.backend.controller;

import com.tripura.backend.dto.BookEpisodeDto;
import com.tripura.backend.model.Book;
import com.tripura.backend.model.BookEpisode;
import com.tripura.backend.model.User;
import com.tripura.backend.security.JwtTokenProvider;
import com.tripura.backend.service.BookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookLibraryController {

    private final BookService bookService;
    private final JwtTokenProvider tokenProvider;

    public BookLibraryController(BookService bookService, JwtTokenProvider tokenProvider) {
        this.bookService = bookService;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Public: List all published books
     */
    @GetMapping("/books")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllPublishedBooks());
    }

    /**
     * Public: Get book by ID or slug
     */
    @GetMapping("/books/{idOrSlug}")
    public ResponseEntity<Book> getBook(@PathVariable String idOrSlug) {
        try {
            Long id = Long.parseLong(idOrSlug);
            return ResponseEntity.ok(bookService.getBookById(id));
        } catch (NumberFormatException e) {
            return bookService.getBookBySlug(idOrSlug)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
    }

    /**
     * Public: Get episodes for a book.
     * Sanitizes media URLs: only returns audioUrl/videoUrl if episode is free or user has purchased the book.
     */
    @GetMapping("/books/{bookId}/episodes")
    public ResponseEntity<List<BookEpisodeDto>> getEpisodes(
            @PathVariable Long bookId,
            @AuthenticationPrincipal User user) {

        List<BookEpisode> rawEpisodes = bookService.getEpisodes(bookId, false);
        boolean bookUnlocked = user != null && (user.isAdmin() || bookService.isBookUnlockedForUser(user.getId(), bookId));

        List<BookEpisodeDto> dtos = rawEpisodes.stream().map(ep -> {
            BookEpisodeDto dto = new BookEpisodeDto();
            dto.setId(ep.getId());
            dto.setBookId(bookId);
            dto.setEpisodeNumber(ep.getEpisodeNumber());
            dto.setTitle(ep.getTitle());
            dto.setDescription(ep.getDescription());
            dto.setDuration(ep.getDuration());
            dto.setDurationSeconds(ep.getDurationSeconds());
            dto.setMediaType(ep.getMediaType());
            dto.setThumbnailUrl(ep.getThumbnailUrl());
            dto.setIsFree(ep.getIsFree());
            dto.setIsPublished(ep.getIsPublished());
            dto.setSortOrder(ep.getSortOrder());
            dto.setCreatedAt(ep.getCreatedAt());

            boolean isEpUnlocked = Boolean.TRUE.equals(ep.getIsFree()) || bookUnlocked;
            dto.setIsUnlocked(isEpUnlocked);

            // Never leak locked audio/video URLs in public listing
            if (isEpUnlocked) {
                dto.setAudioUrl(ep.getAudioUrl());
                dto.setVideoUrl(ep.getVideoUrl());
            } else {
                dto.setAudioUrl(null);
                dto.setVideoUrl(null);
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * User: Get IDs of unlocked books for authenticated user
     */
    @GetMapping("/books/my-unlocked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Long>> getMyUnlockedBookIds(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookService.getUnlockedBookIdsForUser(user.getId()));
    }

    /**
     * User/Seeker: Request playback for an episode.
     * Verifies if episode is free preview OR user has purchased access.
     * Generates signed streaming token for protected server media.
     */
    @GetMapping("/books/{bookId}/episodes/{episodeId}/play")
    public ResponseEntity<?> playEpisode(
            @PathVariable Long bookId,
            @PathVariable Long episodeId,
            @AuthenticationPrincipal User user) {

        BookEpisode episode = bookService.getEpisodes(bookId, true).stream()
                .filter(e -> e.getId().equals(episodeId))
                .findFirst()
                .orElse(null);

        if (episode == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Episode not found", "code", "EPISODE_NOT_FOUND"));
        }

        boolean isFree = Boolean.TRUE.equals(episode.getIsFree());
        boolean hasPurchased = user != null && bookService.isBookUnlockedForUser(user.getId(), bookId);

        if (!isFree && !hasPurchased) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "success", false,
                            "code", "CONTENT_LOCKED",
                            "message", "This episode is locked. Please purchase access to listen to the full discourse.",
                            "previewAllowed", true,
                            "previewDurationSeconds", 300
                    ));
        }

        String rawStreamUrl = episode.getAudioUrl() != null && !episode.getAudioUrl().isBlank()
                ? episode.getAudioUrl()
                : (episode.getVideoUrl() != null ? episode.getVideoUrl() : "");

        String streamUrl = rawStreamUrl;
        if (streamUrl.startsWith("/api/media/stream/") && user != null) {
            String token = tokenProvider.generateToken(
                    user.getId(),
                    user.getPhone() != null ? user.getPhone() : (user.getEmail() != null ? user.getEmail() : "user"),
                    user.getRole()
            );
            streamUrl = streamUrl + (streamUrl.contains("?") ? "&" : "?") + "token=" + token;
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "episodeId", episode.getId(),
                "title", episode.getTitle(),
                "duration", episode.getDuration() != null ? episode.getDuration() : "",
                "mediaType", episode.getMediaType() != null ? episode.getMediaType() : "AUDIO",
                "streamUrl", streamUrl,
                "audioUrl", streamUrl,
                "videoUrl", episode.getVideoUrl() != null ? streamUrl : "",
                "isUnlocked", true
        ));
    }

    // ==========================================
    // ADMIN CMS OPERATIONS
    // ==========================================

    @GetMapping("/admin/books")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Book>> getAllBooksForAdmin() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @PostMapping("/admin/books")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> createBook(@RequestBody Book book, Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        return ResponseEntity.ok(bookService.createBook(book, adminEmail));
    }

    @PutMapping("/admin/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book, Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        return ResponseEntity.ok(bookService.updateBook(id, book, adminEmail));
    }

    @DeleteMapping("/admin/books/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBook(@PathVariable Long id, Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        bookService.deleteBook(id, adminEmail);
        return ResponseEntity.ok(Map.of("success", true, "message", "Book deleted successfully"));
    }

    @GetMapping("/admin/books/{bookId}/episodes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookEpisode>> getAdminEpisodes(@PathVariable Long bookId) {
        return ResponseEntity.ok(bookService.getEpisodes(bookId, true));
    }

    @PostMapping("/admin/books/{bookId}/episodes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookEpisode> createEpisode(
            @PathVariable Long bookId,
            @RequestBody BookEpisode episode,
            Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        return ResponseEntity.ok(bookService.createEpisode(bookId, episode, adminEmail));
    }

    @PutMapping("/admin/episodes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookEpisode> updateEpisode(
            @PathVariable Long id,
            @RequestBody BookEpisode episode,
            Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        return ResponseEntity.ok(bookService.updateEpisode(id, episode, adminEmail));
    }

    @DeleteMapping("/admin/episodes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEpisode(@PathVariable Long id, Authentication auth) {
        String adminEmail = auth != null ? auth.getName() : "admin@tripura.org";
        bookService.deleteEpisode(id, adminEmail);
        return ResponseEntity.ok(Map.of("success", true, "message", "Episode deleted successfully"));
    }
}

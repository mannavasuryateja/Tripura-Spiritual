package com.tripura.backend.service;

import com.tripura.backend.model.Book;
import com.tripura.backend.model.BookEpisode;
import com.tripura.backend.model.User;
import com.tripura.backend.model.UserBookAccess;
import com.tripura.backend.repository.BookEpisodeRepository;
import com.tripura.backend.repository.BookRepository;
import com.tripura.backend.repository.UserBookAccessRepository;
import com.tripura.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BookEpisodeRepository episodeRepository;
    private final UserBookAccessRepository userBookAccessRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public BookService(
            BookRepository bookRepository,
            BookEpisodeRepository episodeRepository,
            UserBookAccessRepository userBookAccessRepository,
            UserRepository userRepository,
            AuditLogService auditLogService) {
        this.bookRepository = bookRepository;
        this.episodeRepository = episodeRepository;
        this.userBookAccessRepository = userBookAccessRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    public List<Book> getAllPublishedBooks() {
        return bookRepository.findByIsPublishedTrueOrderBySortOrderAscIdAsc();
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAllByOrderBySortOrderAscIdAsc();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with ID: " + id));
    }

    public Optional<Book> getBookBySlug(String slug) {
        return bookRepository.findBySlug(slug);
    }

    public List<BookEpisode> getEpisodes(Long bookId, boolean includeUnpublished) {
        if (includeUnpublished) {
            return episodeRepository.findByBookIdOrderBySortOrderAscEpisodeNumberAsc(bookId);
        }
        return episodeRepository.findByBookIdAndIsPublishedTrueOrderBySortOrderAscEpisodeNumberAsc(bookId);
    }

    @Transactional
    public Book createBook(Book book, String adminEmail) {
        if (book.getSlug() == null || book.getSlug().isBlank()) {
            book.setSlug(book.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", ""));
        }
        Book saved = bookRepository.save(book);
        auditLogService.logAction(adminEmail, "BOOK_CREATED", "Book", saved.getId().toString(), "Created book: " + saved.getTitle());
        return saved;
    }

    @Transactional
    public Book updateBook(Long id, Book details, String adminEmail) {
        Book existing = getBookById(id);
        existing.setTitle(details.getTitle());
        if (details.getTeluguTitle() != null) existing.setTeluguTitle(details.getTeluguTitle());
        if (details.getAuthor() != null) existing.setAuthor(details.getAuthor());
        if (details.getTag() != null) existing.setTag(details.getTag());
        if (details.getDescription() != null) existing.setDescription(details.getDescription());
        if (details.getSynopsis() != null) existing.setSynopsis(details.getSynopsis());
        if (details.getSummaryStory() != null) existing.setSummaryStory(details.getSummaryStory());
        if (details.getProblemStatement() != null) existing.setProblemStatement(details.getProblemStatement());
        if (details.getMasterQuote() != null) existing.setMasterQuote(details.getMasterQuote());
        if (details.getCoverImage() != null) existing.setCoverImage(details.getCoverImage());
        if (details.getPrice() != null) existing.setPrice(details.getPrice());
        if (details.getPreviewDurationMinutes() != null) existing.setPreviewDurationMinutes(details.getPreviewDurationMinutes());
        if (details.getIsPublished() != null) existing.setIsPublished(details.getIsPublished());
        if (details.getSortOrder() != null) existing.setSortOrder(details.getSortOrder());

        Book updated = bookRepository.save(existing);
        auditLogService.logAction(adminEmail, "BOOK_UPDATED", "Book", id.toString(), "Updated book: " + updated.getTitle());
        return updated;
    }

    @Transactional
    public void deleteBook(Long id, String adminEmail) {
        Book book = getBookById(id);
        bookRepository.delete(book);
        auditLogService.logAction(adminEmail, "BOOK_DELETED", "Book", id.toString(), "Deleted book: " + book.getTitle());
    }

    @Transactional
    public BookEpisode createEpisode(Long bookId, BookEpisode episode, String adminEmail) {
        Book book = getBookById(bookId);
        episode.setBook(book);
        if (episode.getEpisodeNumber() == null) {
            episode.setEpisodeNumber(book.getEpisodes().size() + 1);
        }
        BookEpisode saved = episodeRepository.save(episode);
        book.setEpisodesCount(book.getEpisodesCount() + 1);
        bookRepository.save(book);

        auditLogService.logAction(adminEmail, "EPISODE_CREATED", "BookEpisode", saved.getId().toString(), "Added episode " + saved.getTitle() + " to book ID " + bookId);
        return saved;
    }

    @Transactional
    public BookEpisode updateEpisode(Long episodeId, BookEpisode details, String adminEmail) {
        BookEpisode existing = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new IllegalArgumentException("Episode not found with ID: " + episodeId));

        if (details.getTitle() != null) existing.setTitle(details.getTitle());
        if (details.getDescription() != null) existing.setDescription(details.getDescription());
        if (details.getDuration() != null) existing.setDuration(details.getDuration());
        if (details.getDurationSeconds() != null) existing.setDurationSeconds(details.getDurationSeconds());
        if (details.getMediaType() != null) existing.setMediaType(details.getMediaType());
        if (details.getAudioUrl() != null) existing.setAudioUrl(details.getAudioUrl());
        if (details.getVideoUrl() != null) existing.setVideoUrl(details.getVideoUrl());
        if (details.getThumbnailUrl() != null) existing.setThumbnailUrl(details.getThumbnailUrl());
        if (details.getIsFree() != null) existing.setIsFree(details.getIsFree());
        if (details.getIsPublished() != null) existing.setIsPublished(details.getIsPublished());
        if (details.getSortOrder() != null) existing.setSortOrder(details.getSortOrder());
        if (details.getEpisodeNumber() != null) existing.setEpisodeNumber(details.getEpisodeNumber());

        BookEpisode updated = episodeRepository.save(existing);
        auditLogService.logAction(adminEmail, "EPISODE_UPDATED", "BookEpisode", episodeId.toString(), "Updated episode: " + updated.getTitle());
        return updated;
    }

    @Transactional
    public void deleteEpisode(Long episodeId, String adminEmail) {
        BookEpisode episode = episodeRepository.findById(episodeId)
                .orElseThrow(() -> new IllegalArgumentException("Episode not found with ID: " + episodeId));
        Book book = episode.getBook();
        episodeRepository.delete(episode);
        if (book != null && book.getEpisodesCount() > 0) {
            book.setEpisodesCount(book.getEpisodesCount() - 1);
            bookRepository.save(book);
        }
        auditLogService.logAction(adminEmail, "EPISODE_DELETED", "BookEpisode", episodeId.toString(), "Deleted episode ID: " + episodeId);
    }

    public boolean isBookUnlockedForUser(Long userId, Long bookId) {
        if (userId == null || userId <= 0) return false;
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && user.isAdmin()) return true;
        return userBookAccessRepository.existsByUserIdAndBookId(userId, bookId);
    }

    @Transactional
    public void grantBookAccess(Long userId, Long bookId, Long paymentId) {
        if (userBookAccessRepository.existsByUserIdAndBookId(userId, bookId)) return;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Book book = getBookById(bookId);
        UserBookAccess access = new UserBookAccess(user, book, paymentId);
        userBookAccessRepository.save(access);
    }

    public List<Long> getUnlockedBookIdsForUser(Long userId) {
        if (userId == null || userId <= 0) return List.of();
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && user.isAdmin()) {
            return bookRepository.findAll().stream().map(Book::getId).toList();
        }
        return userBookAccessRepository.findByUserId(userId).stream()
                .map(a -> a.getBook().getId())
                .toList();
    }
}

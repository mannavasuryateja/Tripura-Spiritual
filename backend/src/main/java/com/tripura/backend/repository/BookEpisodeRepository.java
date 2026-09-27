package com.tripura.backend.repository;

import com.tripura.backend.model.BookEpisode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookEpisodeRepository extends JpaRepository<BookEpisode, Long> {
    List<BookEpisode> findByBookIdOrderBySortOrderAscEpisodeNumberAsc(Long bookId);
    List<BookEpisode> findByBookIdAndIsPublishedTrueOrderBySortOrderAscEpisodeNumberAsc(Long bookId);
    List<BookEpisode> findByAudioUrlContainingOrVideoUrlContaining(String audioKey, String videoKey);
}

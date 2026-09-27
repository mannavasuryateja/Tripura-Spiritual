package com.tripura.backend.repository;

import com.tripura.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findBySlug(String slug);
    List<Book> findByIsPublishedTrueOrderBySortOrderAscIdAsc();
    List<Book> findAllByOrderBySortOrderAscIdAsc();
}

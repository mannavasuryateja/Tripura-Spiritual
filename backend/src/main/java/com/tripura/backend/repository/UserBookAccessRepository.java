package com.tripura.backend.repository;

import com.tripura.backend.model.UserBookAccess;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookAccessRepository extends JpaRepository<UserBookAccess, Long> {
    Optional<UserBookAccess> findByUserIdAndBookId(Long userId, Long bookId);
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
    List<UserBookAccess> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserBookAccess uba WHERE uba.book.id = :bookId")
    void deleteByBookId(@Param("bookId") Long bookId);
}

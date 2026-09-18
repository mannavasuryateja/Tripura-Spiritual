package com.tripura.backend.repository;

import com.tripura.backend.model.MentorBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorBookingRepository extends JpaRepository<MentorBooking, Long> {
    List<MentorBooking> findByUserId(Long userId);
}

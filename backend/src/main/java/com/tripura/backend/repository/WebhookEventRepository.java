package com.tripura.backend.repository;

import com.tripura.backend.model.WebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {
    Optional<WebhookEvent> findByProviderAndEventId(String provider, String eventId);
    boolean existsByProviderAndEventId(String provider, String eventId);
}

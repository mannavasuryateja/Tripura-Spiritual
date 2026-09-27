package com.tripura.backend.repository;

import com.tripura.backend.model.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    Optional<MediaAsset> findByStorageKey(String storageKey);
    List<MediaAsset> findByMediaTypeOrderByCreatedAtDesc(String mediaType);
    List<MediaAsset> findAllByOrderByCreatedAtDesc();
}

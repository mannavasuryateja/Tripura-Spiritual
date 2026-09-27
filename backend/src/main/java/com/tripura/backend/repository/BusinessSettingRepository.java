package com.tripura.backend.repository;

import com.tripura.backend.model.BusinessSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessSettingRepository extends JpaRepository<BusinessSetting, String> {
    Optional<BusinessSetting> findByKey(String key);
}

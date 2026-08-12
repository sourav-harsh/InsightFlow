package com.souravio.InsightFlow.analytics_worker.analytics.repository;

import com.souravio.InsightFlow.analytics_worker.analytics.entity.AnalyticsResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AnalyticsResultRepository extends JpaRepository<AnalyticsResult, UUID> {
    Optional<AnalyticsResult> findByDatasetId(UUID datasetId);
}

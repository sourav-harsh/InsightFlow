package com.souravio.InsightFlow.analytics_worker.dataset.repository;

import com.souravio.InsightFlow.analytics_worker.dataset.entity.ProcessedEvent;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, UUID> {

    @Modifying
    @Query(value = """
    INSERT INTO processed_events
        (event_id, job_id, attempt, processed_at)
    VALUES
        (:eventId, :jobId, :attempt, :processedAt)
    ON CONFLICT (event_id) DO NOTHING
    """, nativeQuery = true)
    int insertIfNotExists(
            @Param("eventId") UUID eventId,
            @Param("jobId") UUID jobId,
            @Param("attempt") int attempt,
            @Param("processedAt") Instant processedAt
    );
}

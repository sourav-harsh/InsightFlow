package com.souravio.InsightFlow.analytics_worker.repository;

import com.souravio.InsightFlow.analytics_worker.entity.ProcessedEvent;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, UUID> {
    boolean existsByEventId(UUID eventId);
}

package com.souravio.InsightFlow.dataset_service.repository;

import com.souravio.InsightFlow.dataset_service.entity.OutboxEvent;
import com.souravio.InsightFlow.dataset_service.enums.OutboxStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OutboxEventRepository
        extends JpaRepository<OutboxEvent, UUID> {

    List<OutboxEvent> findTop50ByStatusOrderByCreatedAtAsc(
            OutboxStatus status
    );
}

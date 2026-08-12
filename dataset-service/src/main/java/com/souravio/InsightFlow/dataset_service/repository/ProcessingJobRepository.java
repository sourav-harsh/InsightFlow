package com.souravio.InsightFlow.dataset_service.repository;

import com.souravio.InsightFlow.dataset_service.entity.ProcessingJob;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessingJobRepository extends JpaRepository<ProcessingJob, UUID> {
    List<ProcessingJob> findAllByUserId(UUID userId);
}

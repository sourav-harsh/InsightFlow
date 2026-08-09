package com.souravio.InsightFlow.analytics_worker.repository;

import com.souravio.InsightFlow.analytics_worker.entity.ProcessingJob;
import com.souravio.InsightFlow.analytics_worker.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

public interface ProcessingJobRepository extends JpaRepository<ProcessingJob, UUID> {

    @Modifying
    @Query("""
    UPDATE ProcessingJob j
    SET j.status = :processingStatus,
        j.startedAt = :startedAt
    WHERE j.id = :jobId
      AND j.status = :pendingStatus
""")
    int markProcessingIfPending(
            @Param("jobId") UUID jobId,
            @Param("pendingStatus") JobStatus pendingStatus,
            @Param("processingStatus") JobStatus processingStatus,
            @Param("startedAt") Instant startedAt
    );
}

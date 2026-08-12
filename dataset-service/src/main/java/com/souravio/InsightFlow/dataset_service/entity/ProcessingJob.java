package com.souravio.InsightFlow.dataset_service.entity;

import com.souravio.InsightFlow.dataset_service.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "processing_jobs",
        indexes = {
                @Index(name = "idx_job_dataset_id", columnList = "dataset_id"),
                @Index(name = "idx_job_status", columnList = "status"),
                @Index(name = "idx_job_user_id", columnList = "user_id")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessingJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "dataset_id", nullable = false)
    private UUID datasetId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @Column(name = "retry_count", nullable = false)
    private Integer retryCount;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    private Instant failedAt;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(nullable = false)
    private Instant createdAt;
}

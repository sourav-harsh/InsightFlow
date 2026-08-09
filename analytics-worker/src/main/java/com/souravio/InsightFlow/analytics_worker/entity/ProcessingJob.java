package com.souravio.InsightFlow.analytics_worker.entity;

import com.souravio.InsightFlow.analytics_worker.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "processing_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessingJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID datasetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    private Instant startedAt;

    private Instant completedAt;

    private Instant failedAt;

    private String errorMessage;

    @Column(nullable = false)
    private Integer retryCount;

    @Column(nullable = false)
    @CreationTimestamp
    private Instant createdAt;
}

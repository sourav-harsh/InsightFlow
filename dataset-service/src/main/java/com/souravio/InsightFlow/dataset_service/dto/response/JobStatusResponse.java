package com.souravio.InsightFlow.dataset_service.dto.response;

import com.souravio.InsightFlow.dataset_service.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobStatusResponse {

    private UUID jobId;

    private UUID datasetId;

    private JobStatus status;

    private Integer retryCount;

    private Instant startedAt;

    private Instant completedAt;

    private Instant failedAt;

    private String errorMessage;

    private Instant createdAt;
}

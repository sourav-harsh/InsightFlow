package com.souravio.InsightFlow.dataset_service.dto.response;

import com.souravio.InsightFlow.dataset_service.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProcessingJobResponse {
    private UUID id;
    private UUID datasetId;
    private String fileName;
    private JobStatus status;
    private Instant startedAt;
    private Instant completedAt;
    private Instant failedAt;
    private String errorMessage;

}

package com.souravio.InsightFlow.analytics_worker.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatasetProcessingRequestedEvent {

    private UUID eventId;

    private UUID datasetId;

    private UUID jobId;

    private String storagePath;

    private String fileType;

    private Integer retryCount;

    private Integer attempt;
}

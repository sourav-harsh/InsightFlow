package com.souravio.InsightFlow.analytics_worker.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatasetCleaningCompletedEvent {

    private UUID eventId;

    private UUID datasetId;

    private UUID jobId;

    private String originalStoragePath;

    private String cleanedStoragePath;

    private Long originalRowCount;

    private Long cleanedRowCount;

    private Long removedRowCount;
}

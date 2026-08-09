package com.souravio.InsightFlow.dataset_service.dto.event;

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
}

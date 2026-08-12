package com.souravio.InsightFlow.dataset_service.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class UploadDatasetResponse {

    private UUID datasetId;

    private UUID jobId;

    private String filename;

    private String status;

    private Long totalRows;

    private Integer totalColumns;
}

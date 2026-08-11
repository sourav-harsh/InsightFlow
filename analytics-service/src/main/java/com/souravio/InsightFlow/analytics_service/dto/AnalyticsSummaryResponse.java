package com.souravio.InsightFlow.dataset_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {

    private UUID datasetId;

    private Long rowCount;

    private Integer columnCount;

    private Long missingValueCount;

    private Double qualityScore;

    private Map<String, Long> columnTypeDistribution;

    private Long healthyColumns;

    private Long problematicColumns;
}

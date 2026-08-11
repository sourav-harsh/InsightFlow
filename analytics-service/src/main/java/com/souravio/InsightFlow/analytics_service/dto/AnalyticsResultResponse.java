package com.souravio.InsightFlow.analytics_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResultResponse {

    private UUID datasetId;

    private Long rowCount;

    private Integer columnCount;

    private Long missingValueCount;

    private Double qualityScore;

    private Map<String, ColumnAnalytics> statistics;

    private LocalDateTime createdAt;
}

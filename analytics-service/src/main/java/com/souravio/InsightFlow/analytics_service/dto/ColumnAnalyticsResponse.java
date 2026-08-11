package com.souravio.InsightFlow.analytics_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColumnAnalyticsResponse {

    private String columnName;

    private String type;

    private Long missingCount;

    private Long invalidCount;

    private Double qualityScore;

    private Double min;

    private Double max;

    private Double average;
}

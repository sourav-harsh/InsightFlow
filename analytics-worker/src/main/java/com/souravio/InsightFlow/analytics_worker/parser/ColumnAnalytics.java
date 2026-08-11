package com.souravio.InsightFlow.analytics_worker.parser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColumnAnalytics {

    private String type;

    private long missingCount;

    private long invalidCount;

    private Double qualityScore;

    private Double min;

    private Double max;

    private Double average;
}

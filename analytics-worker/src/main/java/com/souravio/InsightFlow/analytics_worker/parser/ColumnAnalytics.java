package com.souravio.InsightFlow.analytics_worker.parser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColumnAnalytics {

    private String type;

    private long missingCount;

    private Double min;

    private Double max;

    private Double average;
}

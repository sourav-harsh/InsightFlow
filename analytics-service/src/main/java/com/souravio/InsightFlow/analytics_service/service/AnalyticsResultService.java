package com.souravio.InsightFlow.analytics_service.service;


import com.souravio.InsightFlow.analytics_service.dto.AnalyticsResultResponse;
import com.souravio.InsightFlow.analytics_service.dto.ColumnAnalytics;
import com.souravio.InsightFlow.analytics_service.dto.ColumnAnalyticsResponse;
import com.souravio.InsightFlow.analytics_service.entity.AnalyticsResult;
import com.souravio.InsightFlow.analytics_service.exception.AnalyticsNotFoundException;
import com.souravio.InsightFlow.analytics_service.repository.AnalyticsResultRepository;
import com.souravio.InsightFlow.dataset_service.dto.response.AnalyticsSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsResultService {

    private final AnalyticsResultRepository analyticsResultRepository;

    public AnalyticsResultResponse getAnalytics(UUID datasetId) {

        AnalyticsResult result = analyticsResultRepository
                .findByDatasetId(datasetId)
                .orElseThrow(() ->
                        new AnalyticsNotFoundException(
                                "Analytics not found for dataset: " + datasetId
                        )
                );

        return AnalyticsResultResponse.builder()
                .datasetId(result.getDatasetId())
                .rowCount(result.getRowCount())
                .columnCount(result.getColumnCount())
                .invalidValueCount(result.getInvalidValueCount())
                .missingValueCount(result.getMissingValueCount())
                .qualityScore(result.getQualityScore())
                .statistics(result.getStatistics())
                .createdAt(result.getCreatedAt())
                .build();
    }

    public AnalyticsSummaryResponse getAnalyticsSummary(UUID datasetId) {

        AnalyticsResult result = analyticsResultRepository
                .findByDatasetId(datasetId)
                .orElseThrow(() ->
                        new AnalyticsNotFoundException(
                                "Analytics not found for dataset: " + datasetId
                        )
                );

        Map<String, Long> typeDistribution =
                result.getStatistics()
                        .values()
                        .stream()
                        .collect(Collectors.groupingBy(
                                ColumnAnalytics::getType,
                                Collectors.counting()
                        ));

        long healthyColumns =
                result.getStatistics()
                        .values()
                        .stream()
                        .filter(column -> column.getQualityScore() != null)
                        .filter(column -> column.getQualityScore() >= 80.0)
                        .count();

        long problematicColumns =
                result.getStatistics().size() - healthyColumns;

        return AnalyticsSummaryResponse.builder()
                .datasetId(result.getDatasetId())
                .rowCount(result.getRowCount())
                .columnCount(result.getColumnCount())
                .missingValueCount(result.getMissingValueCount())
                .qualityScore(result.getQualityScore())
                .columnTypeDistribution(typeDistribution)
                .healthyColumns(healthyColumns)
                .problematicColumns(problematicColumns)
                .build();
    }


    public ColumnAnalyticsResponse getColumnAnalytics(
            UUID datasetId,
            String columnName
    ) {

    AnalyticsResult result =
        analyticsResultRepository
            .findByDatasetId(datasetId)
            .orElseThrow(
                () ->
                    new AnalyticsNotFoundException(
                        "Analytics not found for dataset: " + datasetId));

        ColumnAnalytics columnAnalytics =
                result.getStatistics().get(columnName);

        if (columnAnalytics == null) {
            throw new AnalyticsNotFoundException(
                    "Analytics not found for column: " + columnName
            );
        }

        return ColumnAnalyticsResponse.builder()
                .columnName(columnName)
                .type(columnAnalytics.getType())
                .missingCount(columnAnalytics.getMissingCount())
                .invalidCount(columnAnalytics.getInvalidCount())
                .qualityScore(columnAnalytics.getQualityScore())
                .min(columnAnalytics.getMin())
                .max(columnAnalytics.getMax())
                .average(columnAnalytics.getAverage())
                .build();
    }
}

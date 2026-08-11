package com.souravio.InsightFlow.analytics_service.service;


import com.souravio.InsightFlow.analytics_service.dto.AnalyticsResultResponse;
import com.souravio.InsightFlow.analytics_service.entity.AnalyticsResult;
import com.souravio.InsightFlow.analytics_service.exception.AnalyticsNotFoundException;
import com.souravio.InsightFlow.analytics_service.repository.AnalyticsResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

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
}

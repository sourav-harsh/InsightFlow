package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.entity.AnalyticsResult;
import com.souravio.InsightFlow.analytics_worker.parser.CsvParseResult;
import com.souravio.InsightFlow.analytics_worker.repository.AnalyticsResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsResultService {

    private final AnalyticsResultRepository analyticsResultRepository;

    @Transactional
    public AnalyticsResult saveResult(
            UUID datasetId,
            CsvParseResult parseResult
    ) {

        AnalyticsResult result = AnalyticsResult.builder()
                .datasetId(datasetId)
                .rowCount(parseResult.getRowCount())
                .columnCount(parseResult.getColumnCount())
                .missingValueCount(parseResult.getMissingValueCount())
                .createdAt(LocalDateTime.now())
                .build();

        return analyticsResultRepository.save(result);
    }

    @Transactional(readOnly = true)
    public AnalyticsResult getByDatasetId(UUID datasetId) {

        return analyticsResultRepository
                .findByDatasetId(datasetId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Analytics result not found for dataset: "
                                        + datasetId
                        )
                );
    }
}

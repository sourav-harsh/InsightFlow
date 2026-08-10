package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.entity.AnalyticsResult;
import com.souravio.InsightFlow.analytics_worker.parser.CsvParseResult;
import com.souravio.InsightFlow.analytics_worker.repository.AnalyticsResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsResultService {

    private final AnalyticsResultRepository analyticsResultRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public AnalyticsResult saveResult(
            UUID datasetId,
            CsvParseResult parseResult
    ) {

        try {

            String statisticsJson =
                    objectMapper.writeValueAsString(parseResult);

            AnalyticsResult result = AnalyticsResult.builder()
                    .datasetId(datasetId)
                    .rowCount(parseResult.getRowCount())
                    .columnCount(parseResult.getColumnCount())
                    .missingValueCount(parseResult.getMissingValueCount())
                    .statisticsJson(parseResult.getColumns())
                    .createdAt(LocalDateTime.now())
                    .build();

            return analyticsResultRepository.save(result);

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to serialize analytics result",
                    exception
            );
        }
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

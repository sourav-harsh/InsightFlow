package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.entity.AnalyticsResult;
import com.souravio.InsightFlow.analytics_worker.parser.CsvParseResult;
import com.souravio.InsightFlow.analytics_worker.repository.AnalyticsResultRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnalyticsResultService {

  private final AnalyticsResultRepository analyticsResultRepository;

  @Transactional
  public AnalyticsResult saveResult(UUID datasetId, CsvParseResult parseResult) {

    try {

      AnalyticsResult result =
          AnalyticsResult.builder()
              .datasetId(datasetId)
              .rowCount(parseResult.getRowCount())
              .columnCount(parseResult.getColumnCount())
              .missingValueCount(parseResult.getMissingValueCount())
              .invalidValueCount(parseResult.getInvalidValueCount())
              .qualityScore(parseResult.getQualityScore())
              .statisticsJson(parseResult.getColumnAnalytics())
              .createdAt(LocalDateTime.now())
              .build();

      return analyticsResultRepository.save(result);

    } catch (Exception e) {

      throw new RuntimeException("Failed to serialize analytics result", e);
    }
  }

  @Transactional(readOnly = true)
  public AnalyticsResult getByDatasetId(UUID datasetId) {

    return analyticsResultRepository
        .findByDatasetId(datasetId)
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    "Analytics result not found for dataset: " + datasetId));
  }
}

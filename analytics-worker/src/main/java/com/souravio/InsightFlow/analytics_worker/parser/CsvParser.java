package com.souravio.InsightFlow.analytics_worker.parser;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

@Component
public class CsvParser {

  public CsvParseResult parse(String storagePath) throws IOException {

    Path path = Path.of(storagePath);

    if (!Files.exists(path)) {
      throw new IllegalArgumentException("CSV file not found: " + storagePath);
    }

    try (BufferedReader reader = Files.newBufferedReader(path);
        CSVParser parser =
            CSVFormat.DEFAULT
                .builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreEmptyLines(true)
                .build()
                .parse(reader)) {

      List<String> headers = parser.getHeaderNames();

      if (headers == null || headers.isEmpty()) {
        throw new IllegalArgumentException("CSV file does not contain a header row");
      }

      long rowCount = 0;

      Map<String, ColumnTypeDetector> detectors = new LinkedHashMap<>();

      // Create detector for every column
      for (String header : headers) {

        detectors.put(header, new ColumnTypeDetector(header));
      }

      // Process rows
      for (CSVRecord record : parser) {

        rowCount++;

        boolean validRow = true;

        for (String header : headers) {

          String value =
                  record.isMapped(header)
                          ? record.get(header)
                          : null;

          ColumnTypeDetector detector = detectors.get(header);

          detector.observe(value);

          if (!detector.isValid(value)) {
            validRow = false;
          }
        }

        if (validRow) {
          // This row is clean
        }
      }

      // Build column analytics
      Map<String, ColumnAnalytics> columnAnalytics = new LinkedHashMap<>();

      long totalMissingValues = 0;
      long totalInvalidValues = 0;

      for (Map.Entry<String, ColumnTypeDetector> entry : detectors.entrySet()) {

        ColumnTypeDetector detector = entry.getValue();

        ColumnAnalytics analytics = detector.getAnalytics();

        columnAnalytics.put(entry.getKey(), analytics);

        totalMissingValues += detector.getMissingCount();

        totalInvalidValues += detector.getInvalidCount();
      }

      // -------------------------
      // Dataset-level quality
      // -------------------------

      long totalCells = rowCount * headers.size();

      long validCells = totalCells - totalMissingValues - totalInvalidValues;

      double qualityScore = 100.0;

      if (totalCells > 0) {

        qualityScore = ((double) validCells / totalCells) * 100.0;

        qualityScore = Math.round(qualityScore * 100.0) / 100.0;
      }

      return CsvParseResult.builder()
          .rowCount(rowCount)
          .columnCount(headers.size())
          .columnNames(headers)
          .missingValueCount(totalMissingValues)
          .invalidValueCount(totalInvalidValues)
          .qualityScore(qualityScore)
          .columnAnalytics(columnAnalytics)
          .build();
    }
  }
}

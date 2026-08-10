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
      long totalMissingValues = 0;

      Map<String, ColumnTypeDetector> detectors = new LinkedHashMap<>();

      // Create detector for every column
      for (String header : headers) {
        detectors.put(header, new ColumnTypeDetector());
      }

      // Process every row
      for (CSVRecord record : parser) {

        rowCount++;

        for (String header : headers) {

          String value = record.isMapped(header) ? record.get(header) : null;

          // Missing value
          if (value == null || value.trim().isEmpty()) {

            detectors.get(header).incrementMissingCount();

            totalMissingValues++;

            continue;
          }

          // Process value
          detectors.get(header).observe(value);
        }
      }

      // Build column statistics
      Map<String, ColumnAnalytics> columns = new LinkedHashMap<>();

      for (Map.Entry<String, ColumnTypeDetector> entry : detectors.entrySet()) {

        ColumnTypeDetector detector = entry.getValue();

        ColumnAnalytics statistics =
            ColumnAnalytics.builder()
                .type(detector.getType())
                .missingCount(detector.getMissingCount())
                .min(detector.getMin())
                .max(detector.getMax())
                .average(detector.getAverage())
                .build();

        columns.put(entry.getKey(), statistics);
      }

      return CsvParseResult.builder()
          .rowCount(rowCount)
          .columnCount(headers.size())
          .missingValueCount(totalMissingValues)
          .columns(columns)
          .build();
    }
  }
}

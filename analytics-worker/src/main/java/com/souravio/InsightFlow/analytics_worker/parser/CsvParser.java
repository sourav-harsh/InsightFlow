package com.souravio.InsightFlow.analytics_worker.parser;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Component
public class CsvParser {

    public CsvParseResult parse(String storagePath) throws IOException {

        Path path = Path.of(storagePath);

        if (!Files.exists(path)) {
            throw new IllegalArgumentException(
                    "CSV file not found: " + storagePath
            );
        }

        try (
                BufferedReader reader = Files.newBufferedReader(path);
                CSVParser parser = CSVFormat.DEFAULT.builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .setIgnoreEmptyLines(true)
                        .build()
                        .parse(reader)
        ) {

            List<String> headers = parser.getHeaderNames();

            if (headers == null || headers.isEmpty()) {
                throw new IllegalArgumentException(
                        "CSV file does not contain a header row"
                );
            }

            long rowCount = 0;
            long missingValueCount = 0;

            Map<String, ColumnTypeDetector> detectors =
                    new LinkedHashMap<>();

            for (String header : headers) {
                detectors.put(header, new ColumnTypeDetector());
            }

            for (CSVRecord record : parser) {

                rowCount++;

                for (String header : headers) {

                    String value = record.isMapped(header)
                            ? record.get(header)
                            : null;

                    if (value == null || value.trim().isEmpty()) {
                        missingValueCount++;
                        continue;
                    }

                    detectors.get(header).observe(value);
                }
            }

            Map<String, String> columnTypes =
                    new LinkedHashMap<>();

            for (Map.Entry<String, ColumnTypeDetector> entry
                    : detectors.entrySet()) {

                columnTypes.put(
                        entry.getKey(),
                        entry.getValue().getType()
                );
            }

            return CsvParseResult.builder()
                    .rowCount(rowCount)
                    .columnCount(headers.size())
                    .columnNames(headers)
                    .missingValueCount(missingValueCount)
                    .columnTypes(columnTypes)
                    .build();
        }
    }
}

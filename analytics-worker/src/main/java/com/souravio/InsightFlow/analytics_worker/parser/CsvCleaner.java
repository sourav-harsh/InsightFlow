package com.souravio.InsightFlow.analytics_worker.parser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

@Component
public class CsvCleaner {

    public CsvCleanResult clean(
            String storagePath,
            String datasetId
    ) throws IOException {

        Path inputPath = Path.of(storagePath);

        if (!Files.exists(inputPath)) {
            throw new IllegalArgumentException(
                    "CSV file not found: " + storagePath
            );
        }

        Path inputDirectory = inputPath.getParent();

        if (inputDirectory == null) {
            throw new IllegalArgumentException(
                    "Unable to determine input directory"
            );
        }

        Path cleanedDirectory = inputDirectory.resolve("cleaned");

        Files.createDirectories(cleanedDirectory);

        Path cleanedPath =
                cleanedDirectory.resolve(datasetId + "-cleaned.csv");

        try (
                BufferedReader reader = Files.newBufferedReader(inputPath);

                CSVParser parser =
                        CSVFormat.DEFAULT
                                .builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .setIgnoreEmptyLines(true)
                                .build()
                                .parse(reader);

                BufferedWriter writer =
                        Files.newBufferedWriter(
                                cleanedPath,
                                StandardOpenOption.CREATE,
                                StandardOpenOption.TRUNCATE_EXISTING
                        );

                CSVPrinter printer =
                        CSVFormat.DEFAULT
                                .builder()
                                .setHeader(parser.getHeaderNames()
                                        .toArray(new String[0]))
                                .build()
                                .print(writer)
        ) {

            List<String> headers = parser.getHeaderNames();

            if (headers == null || headers.isEmpty()) {
                throw new IllegalArgumentException(
                        "CSV file does not contain a header row"
                );
            }

            /*
             * Create a detector for every column.
             */
            Map<String, ColumnTypeDetector> detectors =
                    new LinkedHashMap<>();

            for (String header : headers) {
                detectors.put(
                        header,
                        new ColumnTypeDetector(header)
                );
            }

            long totalRows = 0;
            long cleanedRows = 0;
            long removedRows = 0;

            for (CSVRecord record : parser) {

                totalRows++;

                boolean validRow = true;

                Map<String, String> row =
                        new LinkedHashMap<>();

                /*
                 * Validate every column.
                 */
                for (String header : headers) {

                    String value =
                            record.isMapped(header)
                                    ? record.get(header)
                                    : null;

                    row.put(header, value);

                    ColumnTypeDetector detector =
                            detectors.get(header);

                    if (!detector.isValid(value)) {
                        validRow = false;
                    }
                }

                /*
                 * Keep only completely valid rows.
                 */
                if (validRow) {

                    printer.printRecord(row.values());

                    cleanedRows++;

                } else {

                    removedRows++;
                }
            }

            printer.flush();

            return CsvCleanResult.builder()
                    .originalRowCount(totalRows)
                    .cleanedRowCount(cleanedRows)
                    .removedRowCount(removedRows)
                    .cleanedFilePath(cleanedPath.toString())
                    .build();
        }
    }
}

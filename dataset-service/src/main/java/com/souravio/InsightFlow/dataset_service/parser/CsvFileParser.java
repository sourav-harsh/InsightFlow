package com.souravio.InsightFlow.dataset_service.parser;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class CsvFileParser {

    public CsvParseResult parse(InputStream inputStream)
            throws IOException {

        try (
                BufferedReader reader =
                        new BufferedReader(
                                new InputStreamReader(
                                        inputStream,
                                        StandardCharsets.UTF_8
                                )
                        );

                CSVParser parser = CSVFormat.DEFAULT
                        .builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .setIgnoreEmptyLines(true)
                        .build()
                        .parse(reader)
        ) {

            List<String> headers =
                    parser.getHeaderNames();

            long rowCount = 0;

            for (CSVRecord record : parser) {
                rowCount++;
            }

            return CsvParseResult.builder()
                    .totalRows(rowCount)
                    .totalColumns(headers.size())
                    .columns(headers)
                    .build();
        }
    }
}

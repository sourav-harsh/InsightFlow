package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.parser.CsvParseResult;
import com.souravio.InsightFlow.analytics_worker.parser.CsvParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CsvProcessingService {

    private final CsvParser csvParser;

    public CsvParseResult process(String storagePath) throws IOException {
        return csvParser.parse(storagePath);
    }
}

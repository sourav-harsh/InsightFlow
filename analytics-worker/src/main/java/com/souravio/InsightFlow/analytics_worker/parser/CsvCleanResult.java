package com.souravio.InsightFlow.analytics_worker.parser;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CsvCleanResult {

    private long originalRowCount;

    private long cleanedRowCount;

    private long removedRowCount;

    private String cleanedFilePath;
}

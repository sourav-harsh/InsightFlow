package com.souravio.InsightFlow.analytics_worker.parser;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class CsvParseResult {

    private long rowCount;

    private int columnCount;

    private List<String> columnNames;

    private long missingValueCount;

    private Map<String, String> columnTypes;
}

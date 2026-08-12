package com.souravio.InsightFlow.dataset_service.parser;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CsvParseResult {

    private long totalRows;

    private int totalColumns;

    private List<String> columns;
}


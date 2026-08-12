package com.souravio.InsightFlow.analytics_worker.validation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RowValidationResult {

    private boolean valid;
    private int missingCount;
    private int invalidCount;
}

package com.souravio.InsightFlow.analytics_worker.validation;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class RowValidator {

    public RowValidationResult validate(Map<String, String> row) {

        int missingCount = 0;

        for (String value : row.values()) {

            if (value == null || value.trim().isEmpty()) {
                missingCount++;
            }
        }

        return new RowValidationResult(
                missingCount == 0,
                missingCount,
                0
        );
    }
}

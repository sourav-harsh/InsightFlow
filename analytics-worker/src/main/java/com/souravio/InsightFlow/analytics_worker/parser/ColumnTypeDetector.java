package com.souravio.InsightFlow.analytics_worker.parser;

public class ColumnTypeDetector {

    private boolean integer = true;
    private boolean decimal = true;
    private boolean booleanValue = true;

    public void observe(String value) {

        String trimmed = value.trim();

        if (!isInteger(trimmed)) {
            integer = false;
        }

        if (!isDecimal(trimmed)) {
            decimal = false;
        }

        if (!isBoolean(trimmed)) {
            booleanValue = false;
        }
    }

    public String getType() {

        if (integer) {
            return "INTEGER";
        }

        if (decimal) {
            return "DECIMAL";
        }

        if (booleanValue) {
            return "BOOLEAN";
        }

        return "STRING";
    }

    private boolean isInteger(String value) {

        try {
            Long.parseLong(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isDecimal(String value) {

        try {
            Double.parseDouble(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isBoolean(String value) {

        return "true".equalsIgnoreCase(value)
                || "false".equalsIgnoreCase(value);
    }
}

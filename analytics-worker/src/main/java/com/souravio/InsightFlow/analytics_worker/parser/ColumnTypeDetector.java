package com.souravio.InsightFlow.analytics_worker.parser;

public class ColumnTypeDetector {

    private boolean integer = true;
    private boolean decimal = true;
    private boolean booleanValue = true;
    private double min = Double.MAX_VALUE;
    private double max = -Double.MAX_VALUE;
    private double sum = 0;
    private long numericCount = 0;
    private long missingCount = 0;

    public void observe(String value) {

        String trimmed = value.trim();

        try {
            Long.parseLong(trimmed);

            updateNumericStats(Double.parseDouble(trimmed));
            return;

        } catch (NumberFormatException ignored) {
        }

        try {
            Double.parseDouble(trimmed);

            integer = false;
            updateNumericStats(Double.parseDouble(trimmed));
            return;

        } catch (NumberFormatException ignored) {
        }

        integer = false;
        decimal = false;
    }

    private void updateNumericStats(double value) {

        min = Math.min(min, value);
        max = Math.max(max, value);

        sum += value;
        numericCount++;
    }

    public String getType() {

        if (integer && numericCount > 0) {
            return "INTEGER";
        }

        if (decimal && numericCount > 0) {
            return "DECIMAL";
        }

        return "STRING";
    }

    public long getMissingCount() {
        return 0;
    }

    public Double getMin() {

        if (numericCount == 0) {
            return null;
        }

        return min;
    }

    public Double getMax() {

        if (numericCount == 0) {
            return null;
        }

        return max;
    }

    public Double getAverage() {

        if (numericCount == 0) {
            return null;
        }

        return sum / numericCount;
    }

    public void incrementMissingCount() {
        missingCount++;
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

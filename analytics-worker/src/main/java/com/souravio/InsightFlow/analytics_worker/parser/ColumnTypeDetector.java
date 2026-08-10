package com.souravio.InsightFlow.analytics_worker.parser;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

public class ColumnTypeDetector {

  private final String columnName;

  private boolean integer = true;
  private boolean decimal = true;
  private boolean booleanValue = true;

  private long missingCount = 0;
  private long invalidCount = 0;
  private long valueCount = 0;

  private double min = Double.MAX_VALUE;
  private double max = -Double.MAX_VALUE;
  private double sum = 0;
  private long numericCount = 0;

  public ColumnTypeDetector(String columnName) {
    this.columnName = columnName;
  }

  public void observe(String value) {

    // -------------------------
    // Missing value
    // -------------------------
    if (value == null || value.trim().isEmpty()) {
      missingCount++;
      return;
    }

    valueCount++;

    String trimmed = value.trim();

    // -------------------------
    // Email
    // -------------------------
    if (isLikelyEmailColumn()) {

      if (!isEmail(trimmed)) {
        invalidCount++;
      }

      return;
    }

    // -------------------------
    // Phone
    // -------------------------
    if (isLikelyPhoneColumn()) {

      if (!isPhone(trimmed)) {
        invalidCount++;
      }

      return;
    }

    // -------------------------
    // Date / DOB
    // -------------------------
    if (isLikelyDateColumn()) {

      if (!isDate(trimmed)) {
        invalidCount++;
      }

      return;
    }

    // -------------------------
    // Integer
    // -------------------------
    if (isInteger(trimmed)) {

      updateNumericStats(Double.parseDouble(trimmed));

      return;
    }

    integer = false;

    // -------------------------
    // Decimal
    // -------------------------
    if (isDecimal(trimmed)) {

      updateNumericStats(Double.parseDouble(trimmed));

      return;
    }

    decimal = false;

    // -------------------------
    // Boolean
    // -------------------------
    if (isBoolean(trimmed)) {
      return;
    }

    booleanValue = false;
  }

  private void updateNumericStats(double value) {

    min = Math.min(min, value);
    max = Math.max(max, value);

    sum += value;
    numericCount++;
  }

  public ColumnAnalytics getAnalytics() {

    return ColumnAnalytics.builder()
        .type(getType())
        .missingCount(missingCount)
        .invalidCount(invalidCount)
        .qualityScore(getQualityScore())
        .min(getMin())
        .max(getMax())
        .average(getAverage())
        .build();
  }

  public String getType() {

    if (isLikelyEmailColumn()) {
      return "EMAIL";
    }

    if (isLikelyPhoneColumn()) {
      return "PHONE";
    }

    if (isLikelyDateColumn()) {
      return "DATE";
    }

    if (integer && numericCount > 0) {
      return "INTEGER";
    }

    if (decimal && numericCount > 0) {
      return "DECIMAL";
    }

    if (booleanValue && valueCount > 0) {
      return "BOOLEAN";
    }

    return "STRING";
  }

  /**
   * Column quality score:
   *
   * <p>valid values / total rows × 100
   *
   * <p>Missing and invalid values are both considered quality issues.
   */
  public double getQualityScore() {

    long totalValues = valueCount + missingCount;

    if (totalValues == 0) {
      return 100.0;
    }

    long validValues = totalValues - missingCount - invalidCount;

    double score = ((double) validValues / totalValues) * 100.0;

    return round(score);
  }

  public long getMissingCount() {
    return missingCount;
  }

  public long getInvalidCount() {
    return invalidCount;
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

    return "true".equalsIgnoreCase(value) || "false".equalsIgnoreCase(value);
  }

  private boolean isEmail(String value) {

    return value.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
  }

  private boolean isPhone(String value) {

    return value.matches("^(\\+\\d{1,3})?\\d{10}$");
  }

  private boolean isDate(String value) {

    List<DateTimeFormatter> formatters =
        List.of(
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("MM-dd-yyyy"));

    for (DateTimeFormatter formatter : formatters) {

      try {
        LocalDate.parse(value, formatter);
        return true;

      } catch (DateTimeParseException ignored) {
      }
    }

    return false;
  }

  private boolean isLikelyEmailColumn() {

    String name = columnName.toLowerCase();

    return name.contains("email") || name.contains("e-mail");
  }

  private boolean isLikelyPhoneColumn() {

    String name = columnName.toLowerCase();

    return name.contains("phone")
        || name.contains("mobile")
        || name.contains("contact")
        || name.contains("telephone");
  }

  private boolean isLikelyDateColumn() {

    String name = columnName.toLowerCase();

    return name.equals("dob")
        || name.contains("date_of_birth")
        || name.contains("dateofbirth")
        || name.contains("birth_date")
        || name.contains("birthdate");
  }

  private double round(double value) {

    return Math.round(value * 100.0) / 100.0;
  }
}

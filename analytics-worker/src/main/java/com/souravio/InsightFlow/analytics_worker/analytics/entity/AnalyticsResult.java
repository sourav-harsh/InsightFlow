package com.souravio.InsightFlow.analytics_worker.analytics.entity;

import com.souravio.InsightFlow.analytics_worker.parser.ColumnAnalytics;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(
    name = "analytics_results",
    indexes = {@Index(name = "idx_analytics_results_dataset_id", columnList = "dataset_id")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResult {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "dataset_id", nullable = false)
  private UUID datasetId;

  @Column(name = "row_count", nullable = false)
  private Long rowCount;

  @Column(name = "column_count", nullable = false)
  private Integer columnCount;

  @Column(name = "missing_value_count", nullable = false)
  private Long missingValueCount;

  @Column(name = "invalid_value_count", nullable = false)
  private Long invalidValueCount;

  @Column(name = "quality_score", nullable = false)
  private Double qualityScore;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "statistics_json", columnDefinition = "jsonb")
  private Map<String, ColumnAnalytics> statisticsJson;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;
}

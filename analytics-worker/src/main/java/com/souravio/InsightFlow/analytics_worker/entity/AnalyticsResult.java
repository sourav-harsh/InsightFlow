package com.souravio.InsightFlow.analytics_worker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "analytics_results",
        indexes = {
                @Index(name = "idx_analytics_results_dataset_id", columnList = "dataset_id")
        }
)
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

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}

package com.souravio.InsightFlow.analytics_worker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "processed_events",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_processed_event_event_id",
                        columnNames = "event_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessedEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "event_id",
            nullable = false,
            unique = true
    )
    private UUID eventId;

    @Column(
            name = "job_id",
            nullable = false
    )
    private UUID jobId;

    @Column(
            name = "attempt",
            nullable = false
    )
    private Integer attempt;

    @Column(
            name = "processed_at",
            nullable = false
    )
    private Instant processedAt;
}

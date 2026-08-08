package com.souravio.InsightFlow.dataset_service.entity;

import com.souravio.InsightFlow.dataset_service.enums.DatasetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "datasets",
    indexes = {
      @Index(name = "idx_dataset_user_id", columnList = "user_id"),
      @Index(name = "idx_dataset_status", columnList = "status"),
      @Index(name = "idx_dataset_uploaded_at", columnList = "uploaded_at")
    })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dataset {

  @Id
  private UUID id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "original_filename", nullable = false)
  private String originalFilename;

  @Column(name = "stored_filename", nullable = false)
  private String storedFilename;

  @Column(name = "file_type", nullable = false)
  private String fileType;

  @Column(name = "file_size", nullable = false)
  private Long fileSize;

  @Column(name = "storage_path", nullable = false)
  private String storagePath;

  @Column(nullable = false, length = 64)
  private String checksum;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private DatasetStatus status;

  @Column(name = "total_rows")
  private Long totalRows;

  @Column(name = "total_columns")
  private Integer totalColumns;

  @Column(name = "uploaded_at", nullable = false)
  private Instant uploadedAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}

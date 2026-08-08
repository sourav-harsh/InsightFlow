package com.souravio.InsightFlow.dataset_service.service;

import com.souravio.InsightFlow.dataset_service.dto.response.UploadDatasetResponse;
import com.souravio.InsightFlow.dataset_service.entity.Dataset;
import com.souravio.InsightFlow.dataset_service.entity.ProcessingJob;
import com.souravio.InsightFlow.dataset_service.enums.DatasetStatus;
import com.souravio.InsightFlow.dataset_service.enums.JobStatus;
import com.souravio.InsightFlow.dataset_service.parser.CsvFileParser;
import com.souravio.InsightFlow.dataset_service.parser.CsvParseResult;
import com.souravio.InsightFlow.dataset_service.repository.DatasetRepository;
import com.souravio.InsightFlow.dataset_service.repository.ProcessingJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DatasetService {

    private final DatasetRepository datasetRepository;
    private final ProcessingJobRepository jobRepository;
    private final FileStorageService fileStorageService;
    private final FileChecksumService checksumService;
    private final CsvFileParser csvFileParser;

    @Transactional
    public UploadDatasetResponse upload(
            MultipartFile file,
            UUID userId
    ) throws IOException {

        validateFile(file);

        // 1. Generate ID ourselves
        UUID datasetId = UUID.randomUUID();

        // 2. Calculate checksum
        String checksum =
                checksumService.calculate(file);

        // 3. Parse CSV
        CsvParseResult parseResult =
                csvFileParser.parse(
                        file.getInputStream()
                );

        // 4. Store file
        String storagePath =
                fileStorageService.store(
                        file,
                        datasetId
                );

        String storedFilename =
                datasetId +
                        getExtension(
                                file.getOriginalFilename()
                        );

        Instant now = Instant.now();

        // 5. Create dataset
        Dataset dataset = Dataset.builder()
                .id(datasetId)
                .userId(userId)
                .originalFilename(
                        file.getOriginalFilename()
                )
                .storedFilename(
                        storedFilename
                )
                .fileType(
                        file.getContentType()
                )
                .fileSize(
                        file.getSize()
                )
                .storagePath(
                        storagePath
                )
                .checksum(
                        checksum
                )
                .status(
                        DatasetStatus.UPLOADED
                )
                .totalRows(
                        parseResult.getTotalRows()
                )
                .totalColumns(
                        parseResult.getTotalColumns()
                )
                .uploadedAt(now)
                .updatedAt(now)
                .build();

        // 6. Save dataset
        Dataset savedDataset =
                datasetRepository.save(dataset);

        // 7. Create processing job
        ProcessingJob job =
                ProcessingJob.builder()
                        .datasetId(
                                savedDataset.getId()
                        )
                        .status(
                                JobStatus.PENDING
                        )
                        .retryCount(0)
                        .createdAt(now)
                        .build();

        // 8. Save job
        ProcessingJob savedJob =
                jobRepository.save(job);

        // 9. Return response
        return UploadDatasetResponse.builder()
                .datasetId(
                        savedDataset.getId()
                )
                .jobId(
                        savedJob.getId()
                )
                .filename(
                        savedDataset.getOriginalFilename()
                )
                .status(
                        savedDataset.getStatus().name()
                )
                .totalRows(
                        savedDataset.getTotalRows()
                )
                .totalColumns(
                        savedDataset.getTotalColumns()
                )
                .build();
    }

    private void validateFile(
            MultipartFile file
    ) {

        if (file == null ||
                file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File is required"
            );
        }

        String filename =
                file.getOriginalFilename();

        if (filename == null ||
                !filename.toLowerCase()
                        .endsWith(".csv")) {

            throw new IllegalArgumentException(
                    "Only CSV files are supported"
            );
        }
    }

    private String getExtension(
            String filename
    ) {

        if (filename == null ||
                !filename.contains(".")) {

            return "";
        }

        return filename.substring(
                filename.lastIndexOf(".")
        );
    }
}

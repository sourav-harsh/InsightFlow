package com.souravio.InsightFlow.dataset_service.service;

import com.souravio.InsightFlow.dataset_service.dto.response.ProcessingJobResponse;
import com.souravio.InsightFlow.dataset_service.entity.ProcessingJob;
import com.souravio.InsightFlow.dataset_service.repository.ProcessingJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessingJobService {
    private final ProcessingJobRepository jobRepository;
    private final DatasetService datasetService;

    public ResponseEntity<List<ProcessingJobResponse>> getJobsByUserId(UUID userId) {
        List<ProcessingJob> jobs = jobRepository.findAllByUserId(userId);
        List<ProcessingJobResponse> jobResponses = jobs.stream().map(job -> {
            UUID datasetId = job.getDatasetId();
            String fileName = datasetService.getFileName(datasetId);

            return  ProcessingJobResponse.builder()
                    .id(job.getId())
                    .datasetId(job.getDatasetId())
                    .fileName(fileName)
                    .status(job.getStatus())
                    .startedAt(job.getStartedAt())
                    .completedAt(job.getCompletedAt())
                    .failedAt(job.getFailedAt())
                    .errorMessage(job.getErrorMessage())
                    .build();
        }).toList();

        return ResponseEntity.ok(jobResponses);
    }
}

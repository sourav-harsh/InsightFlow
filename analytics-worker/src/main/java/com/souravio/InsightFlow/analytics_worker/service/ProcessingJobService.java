package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.enums.JobStatus;
import com.souravio.InsightFlow.analytics_worker.entity.ProcessingJob;
import com.souravio.InsightFlow.analytics_worker.repository.ProcessingJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProcessingJobService {

    private final ProcessingJobRepository jobRepository;

    @Transactional
    public boolean markProcessing(UUID jobId) {

        ProcessingJob job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Processing job not found: " + jobId
                                )
                        );

        if (job.getStatus() == JobStatus.COMPLETED) {
            return false;
        }

        if (job.getStatus() == JobStatus.PROCESSING) {
            return true;
        }

        job.setStatus(JobStatus.PROCESSING);
        job.setStartedAt(Instant.now());

        jobRepository.save(job);

        return true;
    }
}

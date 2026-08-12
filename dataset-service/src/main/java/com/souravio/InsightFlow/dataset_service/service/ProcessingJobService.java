package com.souravio.InsightFlow.dataset_service.service;

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

    public ResponseEntity<List<ProcessingJob>> getJobsByUserId(UUID userId) {
        return ResponseEntity.ok(jobRepository.findAllByUserId(userId));
    }
}

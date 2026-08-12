package com.souravio.InsightFlow.dataset_service.controller;

import com.souravio.InsightFlow.dataset_service.advice.SkipResponseWrapper;
import com.souravio.InsightFlow.dataset_service.auth.AuthContextHolder;
import com.souravio.InsightFlow.dataset_service.dto.response.JobStatusResponse;
import com.souravio.InsightFlow.dataset_service.dto.response.UploadDatasetResponse;
import com.souravio.InsightFlow.dataset_service.service.DatasetService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/datasets")
@RequiredArgsConstructor
public class DatasetController {

    private final DatasetService datasetService;

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public ResponseEntity<UploadDatasetResponse> upload(
            @RequestParam("file")
            MultipartFile file
    ) throws Exception {

        UUID userId =
                UUID.fromString(
                        AuthContextHolder.getCurrentUserId()
                );

        UploadDatasetResponse response =
                datasetService.upload(
                        file,
                        userId
                );

        return ResponseEntity
                .accepted()
                .body(response);
    }


    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<JobStatusResponse> getJobStatus(
            @PathVariable UUID jobId
    ) {

        JobStatusResponse response =
                datasetService.getJobStatus(jobId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{datasetId}/download")
    @SkipResponseWrapper
    public ResponseEntity<Resource> downloadCleanedCsv(
            @PathVariable UUID datasetId
    ) {

        return datasetService.downloadCleanedCsv(datasetId);
    }
}

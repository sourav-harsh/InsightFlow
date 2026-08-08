package com.souravio.InsightFlow.dataset_service.controller;

import com.souravio.InsightFlow.dataset_service.dto.response.UploadDatasetResponse;
import com.souravio.InsightFlow.dataset_service.service.DatasetService;
import lombok.RequiredArgsConstructor;
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

        // Temporary user ID for Day 2.
        // Tomorrow this will come from JWT.
        UUID userId =
                UUID.fromString(
                        "00000000-0000-0000-0000-000000000001"
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
}

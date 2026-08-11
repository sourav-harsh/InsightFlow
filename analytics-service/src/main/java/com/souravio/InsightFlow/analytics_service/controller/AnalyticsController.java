package com.souravio.InsightFlow.analytics_service.controller;

import com.souravio.InsightFlow.analytics_service.dto.AnalyticsResultResponse;
import com.souravio.InsightFlow.analytics_service.service.AnalyticsResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsResultService analyticsResultService;

    @GetMapping("/datasets/{datasetId}")
    public ResponseEntity<AnalyticsResultResponse> getDatasetAnalytics(
            @PathVariable UUID datasetId
    ) {

        AnalyticsResultResponse response =
                analyticsResultService.getAnalytics(datasetId);

        return ResponseEntity.ok(response);
    }
}

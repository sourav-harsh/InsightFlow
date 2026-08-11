package com.souravio.InsightFlow.dataset_service.advice;


import java.time.LocalDateTime;

import com.souravio.InsightFlow.dataset_service.exception.ApiError;
import lombok.Data;

@Data
public class ApiResponse<T> {

    private LocalDateTime timeStamp;
    private T data;
    private ApiError error;

    public ApiResponse() {
        this.timeStamp = LocalDateTime.now();
    }

    public ApiResponse(T data) {
        this();
        this.data = data;
    }

    public ApiResponse(ApiError error) {
        this();
        this.error = error;
    }
}

package com.souravio.InsightFlow.auth_service.exception;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@Builder
public class ApiError {

    private String message;
    private HttpStatus status;
    private List<String> subErrors;

}

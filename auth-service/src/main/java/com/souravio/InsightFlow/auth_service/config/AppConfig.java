package com.souravio.InsightFlow.auth_service.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        // Spring Boot 4 auto-instruments this builder with Micrometer Tracing
        return builder.build();
    }
}

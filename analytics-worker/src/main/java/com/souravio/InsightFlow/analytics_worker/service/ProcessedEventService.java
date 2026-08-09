package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.entity.ProcessedEvent;
import com.souravio.InsightFlow.analytics_worker.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProcessedEventService {

    private final ProcessedEventRepository processedEventRepository;

    @Transactional
    public boolean claimEvent(
            UUID eventId,
            UUID jobId,
            int attempt
    ) {

        try {

            ProcessedEvent event =
                    ProcessedEvent.builder()
                            .eventId(eventId)
                            .jobId(jobId)
                            .attempt(attempt)
                            .processedAt(Instant.now())
                            .build();

            processedEventRepository.saveAndFlush(event);

            return true;

        } catch (DataIntegrityViolationException exception) {

            return false;
        }
    }
}

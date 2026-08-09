package com.souravio.InsightFlow.analytics_worker.service;

import com.souravio.InsightFlow.analytics_worker.entity.ProcessedEvent;
import com.souravio.InsightFlow.analytics_worker.repository.ProcessedEventRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProcessedEventService {

  private final ProcessedEventRepository processedEventRepository;

  @Transactional
  public boolean claimEvent(
          UUID eventId,
          UUID jobId,
          int attempt
  ) {

    if (processedEventRepository.existsByEventId(eventId)) {

      log.info(
              "Event already processed. eventId={}, jobId={}",
              eventId,
              jobId
      );

      return false;
    }

    ProcessedEvent event =
            ProcessedEvent.builder()
                    .eventId(eventId)
                    .jobId(jobId)
                    .attempt(attempt)
                    .processedAt(Instant.now())
                    .build();

    processedEventRepository.save(event);

    log.info(
            "Event claimed successfully. eventId={}, jobId={}, attempt={}",
            eventId,
            jobId,
            attempt
    );

    return true;
  }
}

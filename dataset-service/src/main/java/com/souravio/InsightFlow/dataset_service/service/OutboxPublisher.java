package com.souravio.InsightFlow.dataset_service.service;

import com.souravio.InsightFlow.dataset_service.config.RabbitMQConfig;
import com.souravio.InsightFlow.dataset_service.entity.OutboxEvent;
import com.souravio.InsightFlow.dataset_service.enums.OutboxStatus;
import com.souravio.InsightFlow.dataset_service.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

    private final OutboxEventRepository outboxEventRepository;

    private final RabbitTemplate rabbitTemplate;

    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 1000)
    public void publishPendingEvents() {

        List<OutboxEvent> events =
                outboxEventRepository
                        .findTop50ByStatusOrderByCreatedAtAsc(
                                OutboxStatus.PENDING
                        );

        for (OutboxEvent event : events) {

            try {

                publish(event);

            } catch (Exception e) {

                log.error(
                        "Failed to publish outbox event {}",
                        event.getId(),
                        e
                );
            }
        }
    }

    @Transactional
    protected void publish(OutboxEvent event) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                event.getPayload()
        );

        event.setStatus(
                OutboxStatus.PUBLISHED
        );

        event.setPublishedAt(
                Instant.now()
        );

        outboxEventRepository.save(event);

        log.info(
                "Published outbox event: {}",
                event.getId()
        );
    }
}

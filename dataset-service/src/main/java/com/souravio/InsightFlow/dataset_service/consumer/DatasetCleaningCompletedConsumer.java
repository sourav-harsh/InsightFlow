package com.souravio.InsightFlow.dataset_service.consumer;

import com.souravio.InsightFlow.dataset_service.config.RabbitMQConfig;
import com.souravio.InsightFlow.dataset_service.dto.event.DatasetCleaningCompletedEvent;
import com.souravio.InsightFlow.dataset_service.entity.Dataset;
import com.souravio.InsightFlow.dataset_service.repository.DatasetRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatasetCleaningCompletedConsumer {

    private final DatasetRepository datasetRepository;
    private final ObjectMapper objectMapper;

    @RabbitListener(
            queues = RabbitMQConfig.CLEANED_QUEUE
    )
    @Transactional
    public void consume(String message) {

        log.info("Received cleaning completed event: {}", message);

        DatasetCleaningCompletedEvent event =
                objectMapper.readValue(message, DatasetCleaningCompletedEvent.class);
        log.info(
                "Received dataset cleaning completed event. datasetId={}, cleanedPath={}",
                event.getDatasetId(),
                event.getCleanedStoragePath()
        );

        Dataset dataset = datasetRepository
                .findById(event.getDatasetId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Dataset not found: " + event.getDatasetId()
                        )
                );

        dataset.setCleanedCsvPath(event.getCleanedStoragePath());
        dataset.setCleanedRowCount(event.getCleanedRowCount());
        dataset.setRemovedRowCount(event.getRemovedRowCount());

        datasetRepository.save(dataset);

        log.info(
                "Dataset updated with cleaned CSV. datasetId={}, cleanedRows={}, removedRows={}",
                event.getDatasetId(),
                event.getCleanedRowCount(),
                event.getRemovedRowCount()
        );
    }
}

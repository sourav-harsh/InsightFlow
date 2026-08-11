package com.souravio.InsightFlow.analytics_worker.consumer;

import com.rabbitmq.client.Channel;
import com.souravio.InsightFlow.analytics_worker.config.RabbitMQConfig;
import com.souravio.InsightFlow.analytics_worker.dto.DatasetProcessingRequestedEvent;
import com.souravio.InsightFlow.analytics_worker.parser.CsvParseResult;
import com.souravio.InsightFlow.analytics_worker.service.AnalyticsResultService;
import com.souravio.InsightFlow.analytics_worker.service.CsvProcessingService;
import com.souravio.InsightFlow.analytics_worker.service.ProcessedEventService;
import com.souravio.InsightFlow.analytics_worker.service.ProcessingJobService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatasetProcessingConsumer {

  private static final int MAX_ATTEMPTS = 3;
  private final ObjectMapper objectMapper;
  private final ProcessingJobService processingJobService;
  private final ProcessedEventService processedEventService;
  private final CsvProcessingService csvProcessingService;
  private final AnalyticsResultService analyticsResultService;
  private final RabbitTemplate rabbitTemplate;

  @RabbitListener(queues = RabbitMQConfig.MAIN_QUEUE)
  public void consume(
      String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag)
      throws Exception {

    log.info("Received dataset processing event: {}", message);

    DatasetProcessingRequestedEvent event =
        objectMapper.readValue(message, DatasetProcessingRequestedEvent.class);

    int attempt = event.getAttempt() == null ? 1 : event.getAttempt();

    int retryCount = event.getRetryCount() == null ? 0 : event.getRetryCount();

    // ==========================================
    // 1. Claim Event
    // ==========================================

    boolean claimed =
        processedEventService.claimEvent(event.getEventId(), event.getJobId(), attempt);

    if (!claimed) {

      log.info(
          "Duplicate event detected. eventId={}, jobId={}, attempt={}",
          event.getEventId(),
          event.getJobId(),
          attempt);

      channel.basicAck(deliveryTag, false);

      return;
    }

    // ==========================================
    // 3.Making job processing and Process Dataset
    // ==========================================

    try {
      processingJobService.markProcessing(event.getJobId());

      log.info(
          "Starting processing. jobId={}, attempt={}, retryCount={}",
          event.getJobId(),
          attempt,
          retryCount);

      processDataset(event);

      processingJobService.markCompleted(event.getJobId());

      log.info("Dataset processing succeeded. jobId={}", event.getJobId());

      channel.basicAck(deliveryTag, false);

      log.info(
          "Dataset processing completed. datasetId={}, jobId={}",
          event.getDatasetId(),
          event.getJobId());

    } catch (Exception exception) {

      log.error(
          "Dataset processing failed. jobId={}, attempt={}, retryCount={}",
          event.getJobId(),
          attempt,
          retryCount,
          exception);

      handleFailure(event, attempt, channel, deliveryTag);
    }
  }

  private void processDataset(DatasetProcessingRequestedEvent event) {

    try {

      log.info("Processing file: {}", event.getStoragePath());
      // 3. Parse CSV
      CsvParseResult result = csvProcessingService.process(event.getStoragePath());


      log.info(
              "CSV processed successfully. datasetId={}, rows={}, columns={}, missingValues={}",
              event.getDatasetId(),
              result.getRowCount(),
              result.getColumnCount(),
              result.getMissingValueCount()
      );

      // 4. Save analytics result
      analyticsResultService.saveResult(
              event.getDatasetId(),
              result
      );
    } catch (Exception exception) {
      throw new RuntimeException("Failed to process dataset", exception);
    }
  }

  private void handleFailure(
          DatasetProcessingRequestedEvent event,
          int attempt,
          Channel channel,
          long deliveryTag
  ) throws Exception {

    if (attempt >= MAX_ATTEMPTS) {

      log.error(
              "Maximum retry attempts reached. jobId={}, attempt={}",
              event.getJobId(),
              attempt
      );

      sendToDeadLetterQueue(event);

      processingJobService.markFailed(
              event.getJobId(),
              "Maximum processing attempts exceeded"
      );

      // ACK the ORIGINAL message because it has
      // been successfully handled by moving it to DLQ.
      channel.basicAck(deliveryTag, false);

      return;
    }

    DatasetProcessingRequestedEvent retryEvent =
            DatasetProcessingRequestedEvent.builder()
                    .eventId(UUID.randomUUID())
                    .datasetId(event.getDatasetId())
                    .jobId(event.getJobId())
                    .storagePath(event.getStoragePath())
                    .fileType(event.getFileType())
                    .retryCount(attempt)
                    .attempt(attempt + 1)
                    .build();

    String retryMessage =
            objectMapper.writeValueAsString(retryEvent);

    rabbitTemplate.convertAndSend(
            RabbitMQConfig.RETRY_EXCHANGE,
            RabbitMQConfig.RETRY_ROUTING_KEY,
            retryMessage
    );

    log.warn(
            "Message sent to retry queue. jobId={}, retryCount={}, attempt={}",
            retryEvent.getJobId(),
            retryEvent.getRetryCount(),
            retryEvent.getAttempt()
    );

    // ACK ORIGINAL message.
    channel.basicAck(deliveryTag, false);
  }

  private void sendToDeadLetterQueue(DatasetProcessingRequestedEvent event) throws Exception {

    String dlqMessage = objectMapper.writeValueAsString(event);

    rabbitTemplate.convertAndSend(
        RabbitMQConfig.DLQ_EXCHANGE, RabbitMQConfig.DLQ_ROUTING_KEY, dlqMessage);

    log.error(
        "Message moved to DLQ. jobId={}, eventId={}, retryCount={}, attempt={}",
        event.getJobId(),
        event.getEventId(),
        event.getRetryCount(),
        event.getAttempt());
  }
}

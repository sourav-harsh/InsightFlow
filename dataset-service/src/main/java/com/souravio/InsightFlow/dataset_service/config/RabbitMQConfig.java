package com.souravio.InsightFlow.dataset_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE =
            "insightflow.dataset.exchange";

    public static final String QUEUE =
            "insightflow.dataset.processing.queue";

    public static final String ROUTING_KEY =
            "dataset.processing.requested";

    @Bean
    public TopicExchange datasetExchange() {
        return new TopicExchange(EXCHANGE, true,false);
    }

    @Bean
    public Queue datasetProcessingQueue() {
        return QueueBuilder
                .durable(QUEUE)
                .build();
    }

    @Bean
    public Binding datasetProcessingBinding(
            Queue datasetProcessingQueue,
            TopicExchange datasetExchange
    ) {
        return BindingBuilder
                .bind(datasetProcessingQueue)
                .to(datasetExchange)
                .with(ROUTING_KEY);
    }
}

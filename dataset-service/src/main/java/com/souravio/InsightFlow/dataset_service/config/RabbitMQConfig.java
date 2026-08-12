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

    public static final String CLEANED_EXCHANGE =
            "insightflow.dataset.cleaned.exchange";

    public static final String CLEANED_QUEUE =
            "insightflow.dataset.cleaned.queue";

    public static final String CLEANED_ROUTING_KEY =
            "dataset.cleaned";

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

    @Bean
    public TopicExchange cleanedExchange() {
        return new TopicExchange(
                CLEANED_EXCHANGE,
                true,
                false
        );
    }

    @Bean
    public Queue cleanedQueue() {
        return QueueBuilder
                .durable(CLEANED_QUEUE)
                .build();
    }

    @Bean
    public Binding cleanedBinding(
            Queue cleanedQueue,
            TopicExchange cleanedExchange
    ) {
        return BindingBuilder
                .bind(cleanedQueue)
                .to(cleanedExchange)
                .with(CLEANED_ROUTING_KEY);
    }
}

package com.souravio.InsightFlow.analytics_worker.config;

import com.rabbitmq.client.ConnectionFactory;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String MAIN_EXCHANGE =
            "insightflow.dataset.exchange";

    public static final String MAIN_QUEUE =
            "insightflow.dataset.processing.queue";

    public static final String MAIN_ROUTING_KEY =
            "dataset.processing.requested";

    public static final String RETRY_EXCHANGE =
            "insightflow.dataset.retry.exchange";

    public static final String RETRY_QUEUE =
            "insightflow.dataset.processing.retry.queue";

    public static final String RETRY_ROUTING_KEY =
            "dataset.processing.retry";

    public static final String DLQ_EXCHANGE =
            "insightflow.dataset.dlq.exchange";

    public static final String DLQ_QUEUE =
            "insightflow.dataset.processing.dlq";

    public static final String DLQ_ROUTING_KEY =
            "dataset.processing.dlq";

    public static final String CLEANED_EXCHANGE =
            "insightflow.dataset.cleaned.exchange";

    public static final String CLEANED_QUEUE =
            "insightflow.dataset.cleaned.queue";

    public static final String CLEANED_ROUTING_KEY =
            "dataset.cleaned";

    // =========================
    // Main Exchange
    // =========================

    @Bean
    public TopicExchange mainExchange() {

        return new TopicExchange(
                MAIN_EXCHANGE,
                true,
                false
        );
    }

    // =========================
    // Retry Exchange
    // =========================

    @Bean
    public TopicExchange retryExchange() {

        return new TopicExchange(
                RETRY_EXCHANGE,
                true,
                false
        );
    }

    // =========================
    // DLQ Exchange
    // =========================
    @Bean
    public TopicExchange dlqExchange() {

        return new TopicExchange(
                DLQ_EXCHANGE,
                true,
                false
        );
    }

    // =========================
    // Cleaned Exchange
    // =========================
    @Bean
    public TopicExchange cleanedExchange() {

        return new TopicExchange(
                CLEANED_EXCHANGE,
                true,
                false
        );
    }

    // =========================
    // Main Queue
    // =========================

    @Bean
    public Queue mainQueue() {

        return QueueBuilder
                .durable(MAIN_QUEUE)
                .build();
    }

    // =========================
    // Retry Queue
    // =========================

    @Bean
    public Queue retryQueue() {

        return QueueBuilder
                .durable(RETRY_QUEUE)

                // Message waits 5 seconds
                .withArgument(
                        "x-message-ttl",
                        5000
                )

                // After TTL, send the message
                // to the main exchange
                .withArgument(
                        "x-dead-letter-exchange",
                        MAIN_EXCHANGE
                )

                .withArgument(
                        "x-dead-letter-routing-key",
                        MAIN_ROUTING_KEY
                )

                .build();
    }


    // =========================
    // DLQ Queue
    // =========================

    @Bean
    public Queue dlqQueue() {

        return QueueBuilder
                .durable(DLQ_QUEUE)
                .build();
    }

    // =========================
    // Cleaned Queue
    // =========================

    @Bean
    public Queue cleanedQueue() {

        return QueueBuilder
                .durable(CLEANED_QUEUE)
                .build();
    }

    // =========================
    // Main Binding
    // =========================

    @Bean
    public Binding mainBinding(
            Queue mainQueue,
            TopicExchange mainExchange
    ) {

        return BindingBuilder
                .bind(mainQueue)
                .to(mainExchange)
                .with(MAIN_ROUTING_KEY);
    }


    // =========================
    // Retry Binding
    // =========================

    @Bean
    public Binding retryBinding(
            Queue retryQueue,
            TopicExchange retryExchange
    ) {

        return BindingBuilder
                .bind(retryQueue)
                .to(retryExchange)
                .with(RETRY_ROUTING_KEY);
    }

    // =========================
    // DLQ Binding
    // =========================

    @Bean
    public Binding dlqBinding(
            Queue dlqQueue,
            TopicExchange dlqExchange
    ) {

        return BindingBuilder
                .bind(dlqQueue)
                .to(dlqExchange)
                .with(DLQ_ROUTING_KEY);
    }

    // =========================
    // Cleaned Binding
    // =========================


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

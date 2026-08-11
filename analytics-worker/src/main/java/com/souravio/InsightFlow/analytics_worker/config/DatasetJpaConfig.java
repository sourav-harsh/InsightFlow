package com.souravio.InsightFlow.analytics_worker.config;

import com.souravio.InsightFlow.analytics_worker.dataset.entity.ProcessedEvent;
import com.souravio.InsightFlow.analytics_worker.dataset.entity.ProcessingJob;
import jakarta.persistence.EntityManagerFactory;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.boot.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableJpaRepositories(
        basePackages =
                "com.souravio.InsightFlow.analytics_worker.dataset.repository",
        entityManagerFactoryRef = "datasetEntityManagerFactory",
        transactionManagerRef = "datasetTransactionManager"
)
public class DatasetJpaConfig {

    @Bean
    @ConfigurationProperties("app.datasource.dataset")
    public DataSourceProperties datasetDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource datasetDataSource(
            @Qualifier("datasetDataSourceProperties")
            DataSourceProperties properties) {

        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean datasetEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("datasetDataSource") DataSource dataSource) {

        return builder
                .dataSource(dataSource)
                .packages(
                        ProcessingJob.class,
                        ProcessedEvent.class
                )
                .persistenceUnit("dataset")
                .properties(Map.of(
                        "hibernate.hbm2ddl.auto", "update"
                ))
                .build();
    }

    @Bean
    public PlatformTransactionManager datasetTransactionManager(
            @Qualifier("datasetEntityManagerFactory")
            EntityManagerFactory entityManagerFactory) {

        return new JpaTransactionManager(entityManagerFactory);
    }
}

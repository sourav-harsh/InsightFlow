package com.souravio.InsightFlow.analytics_worker.config;


import com.souravio.InsightFlow.analytics_worker.analytics.entity.AnalyticsResult;
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
                "com.souravio.InsightFlow.analytics_worker.analytics.repository",
        entityManagerFactoryRef = "analyticsEntityManagerFactory",
        transactionManagerRef = "analyticsTransactionManager"
)
public class AnalyticsJpaConfig {

    @Bean
    @ConfigurationProperties("app.datasource.analytics")
    public DataSourceProperties analyticsDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource analyticsDataSource(
            @Qualifier("analyticsDataSourceProperties")
            DataSourceProperties properties) {

        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean analyticsEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("analyticsDataSource") DataSource dataSource) {

        return builder
                .dataSource(dataSource)
                .packages(AnalyticsResult.class)
                .persistenceUnit("analytics")
                .properties(Map.of(
                        "hibernate.hbm2ddl.auto", "update"
                ))
                .build();
    }

    @Bean
    public PlatformTransactionManager analyticsTransactionManager(
            @Qualifier("analyticsEntityManagerFactory")
            EntityManagerFactory entityManagerFactory) {

        return new JpaTransactionManager(entityManagerFactory);
    }
}

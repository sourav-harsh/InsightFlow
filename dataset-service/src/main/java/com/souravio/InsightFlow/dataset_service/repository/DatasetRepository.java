package com.souravio.InsightFlow.dataset_service.repository;

import com.souravio.InsightFlow.dataset_service.entity.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DatasetRepository  extends JpaRepository<Dataset, UUID> {}

package com.souravio.InsightFlow.dataset_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation;

    public FileStorageService(
            @Value("${insightflow.storage.path}") String storagePath
    ) {
        this.storageLocation =
                Paths.get(storagePath)
                        .toAbsolutePath()
                        .normalize();
    }

    public String store(
            MultipartFile file,
            UUID datasetId
    ) throws IOException {

        Files.createDirectories(storageLocation);

        String extension = getExtension(
                file.getOriginalFilename()
        );

        String storedFilename =
                datasetId + extension;

        Path destination =
                storageLocation.resolve(storedFilename);

        Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
        );

        return destination.toString();
    }

    private String getExtension(String filename) {

        if (filename == null || !filename.contains(".")) {
            return "";
        }

        return filename.substring(
                filename.lastIndexOf(".")
        );
    }
}

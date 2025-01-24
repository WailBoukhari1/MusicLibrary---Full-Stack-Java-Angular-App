package com.backend.music.config;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import jakarta.annotation.PostConstruct;

@Configuration
public class FileStorageConfig {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    @Value("${spring.servlet.multipart.max-file-size:10MB}")
    private DataSize maxFileSize;
    
    @Value("${spring.servlet.multipart.max-request-size:10MB}")
    private DataSize maxRequestSize;
    
    private Path fileStorageLocation;
    
    @PostConstruct
    public void init() {
        try {
            this.fileStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
            
            Files.createDirectories(this.fileStorageLocation);
            
            // Copy default album image if it doesn't exist
            Path defaultImagePath = this.fileStorageLocation.resolve("default-album.jpg");
            if (!Files.exists(defaultImagePath)) {
                // Copy from resources
                try (InputStream is = getClass().getResourceAsStream("/static/images/default-album.jpg")) {
                    if (is != null) {
                        Files.copy(is, defaultImagePath, StandardCopyOption.REPLACE_EXISTING);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
    
    public Path getFileStorageLocation() {
        return this.fileStorageLocation;
    }
    
    public DataSize getMaxFileSize() {
        return maxFileSize;
    }
    
    public DataSize getMaxRequestSize() {
        return maxRequestSize;
    }
} 
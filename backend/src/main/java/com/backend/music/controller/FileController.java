package com.backend.music.controller;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.music.config.FileStorageConfig;
import com.backend.music.exception.FileNotFoundException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageConfig fileStorageConfig;

    @Autowired
    public FileController(FileStorageConfig fileStorageConfig) {
        this.fileStorageConfig = fileStorageConfig;
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = fileStorageConfig.getFileStorageLocation().resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
            }
            
            throw new FileNotFoundException("File not found: " + filename);
        } catch (Exception e) {
            throw new FileNotFoundException("Could not retrieve file: " + filename, e);
        }
    }
} 
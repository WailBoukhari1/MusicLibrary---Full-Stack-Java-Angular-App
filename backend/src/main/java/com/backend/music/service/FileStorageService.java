package com.backend.music.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file);
    Resource load(String filename);
    void delete(String filename);
    Integer getAudioDuration(MultipartFile file);
} 
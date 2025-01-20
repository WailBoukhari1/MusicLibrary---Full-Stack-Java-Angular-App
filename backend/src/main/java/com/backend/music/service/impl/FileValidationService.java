package com.backend.music.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
public class FileValidationService {
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "audio/mpeg",  // MP3
        "audio/wav",   // WAV
        "audio/ogg"    // OGG
    );
    
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes
    
    public void validateAudioFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 15MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only MP3, WAV, and OGG files are allowed");
        }
    }
} 
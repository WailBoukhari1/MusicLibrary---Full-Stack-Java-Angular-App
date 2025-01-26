package com.backend.music.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileValidationUtils {
    
    public boolean isValidAudioFile(MultipartFile file) {
        String contentType = file.getContentType();
        long size = file.getSize();
        
        return contentType != null && 
            (contentType.equals("audio/mpeg") || 
             contentType.equals("audio/mp3") || 
             contentType.equals("audio/wav")) &&
            size <= 15 * 1024 * 1024; // 15MB limit
    }
} 
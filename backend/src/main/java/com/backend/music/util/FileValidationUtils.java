package com.backend.music.util;

import org.springframework.web.multipart.MultipartFile;

public class FileValidationUtils {
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    private static final String[] SUPPORTED_AUDIO_FORMATS = {".mp3", ".wav", ".ogg"};

    public static boolean isValidAudioFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return false;
        }

        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return false;
        }

        String extension = originalFilename.toLowerCase();
        for (String format : SUPPORTED_AUDIO_FORMATS) {
            if (extension.endsWith(format)) {
                return true;
            }
        }
        return false;
    }
} 
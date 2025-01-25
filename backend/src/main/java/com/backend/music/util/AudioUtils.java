package com.backend.music.util;

import org.springframework.web.multipart.MultipartFile;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.File;
import java.io.IOException;

public class AudioUtils {
    public static Integer calculateDuration(MultipartFile file) {
        try {
            File tempFile = File.createTempFile("temp", null);
            file.transferTo(tempFile);
            
            try (AudioInputStream audioInputStream = AudioSystem.getAudioInputStream(tempFile)) {
                long frames = audioInputStream.getFrameLength();
                float frameRate = audioInputStream.getFormat().getFrameRate();
                float durationInSeconds = (frames / frameRate);
                return Math.round(durationInSeconds);
            } finally {
                tempFile.delete();
            }
        } catch (UnsupportedAudioFileException | IOException e) {
            return null;
        }
    }
} 
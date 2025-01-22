package com.backend.music.service.impl;

import com.backend.music.service.FileStorageService;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;
import org.xml.sax.helpers.DefaultHandler;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private final String baseUrl;

    public FileStorageServiceImpl(
            @Value("${file.upload-dir:uploads}") String uploadDir,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl;
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Invalid file path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName; // Return just the filename, not the full URL
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            if (fileName == null) return null;
            
            // Remove the base URL if it's present
            if (fileName.startsWith(baseUrl)) {
                fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
            }

            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            if (fileName == null) return;
            
            // Remove the base URL if it's present
            if (fileName.startsWith(baseUrl)) {
                fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
            }

            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + fileName, ex);
        }
    }

    @Override
    public Integer getAudioDuration(MultipartFile file) {
        try (InputStream input = file.getInputStream()) {
            ContentHandler handler = new DefaultHandler();
            Metadata metadata = new Metadata();
            Parser parser = new Mp3Parser();
            ParseContext parseCtx = new ParseContext();
            parser.parse(input, handler, metadata, parseCtx);
            
            String durationStr = metadata.get("xmpDM:duration");
            if (durationStr != null) {
                double durationInSeconds = Double.parseDouble(durationStr);
                return (int) Math.round(durationInSeconds);
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }
} 
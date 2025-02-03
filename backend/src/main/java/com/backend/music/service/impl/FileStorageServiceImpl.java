package com.backend.music.service.impl;

import com.backend.music.service.FileStorageService;
import com.backend.music.util.FileValidationUtils;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.mp3.Mp3Parser;
import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.ContentHandler;
import org.xml.sax.helpers.DefaultHandler;
import lombok.RequiredArgsConstructor;
import com.mongodb.client.gridfs.model.GridFSFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;
    private final FileValidationUtils fileValidationUtils;

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // For audio files, validate format and size
        if (file.getContentType() != null && file.getContentType().startsWith("audio/")) {
            if (!fileValidationUtils.isValidAudioFile(file)) {
                throw new IllegalArgumentException("Invalid audio file. Must be MP3, WAV, or OGG and less than 15MB");
            }
        }

        String fileName = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());
        try {
            // Store file in GridFS(khdam db layr7ambak)
            return gridFsTemplate.store(
                file.getInputStream(),
                fileName,
                file.getContentType()
            ).toString();
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    @Override
    public Resource load(String fileId) {
        try {
            GridFSFile file = gridFsTemplate.findOne(org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(fileId)
            ));
            
            if (file == null) {
                throw new RuntimeException("File not found: " + fileId);
            }

            return new InputStreamResource(gridFsOperations.getResource(file).getInputStream());
        } catch (IOException ex) {
            throw new RuntimeException("Could not load file: " + fileId, ex);
        }
    }

    @Override
    public void delete(String fileId) {
        try {
            gridFsTemplate.delete(org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(fileId)
            ));
        } catch (Exception ex) {
            throw new RuntimeException("Could not delete file: " + fileId, ex);
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
                return (int) Math.round(Double.parseDouble(durationStr));
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(lastDot) : "";
    }
} 
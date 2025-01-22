package com.backend.music.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Document(collection = "tracks")
public class Track {
    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Artist is required")
    private String artist;

    private Integer duration;
    private String fileUrl;

    @DBRef
    private Album album;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
package com.backend.music.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "songs")
public class Song {
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Artist is required")
    private String artist;
    
    @Min(value = 1, message = "Track number must be greater than 0")
    private Integer trackNumber;
    
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;
    
    private String audioFileId;
    private Integer duration;
    
    @DBRef
    private Album album;
    
    private List<String> categories;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
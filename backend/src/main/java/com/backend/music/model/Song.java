package com.backend.music.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.backend.music.model.enums.Genre;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "songs")
public class Song {
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    @Field(name = "title")
    private String title;
    
    @NotBlank(message = "Artist is required")
    @Field(name = "artist")
    private String artist;
    
    @Field(name = "genre")
    private String genre;
    
    @Min(value = 1, message = "Track number must be greater than 0")
    @Field(name = "track_number")
    private Integer trackNumber;
    
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    @Field(name = "description")
    private String description;
    
    @Field(name = "audio_file_id")
    private String audioFileId;
    
    @Field(name = "image_file_id")
    private String imageFileId;
    
    @Field(name = "duration")
    private Integer duration;
    
    @DBRef(lazy = true)
    private Album album;
    
    @Field(name = "is_favorite")
    @Builder.Default
    private Boolean isFavorite = false;
    
    @Field(name = "created_at")
    private LocalDateTime createdAt;
    
    @Field(name = "updated_at")
    private LocalDateTime updatedAt;
} 
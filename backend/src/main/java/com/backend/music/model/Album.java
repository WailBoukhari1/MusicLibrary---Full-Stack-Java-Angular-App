package com.backend.music.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import com.backend.music.model.enums.Category;
import com.backend.music.model.enums.Genre;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "albums")
public class Album {
    @Id
    private String id;
    
    @Field(name = "title")
    private String title;
    
    @Field(name = "artist")
    private String artist;
    
    @Field(name = "cover_url")
    private String coverUrl;
    
    @Field(name = "genre")
    private Genre genre;
    
    @Field(name = "category")
    private Category category;
    
    @Field(name = "release_date")
    private LocalDateTime releaseDate;
    
    @DBRef(lazy = true)
    private List<Song> songs = new ArrayList<>();
    
    @Field(name = "total_duration")
    private Integer totalDuration;
    
    @Field(name = "total_tracks")
    private Integer totalTracks;
    
    @Field(name = "created_at")
    private LocalDateTime createdAt;
    
    @Field(name = "updated_at")
    private LocalDateTime updatedAt;

    @Field(name = "image_file_id")
    private String imageFileId;

    @Builder.Default
    private Boolean isFavorite = false;

    @Builder.Default
    private List<String> songIds = new ArrayList<>();
}


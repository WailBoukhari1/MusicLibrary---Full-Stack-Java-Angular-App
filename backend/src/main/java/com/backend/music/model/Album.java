package com.backend.music.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.backend.music.model.enums.Category;
import com.backend.music.model.enums.Genre;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Document(collection = "albums")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Album {
    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Artist is required")
    private String artist;

    @Enumerated(EnumType.STRING)
    private Genre genre;
    private String description;
    private LocalDateTime releaseDate;
    private String coverUrl;

    @DBRef
    private List<Song> songs = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Category category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


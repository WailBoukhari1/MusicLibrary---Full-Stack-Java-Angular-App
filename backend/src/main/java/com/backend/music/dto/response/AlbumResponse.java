package com.backend.music.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
public class AlbumResponse {
    private String id;
    private String title;
    private String artist;
    private String imageUrl;
    private LocalDate releaseDate;
    private Category category;
    private Genre genre;
    @Builder.Default
    private List<SongResponse> songs = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
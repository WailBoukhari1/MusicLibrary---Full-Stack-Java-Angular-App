package com.backend.music.dto.response;

import java.util.ArrayList;
import java.util.Date;
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
    private String coverUrl;
    private Date releaseDate;
    private Date createdAt;
    private Date updatedAt;
    private Category category;
    private Genre genre;
    
    @Builder.Default
    private List<SongResponse> songs = new ArrayList<>();
} 
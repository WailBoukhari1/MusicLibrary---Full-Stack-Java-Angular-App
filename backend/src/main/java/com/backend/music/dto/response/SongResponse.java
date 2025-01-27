package com.backend.music.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongResponse {
    private String id;
    private String title;
    private String artist;
    private Integer trackNumber;
    private String description;
    private String audioFileId;
    private String imageFileId;
    private String albumId;
    private String audioUrl;
    private String imageUrl;
    private String albumTitle;
    private String albumArtist;
    private Integer duration;
    private Boolean isFavorite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
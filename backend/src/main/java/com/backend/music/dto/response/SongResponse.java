package com.backend.music.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SongResponse {
    private String id;
    private String title;
    private String artist;
    private Integer trackNumber;
    private String description;
    private String audioFileId;
    private String imageFileId;
    private Integer duration;
    private String albumId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
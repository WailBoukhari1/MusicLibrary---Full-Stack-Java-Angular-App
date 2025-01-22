package com.backend.music.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumResponse {
    private String id;
    private String title;
    private String artist;
    private String imageUrl;
    private Date releaseDate;
    private Date createdAt;
    private Date updatedAt;
} 
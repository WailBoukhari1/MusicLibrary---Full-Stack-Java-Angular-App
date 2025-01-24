package com.backend.music.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.backend.music.model.enums.Category;

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
    private Integer duration;
    private AlbumResponse album;
    
    @Builder.Default
    private List<Category> categories = new ArrayList<>();
    
    private Date createdAt;
    private Date updatedAt;
} 
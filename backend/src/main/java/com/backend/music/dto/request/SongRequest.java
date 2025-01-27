package com.backend.music.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Artist is required")
    private String artist;
    
    @Min(value = 1, message = "Track number must be greater than 0")
    private Integer trackNumber;
    
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;
    
    private String albumId;
    
    private Boolean isFavorite;


    
    private MultipartFile audioFile;
    private MultipartFile imageFile;
} 
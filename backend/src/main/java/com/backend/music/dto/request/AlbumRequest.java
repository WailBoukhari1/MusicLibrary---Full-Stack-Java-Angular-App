package com.backend.music.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Artist is required")
    private String artist;
    
    @NotNull(message = "Release date is required")
    private Date releaseDate;
    
    private MultipartFile imageFile;
} 
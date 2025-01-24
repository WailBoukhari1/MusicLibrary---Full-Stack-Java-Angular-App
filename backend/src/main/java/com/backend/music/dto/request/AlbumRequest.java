package com.backend.music.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.annotation.JsonFormat;

import com.backend.music.model.enums.Category;
import com.backend.music.model.enums.Genre;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Artist is required")
    private String artist;
    
    @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
    private LocalDate releaseDate;
    
    @NotNull(message = "Category is required")
    private Category category;
    
    @NotNull(message = "Genre is required")
    private Genre genre;
    
    private MultipartFile imageFile;
} 
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
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PastOrPresent;

import com.backend.music.model.enums.Category;
import com.backend.music.model.enums.Genre;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;
    
    @NotBlank(message = "Artist is required")
    @Size(min = 2, max = 100, message = "Artist must be between 2 and 100 characters")
    private String artist;
    
    @NotNull(message = "Release date is required")
    @PastOrPresent(message = "Release date cannot be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate releaseDate;
    
    @NotNull(message = "Category is required")
    private Category category;
    
    @NotNull(message = "Genre is required")
    private Genre genre;
    
    private MultipartFile imageFile;
} 
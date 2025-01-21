package com.backend.music.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlbumCreateDTO {
    @NotBlank
    private String titre;
    @NotBlank
    private String artiste;
    @NotNull
    private Integer annee;
} 
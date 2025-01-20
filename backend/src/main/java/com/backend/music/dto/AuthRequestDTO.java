package com.backend.music.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class AuthRequestDTO {
    @NotBlank
    private String login;
    @NotBlank
    private String password;
} 
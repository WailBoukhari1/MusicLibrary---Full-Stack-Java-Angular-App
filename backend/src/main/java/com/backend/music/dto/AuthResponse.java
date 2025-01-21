package com.backend.music.dto;

import java.util.Date;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private boolean success;
    private String message;
    private UserDTO user;
    private List<String> roles;
    private Date expiresAt;
} 
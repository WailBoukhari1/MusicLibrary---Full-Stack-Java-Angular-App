package com.backend.music.dto.response;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String username;
    private List<String> roles;
} 
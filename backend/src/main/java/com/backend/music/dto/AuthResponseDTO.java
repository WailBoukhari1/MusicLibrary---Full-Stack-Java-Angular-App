package com.backend.music.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class AuthResponseDTO {
    private String token;
    private String refreshToken;
    @Builder.Default
    private String type = "Bearer";
    private UserDTO user;
    private List<String> roles;
    private Date expiresAt;

    public static AuthResponseDTO from(String token, UserDTO user, List<String> roles, Date expiresAt) {
        return AuthResponseDTO.builder()
                .token(token)
                .user(user)
                .roles(roles)
                .expiresAt(expiresAt)
                .build();
    }
} 
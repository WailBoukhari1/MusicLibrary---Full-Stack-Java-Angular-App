package com.backend.music.service;

import com.backend.music.dto.AuthRequestDTO;
import com.backend.music.dto.AuthResponseDTO;
import com.backend.music.dto.UserDTO;

public interface AuthService {
    AuthResponseDTO login(AuthRequestDTO request);
    UserDTO register(AuthRequestDTO request);
    boolean validateToken(String token);
    void refreshToken(String token);
} 
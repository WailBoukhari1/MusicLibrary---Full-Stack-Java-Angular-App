package com.backend.music.service;

import com.backend.music.dto.AuthRequestDTO;
import com.backend.music.dto.AuthResponse;
import com.backend.music.dto.LoginRequest;
import com.backend.music.dto.RegisterRequest;
import com.backend.music.dto.UserDTO;

public interface AuthService {
    AuthResponse login(String username, String password);
    UserDTO register(RegisterRequest request);
    boolean validateToken(String token);
    AuthResponse refreshToken(String refreshToken);
    void logout(String token);
} 
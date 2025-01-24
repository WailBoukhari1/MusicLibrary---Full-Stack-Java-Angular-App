package com.backend.music.service;

import com.backend.music.dto.request.LoginRequest;
import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.AuthResponse;
import com.backend.music.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    UserResponse register(RegisterRequest request);
    boolean validateToken(String token);
    AuthResponse refreshToken(String refreshToken);
    void logout(String token);
    String extractUsername(String token);
} 
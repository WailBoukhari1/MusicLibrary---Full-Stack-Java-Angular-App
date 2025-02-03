package com.backend.music.controller;

import com.backend.music.dto.request.LoginRequest;
import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.request.RefreshTokenRequest;
import com.backend.music.dto.response.ApiResponse;
import com.backend.music.dto.response.AuthResponse;
import com.backend.music.dto.response.UserResponse;
import com.backend.music.service.AuthService;
import com.backend.music.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
            .success(true)
            .data(response)
            .build());
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserResponse user = authService.register(request);
            return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .data(user)
                .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.<UserResponse>builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
            .success(true)
            .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestHeader("Authorization") String token) {
        AuthResponse response = authService.refreshToken(token.substring(7));
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
            .success(true)
            .data(response)
            .build());
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestHeader("Authorization") String token) {
        boolean isValid = authService.validateToken(token.substring(7));
        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
            .success(true)
            .data(isValid)
            .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@RequestHeader("Authorization") String token) {
        String username = authService.extractUsername(token.substring(7));
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
            .success(true)
            .data(user)
            .build());
    }
} 
package com.backend.music.controller;

import com.backend.music.dto.AuthRequestDTO;
import com.backend.music.dto.AuthResponseDTO;
import com.backend.music.dto.UserDTO;
import com.backend.music.service.AuthService;
import com.backend.music.service.TokenBlacklistService;
import com.backend.music.security.JwtUtil;
import com.backend.music.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import com.backend.music.service.UserService;
import com.backend.music.dto.RefreshTokenRequest;
import com.backend.music.dto.LoginRequest;
import com.backend.music.dto.AuthResponse;
import com.backend.music.dto.RegisterRequest;
import org.springframework.security.core.AuthenticationException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse authResponse = authService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.<AuthResponse>builder()
                    .success(false)
                    .error("Invalid credentials")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<AuthResponse>builder()
                    .success(false)
                    .error("An error occurred during login")
                    .build());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserDTO user = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.<UserDTO>builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            long expirationTime = jwtUtil.extractExpiration(token).getTime();
            tokenBlacklistService.blacklistToken(token, expirationTime);
            return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
        }
        return ResponseEntity.badRequest()
            .body(ApiResponse.<Void>builder()
                .success(false)
                .error("Invalid token")
                .build());
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = authService.validateToken(token);
            return ResponseEntity.ok(ApiResponse.success("Token validation result", isValid));
        }
        return ResponseEntity.badRequest()
            .body(ApiResponse.<Boolean>builder()
                .success(false)
                .error("Invalid token format")
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            UserDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(ApiResponse.success("Current user details", user));
        }
        return ResponseEntity.badRequest()
            .body(ApiResponse.<UserDTO>builder()
                .success(false)
                .error("Invalid token format")
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                "Token refreshed successfully", 
                authService.refreshToken(request.getRefreshToken())
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.<AuthResponse>builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }
} 
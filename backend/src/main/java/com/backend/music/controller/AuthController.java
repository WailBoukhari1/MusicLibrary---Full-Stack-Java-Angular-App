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
import org.springframework.security.core.AuthenticationException;
import com.backend.music.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody AuthRequestDTO request) {
        try {
            AuthResponseDTO response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.<AuthResponseDTO>builder()
                    .success(false)
                    .error(e.getMessage())
                    .build());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody AuthRequestDTO request) {
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
} 
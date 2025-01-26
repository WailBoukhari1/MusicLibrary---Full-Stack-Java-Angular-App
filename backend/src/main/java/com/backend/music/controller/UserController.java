package com.backend.music.controller;

import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.ApiResponse;
import com.backend.music.dto.response.UserResponse;
import com.backend.music.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@PreAuthorize("hasAuthority('ADMIN')")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.<Page<UserResponse>>builder()
            .success(true)
            .data(userService.getAllUsers(pageable))
            .build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
            .success(true)
            .data(userService.getUserById(id))
            .build());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
            .success(true)
            .data(userService.createUser(request))
            .build());
    }
    
    @PutMapping("/{id}/roles")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRoles(
            @PathVariable String id,
            @RequestBody Set<String> roles) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
            .success(true)
            .data(userService.updateUserRoles(id, roles))
            .build());
    }
    
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
            .success(true)
            .data(userService.toggleUserStatus(id))
            .build());
    }
} 
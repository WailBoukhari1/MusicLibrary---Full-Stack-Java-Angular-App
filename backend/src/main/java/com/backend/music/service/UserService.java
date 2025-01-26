package com.backend.music.service;

import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Set;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    
    UserResponse getUserById(String id);
    
    UserResponse createUser(RegisterRequest request);
    
    UserResponse updateUserRoles(String id, Set<String> roles);
    
    UserResponse getUserByUsername(String username);
    
    UserResponse toggleUserStatus(String id);
} 
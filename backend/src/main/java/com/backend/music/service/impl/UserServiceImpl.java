package com.backend.music.service.impl;

import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.UserResponse;
import com.backend.music.exception.ResourceNotFoundException;
import com.backend.music.mapper.UserMapper;
import com.backend.music.model.Role;
import com.backend.music.model.User;
import com.backend.music.repository.UserRepository;
import com.backend.music.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponseDto);
    }
    
    @Override
    public UserResponse getUserById(String id) {
        return userRepository.findById(id)
                .map(userMapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    @Override
    public UserResponse createUser(RegisterRequest request) {
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userMapper.toResponseDto(userRepository.save(user));
    }
    
    @Override
    public UserResponse updateUserRoles(String id, Set<String> roles) {
        return userRepository.findById(id)
                .map(user -> {
                    Set<Role> newRoles = roles.stream()
                            .map(roleName -> {
                                Role role = new Role();
                                role.setName(roleName);
                                return role;
                            })
                            .collect(Collectors.toSet());
                    user.setRoles(newRoles);
                    return userMapper.toResponseDto(userRepository.save(user));
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Override
    public UserResponse getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .map(userMapper::toResponseDto)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }
} 
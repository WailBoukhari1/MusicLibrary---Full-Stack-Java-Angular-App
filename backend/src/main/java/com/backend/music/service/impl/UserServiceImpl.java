package com.backend.music.service.impl;

import com.backend.music.dto.UserDTO;
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
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toDTO);
    }
    
    @Override
    public UserDTO getUserById(String id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toDTO(userRepository.save(user));
    }
    
    @Override
    public UserDTO updateUserRoles(String id, Set<String> roles) {
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
                    return userMapper.toDTO(userRepository.save(user));
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
    public UserDTO getUserByUsername(String username) {
        return userRepository.findByLogin(username)
            .map(userMapper::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }
} 
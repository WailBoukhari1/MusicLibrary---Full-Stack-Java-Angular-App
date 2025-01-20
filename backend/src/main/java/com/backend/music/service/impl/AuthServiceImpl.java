package com.backend.music.service.impl;

import com.backend.music.dto.AuthRequestDTO;
import com.backend.music.dto.AuthResponseDTO;
import com.backend.music.dto.UserDTO;
import com.backend.music.exception.AuthenticationException;
import com.backend.music.mapper.UserMapper;
import com.backend.music.model.User;
import com.backend.music.model.Role;
import com.backend.music.repository.UserRepository;
import com.backend.music.security.JwtUtil;
import com.backend.music.service.AuthService;
import com.backend.music.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    public AuthResponseDTO login(AuthRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
            );
            
            User user = userRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new AuthenticationException("User not found"));
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            Date expiresAt = jwtUtil.extractExpiration(token);
            
            List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .collect(Collectors.toList());
            
            UserDTO userDTO = userMapper.toDTO(user);
            
            return AuthResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .user(userDTO)
                .roles(roles)
                .expiresAt(expiresAt)
                .build();
                
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new AuthenticationException("Invalid username or password");
        }
    }

    @Override
    public UserDTO register(AuthRequestDTO request) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new AuthenticationException("Username already exists");
        }

        User user = new User();
        user.setLogin(request.getLogin());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role userRole = new Role();
        userRole.setName("USER");
        user.setRoles(new HashSet<>(Collections.singleton(userRole)));
        user.setActive(true);

        return userMapper.toDTO(userRepository.save(user));
    }

    @Override
    public boolean validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userRepository.findByLogin(username)
                .orElseThrow(() -> new AuthenticationException("User not found"));
            return jwtUtil.validateToken(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void refreshToken(String token) {
        throw new UnsupportedOperationException("Token refresh not implemented");
    }
} 
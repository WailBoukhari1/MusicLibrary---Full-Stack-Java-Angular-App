package com.backend.music.service.impl;

import com.backend.music.dto.AuthRequestDTO;
import com.backend.music.dto.AuthResponse;
import com.backend.music.dto.AuthResponseDTO;
import com.backend.music.dto.LoginRequest;
import com.backend.music.dto.UserDTO;
import com.backend.music.dto.RegisterRequest;
import com.backend.music.exception.AuthenticationException;
import com.backend.music.exception.TokenRefreshException;
import com.backend.music.mapper.UserMapper;
import com.backend.music.model.User;
import com.backend.music.model.Role;
import com.backend.music.model.RefreshToken;
import com.backend.music.repository.UserRepository;
import com.backend.music.security.JwtUtil;
import com.backend.music.service.AuthService;
import com.backend.music.service.TokenBlacklistService;
import com.backend.music.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final RefreshTokenService refreshTokenService;
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Override
    public AuthResponse login(String username, String password) {
        try {
            log.debug("Attempting authentication for user: {}", username);
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            String token = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
            log.debug("User authenticated successfully: {}", username);    
            return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .user(userMapper.toDTO(user))
                .roles(user.getRoles().stream()
                    .map(role -> "ROLE_" + role.getName())
                    .collect(Collectors.toList()))
                .expiresAt(jwtUtil.extractExpiration(token))
                .build();
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", username, e);
            throw new AuthenticationException("Invalid username or password") {};
        }
    }

    @Override
    public UserDTO register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AuthenticationException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthenticationException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
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
            UserDetails userDetails = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("User not found"));
            return jwtUtil.validateToken(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken verifiedToken = refreshTokenService.verifyAndRefresh(refreshToken);
        User user = userRepository.findById(verifiedToken.getUserId())
            .orElseThrow(() -> new TokenRefreshException("User not found"));
            
        String jwt = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
            .token(jwt)
            .refreshToken(verifiedToken.getToken())
            .user(userMapper.toDTO(user))
            .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
            .expiresAt(jwtUtil.extractExpiration(jwt))
            .success(true)
            .message("Token refreshed successfully")
            .build();
    }

    @Override
    public void logout(String token) {
        refreshTokenService.revokeRefreshToken(token);
        tokenBlacklistService.blacklistToken(token, jwtUtil.extractExpiration(token).getTime());
    }
} 
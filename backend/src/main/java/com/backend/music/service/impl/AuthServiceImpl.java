package com.backend.music.service.impl;

import com.backend.music.dto.request.LoginRequest;
import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.AuthResponse;
import com.backend.music.dto.response.UserResponse;
import com.backend.music.exception.AuthenticationException;
import com.backend.music.exception.TokenRefreshException;
import com.backend.music.mapper.UserMapper;
import com.backend.music.model.User;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.ArrayList;

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

    private AuthResponse createAuthResponse(User user, String token, String refreshToken) {
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .roles(new ArrayList<>(user.getRoles()))  // Convert Set to List
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            String token = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
            // Store refresh token
            RefreshToken refreshTokenEntity = new RefreshToken();
            refreshTokenEntity.setUserId(user.getId());
            refreshTokenEntity.setToken(refreshToken);
            refreshTokenEntity.setExpiryDate(jwtUtil.extractExpiration(refreshToken).toInstant());
            refreshTokenService.save(refreshTokenEntity);
            
            return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .roles(new ArrayList<>(user.getRoles()))  // Convert Set to List
                .build();
        } catch (AuthenticationException e) {
            throw new AuthenticationException("Invalid username or password");
        }
    }

    @Override
    public UserResponse register(RegisterRequest request) {
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
        user.setRoles(new HashSet<>(Collections.singleton("ADMIN")));
        user.setActive(true);

        return userMapper.toResponseDto(userRepository.save(user));
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
            
        String token = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
            .token(token)
            .refreshToken(verifiedToken.getToken())
            .username(user.getUsername())
            .roles(new ArrayList<>(user.getRoles()))
            .build();
    }
    @Override
    public String extractUsername(String token) {
        return jwtUtil.extractUsername(token);
    }
    @Override
    public void logout(String refreshToken) {
        RefreshToken token = refreshTokenService.findByToken(refreshToken)
            .orElseThrow(() -> new TokenRefreshException("Refresh token not found"));
        refreshTokenService.deleteByToken(refreshToken);
    }
} 
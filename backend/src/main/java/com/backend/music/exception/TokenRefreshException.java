package com.backend.music.exception;

import org.springframework.http.HttpStatus;

public class TokenRefreshException extends CustomException {
    public TokenRefreshException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
} 
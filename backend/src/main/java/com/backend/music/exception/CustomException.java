package com.backend.music.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {
    private final HttpStatus status;
    private final String message;

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.message = message;
        this.status = status;
    }

    public CustomException(String message, Throwable cause) {
        super(message, cause);
        this.message = message;
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
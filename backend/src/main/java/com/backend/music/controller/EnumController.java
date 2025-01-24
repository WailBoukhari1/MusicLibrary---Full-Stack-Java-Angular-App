package com.backend.music.controller;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.music.dto.response.ApiResponse;
import com.backend.music.model.enums.Category;
import com.backend.music.model.enums.Genre;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<Map<String, String>>> getCategories() {
        Map<String, String> categories = Arrays.stream(Category.values())
            .collect(Collectors.toMap(
                Category::name,
                Category::getDisplayName
            ));
        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
            .success(true)
            .data(categories)
            .build());
    }

    @GetMapping("/genres")
    public ResponseEntity<ApiResponse<Map<String, String>>> getGenres() {
        Map<String, String> genres = Arrays.stream(Genre.values())
            .collect(Collectors.toMap(
                Genre::name,
                Genre::getDisplayName
            ));
        return ResponseEntity.ok(ApiResponse.<Map<String, String>>builder()
            .success(true)
            .data(genres)
            .build());
    }
} 
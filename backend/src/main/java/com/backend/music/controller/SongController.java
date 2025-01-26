package com.backend.music.controller;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.ApiResponse;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SongController {
    
    private final SongService songService;
    
    @GetMapping("/songs")
    public ResponseEntity<ApiResponse<Page<SongResponse>>> getAllSongs(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.<Page<SongResponse>>builder()
            .success(true)
            .data(songService.getAllSongs(pageable))
            .build());
    }
    
    @GetMapping("/songs/search")
    public ResponseEntity<ApiResponse<Page<SongResponse>>> searchSongs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String albumId,
            Pageable pageable) {
        Page<SongResponse> result;
        if (title != null) {
            result = songService.searchByTitle(title, pageable);
        } else if (albumId != null) {
            result = songService.getSongsByAlbum(albumId, pageable);
        } else {
            result = songService.getAllSongs(pageable);
        }
        return ResponseEntity.ok(ApiResponse.<Page<SongResponse>>builder()
            .success(true)
            .data(result)
            .build());
    }
    
    @GetMapping("/songs/{id}")
    public ResponseEntity<ApiResponse<SongResponse>> getSongById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<SongResponse>builder()
            .success(true)
            .data(songService.getSongById(id))
            .build());
    }
    
    @GetMapping("/songs/{id}/audio")
    public ResponseEntity<Resource> getAudioFile(@PathVariable String id) {
        Resource audioResource = songService.getAudioFile(id);
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("audio/mpeg"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"audio.mp3\"")
            .body(audioResource);
    }
    
    @PostMapping("/songs")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<SongResponse>> createSong(@Valid @ModelAttribute SongRequest request) {
        return ResponseEntity.ok(ApiResponse.<SongResponse>builder()
            .success(true)
            .data(songService.createSong(request))
            .build());
    }
    
    @PutMapping("/songs/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<SongResponse>> updateSong(
            @PathVariable String id,
            @Valid @ModelAttribute SongRequest request) {
        return ResponseEntity.ok(ApiResponse.<SongResponse>builder()
            .success(true)
            .data(songService.updateSong(id, request))
            .build());
    }
    
    @DeleteMapping("/songs/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
            .success(true)
            .build());
    }
    
    @PostMapping("/songs/{id}/favorite")
    public ResponseEntity<ApiResponse<SongResponse>> toggleFavorite(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<SongResponse>builder()
            .success(true)
            .data(songService.toggleFavorite(id))
            .build());
    }
    
    @GetMapping("/songs/favorites")
    public ResponseEntity<ApiResponse<Page<SongResponse>>> getFavoriteSongs(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.<Page<SongResponse>>builder()
            .success(true)
            .data(songService.getFavoriteSongs(pageable))
            .build());
    }
} 
package com.backend.music.controller;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.dto.response.ApiResponse;
import com.backend.music.service.AlbumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AlbumController {
    
    private final AlbumService albumService;
  
    @GetMapping("/albums")
    public ResponseEntity<ApiResponse<Page<AlbumResponse>>> getAllAlbums(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.<Page<AlbumResponse>>builder()
            .success(true)
            .data(albumService.getAllAlbums(pageable))
            .build());
    }
    
    @GetMapping("/albums/search")
    public ResponseEntity<ApiResponse<Page<AlbumResponse>>> searchAlbums(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String artist,
            @RequestParam(required = false) Integer year,
            Pageable pageable) {
        Page<AlbumResponse> result;
        if (title != null) {
            result = albumService.searchByTitle(title, pageable);
        } else if (artist != null) {
            result = albumService.searchByArtist(artist, pageable);
        } else if (year != null) {
            result = albumService.filterByYear(year, pageable);
        } else {
            result = albumService.getAllAlbums(pageable);
        }
        return ResponseEntity.ok(ApiResponse.<Page<AlbumResponse>>builder()
            .success(true)
            .data(result)
            .build());
    }
    
    @GetMapping("/albums/{id}")
    public ResponseEntity<ApiResponse<AlbumResponse>> getAlbumById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<AlbumResponse>builder()
            .success(true)
            .data(albumService.getAlbumById(id))
            .build());
    }
    
    @PostMapping("/albums")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AlbumResponse>> createAlbum(@Valid @ModelAttribute AlbumRequest request) {
        return ResponseEntity.ok(ApiResponse.<AlbumResponse>builder()
            .success(true)
            .data(albumService.createAlbum(request))
            .build());
    }
    
    @PutMapping("/albums/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AlbumResponse>> updateAlbum(
            @PathVariable String id,
            @Valid @ModelAttribute AlbumRequest request) {
        return ResponseEntity.ok(ApiResponse.<AlbumResponse>builder()
            .success(true)
            .data(albumService.updateAlbum(id, request))
            .build());
    }
    
    @DeleteMapping("/albums/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAlbum(@PathVariable String id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
            .success(true)
            .build());
    }
    
    @PostMapping("/albums/{albumId}/songs/{songId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AlbumResponse>> addSongToAlbum(
            @PathVariable String albumId,
            @PathVariable String songId) {
        return ResponseEntity.ok(ApiResponse.<AlbumResponse>builder()
            .success(true)
            .data(albumService.addSongToAlbum(albumId, songId))
            .build());
    }
} 
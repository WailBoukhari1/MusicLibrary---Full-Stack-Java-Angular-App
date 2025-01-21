package com.backend.music.controller;

import com.backend.music.dto.AlbumDTO;
import com.backend.music.dto.ApiResponse;
import com.backend.music.dto.AlbumCreateDTO;
import com.backend.music.dto.SongDTO;
import com.backend.music.service.AlbumService;
import com.backend.music.service.SongService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AlbumController {
    
    private final AlbumService albumService;
    private final SongService songService;
    
    @GetMapping("/albums")
    public ResponseEntity<Page<AlbumDTO>> getAllAlbums(Pageable pageable) {
        return ResponseEntity.ok(albumService.getAllAlbums(pageable));
    }
    
    @GetMapping("/albums/search")
    public ResponseEntity<Page<AlbumDTO>> searchAlbums(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String artist,
            @RequestParam(required = false) Integer year,
            Pageable pageable) {
        if (title != null) {
            return ResponseEntity.ok(albumService.searchByTitle(title, pageable));
        } else if (artist != null) {
            return ResponseEntity.ok(albumService.searchByArtist(artist, pageable));
        } else if (year != null) {
            return ResponseEntity.ok(albumService.filterByYear(year, pageable));
        }
        return ResponseEntity.ok(albumService.getAllAlbums(pageable));
    }
    
    @GetMapping("/albums/{id}")
    public ResponseEntity<AlbumDTO> getAlbumById(@PathVariable String id) {
        return ResponseEntity.ok(albumService.getAlbumById(id));
    }
    
    @PostMapping("/albums")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AlbumDTO>> createAlbum(@Valid @RequestBody AlbumCreateDTO albumDTO) {
        return ResponseEntity.ok(ApiResponse.success(
            "Album created successfully",
            albumService.createAlbum(albumDTO)
        ));
    }
    
    @PutMapping("/albums/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlbumDTO> updateAlbum(@PathVariable String id, @RequestBody AlbumDTO albumDTO) {
        return ResponseEntity.ok(albumService.updateAlbum(id, albumDTO));
    }
    
    @DeleteMapping("/albums/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAlbum(@PathVariable String id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{albumId}/songs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SongDTO>> addSongToAlbum(
            @PathVariable String albumId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("artist") String artist) {
        
        SongDTO song = songService.uploadSong(file, title, artist, albumId);
        return ResponseEntity.ok(ApiResponse.success(
            "Song added to album successfully",
            song
        ));
    }
} 
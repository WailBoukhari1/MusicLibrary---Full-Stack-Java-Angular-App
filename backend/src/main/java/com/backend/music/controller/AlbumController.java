package com.backend.music.controller;

import com.backend.music.dto.AlbumDTO;
import com.backend.music.service.AlbumService;
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
    public ResponseEntity<AlbumDTO> createAlbum(@RequestBody AlbumDTO albumDTO) {
        return ResponseEntity.ok(albumService.createAlbum(albumDTO));
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
} 
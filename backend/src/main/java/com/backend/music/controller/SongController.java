package com.backend.music.controller;

import com.backend.music.dto.SongDTO;
import com.backend.music.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ContentDisposition;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SongController {
    
    private final SongService songService;
    
    @GetMapping("/songs")
    public ResponseEntity<Page<SongDTO>> getAllSongs(Pageable pageable) {
        return ResponseEntity.ok(songService.getAllSongs(pageable));
    }
    
    @GetMapping("/songs/search")
    public ResponseEntity<Page<SongDTO>> searchSongs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String albumId,
            Pageable pageable) {
        if (title != null) {
            return ResponseEntity.ok(songService.searchByTitle(title, pageable));
        } else if (albumId != null) {
            return ResponseEntity.ok(songService.getSongsByAlbum(albumId, pageable));
        }
        return ResponseEntity.ok(songService.getAllSongs(pageable));
    }
    
    @GetMapping("/songs/{id}")
    public ResponseEntity<SongDTO> getSongById(@PathVariable String id) {
        return ResponseEntity.ok(songService.getSongById(id));
    }
    
    @GetMapping("/songs/audio/{audioFileId}")
    public ResponseEntity<Resource> getAudioFile(@PathVariable String audioFileId) {
        byte[] audioData = songService.getAudioFile(audioFileId);
        ByteArrayResource resource = new ByteArrayResource(audioData);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .contentLength(audioData.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    ContentDisposition.builder("inline")
                        .filename("audio.mp3")
                        .build().toString())
                .body(resource);
    }
    
    @PostMapping(value = "/songs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongDTO> createSong(
            @RequestPart("song") SongDTO songDTO,
            @RequestPart("file") MultipartFile audioFile) {
        String contentType = audioFile.getContentType();
        if (contentType == null || !contentType.startsWith("audio/")) {
            throw new IllegalArgumentException("Invalid file type. Only audio files are allowed.");
        }
        
        return ResponseEntity.ok(songService.createSong(songDTO, audioFile));
    }
    
    @PutMapping("/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongDTO> updateSong(@PathVariable String id, @RequestBody SongDTO songDTO) {
        return ResponseEntity.ok(songService.updateSong(id, songDTO));
    }
    
    @DeleteMapping("/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSong(@PathVariable String id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
} 
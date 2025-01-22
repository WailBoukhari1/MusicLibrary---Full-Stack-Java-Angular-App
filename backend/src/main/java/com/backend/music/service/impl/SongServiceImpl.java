package com.backend.music.service.impl;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.mapper.SongMapper;
import com.backend.music.model.Song;
import com.backend.music.model.Album;
import com.backend.music.repository.SongRepository;
import com.backend.music.service.AlbumService;
import com.backend.music.service.FileStorageService;
import com.backend.music.service.SongService;
import com.backend.music.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.io.Resource;

@Service
@RequiredArgsConstructor
@Transactional
public class SongServiceImpl implements SongService {
    
    private static final Logger logger = LoggerFactory.getLogger(SongServiceImpl.class);
    
    private final SongRepository songRepository;
    private final AlbumService albumService;
    private final FileStorageService fileStorageService;
    private final SongMapper songMapper;
    
    @Override
    public Page<SongResponse> getAllSongs(Pageable pageable) {
        return songRepository.findAll(pageable)
                .map(songMapper::toResponseDto);
    }
    
    @Override
    public Page<SongResponse> searchByTitle(String title, Pageable pageable) {
        return songRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(songMapper::toResponseDto);
    }
    
    @Override
    public Page<SongResponse> getSongsByAlbum(String albumId, Pageable pageable) {
        return songRepository.findByAlbumId(albumId, pageable)
                .map(songMapper::toResponseDto);
    }
    
    @Override
    public SongResponse getSongById(String id) {
        return songRepository.findById(id)
                .map(songMapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }
    
    @Override
    @Transactional
    public SongResponse createSong(SongRequest request) {
        // Store the audio file
        String audioFileId = fileStorageService.storeFile(request.getAudioFile());

        // Create and save the song
        Song song = songMapper.toEntity(request);
        song.setAudioFileId(audioFileId);
        
        // Link to album if provided
        if (request.getAlbumId() != null && !request.getAlbumId().isEmpty()) {
            Album album = albumService.findAlbumById(request.getAlbumId())
                    .orElseThrow(() -> new ResourceNotFoundException("Album not found"));
            song.setAlbum(album);
        }
        
        Song savedSong = songRepository.save(song);
        return songMapper.toResponseDto(savedSong);
    }
    
    @Override
    public SongResponse updateSong(String id, SongRequest request) {
        return songRepository.findById(id)
                .map(song -> {
                    // Update audio file if provided
                    if (request.getAudioFile() != null) {
                        String audioFileId = fileStorageService.storeFile(request.getAudioFile());
                        song.setAudioFileId(audioFileId);
                    }
                    
                    songMapper.updateEntityFromDto(request, song);
                    
                    // Update album reference if changed
                    if (request.getAlbumId() != null && !request.getAlbumId().equals(song.getAlbum().getId())) {
                        Album album = albumService.findAlbumById(request.getAlbumId())
                                .orElseThrow(() -> new ResourceNotFoundException("Album not found"));
                        song.setAlbum(album);
                    }
                    
                    return songMapper.toResponseDto(songRepository.save(song));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }
    
    @Override
    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        
        // Delete audio file
        if (song.getAudioFileId() != null) {
            fileStorageService.deleteFile(song.getAudioFileId());
        }
        
        songRepository.deleteById(id);
    }
    
    @Override
    public Resource getAudioFile(String id) {
        Song song = songRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        return fileStorageService.loadFileAsResource(song.getAudioFileId());
    }
} 
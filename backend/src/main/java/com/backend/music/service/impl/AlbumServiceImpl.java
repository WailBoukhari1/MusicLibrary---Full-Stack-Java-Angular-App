package com.backend.music.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.exception.ResourceNotFoundException;
import com.backend.music.mapper.AlbumMapper;
import com.backend.music.model.Album;
import com.backend.music.model.Song;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.repository.SongRepository;
import com.backend.music.service.AlbumService;
import com.backend.music.service.FileStorageService;

@Service
@Transactional
public class AlbumServiceImpl implements AlbumService {
    
    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final AlbumMapper albumMapper;
    private final FileStorageService fileStorageService;
    
    @Autowired
    public AlbumServiceImpl(
            AlbumRepository albumRepository,
            SongRepository songRepository,
            AlbumMapper albumMapper,
            FileStorageService fileStorageService) {
        this.albumRepository = albumRepository;
        this.songRepository = songRepository;
        this.albumMapper = albumMapper;
        this.fileStorageService = fileStorageService;
    }
    
    @Override
    public Page<AlbumResponse> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable)
                .map(albumMapper::toResponseDto);
    }
    
    @Override
    public Page<AlbumResponse> searchByTitle(String title, Pageable pageable) {
        return albumRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(albumMapper::toResponseDto);
    }
    
    @Override
    public Page<AlbumResponse> searchByArtist(String artist, Pageable pageable) {
        return albumRepository.findByArtistContainingIgnoreCase(artist, pageable)
                .map(albumMapper::toResponseDto);
    }
    
    @Override
    public Page<AlbumResponse> filterByYear(Integer year, Pageable pageable) {
        return albumRepository.findByYear(year, pageable)
                .map(albumMapper::toResponseDto);
    }
    
    @Override
    public AlbumResponse getAlbumById(String id) {
        return albumRepository.findById(id)
                .map(albumMapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id));
    }
    
    @Override
    public Optional<Album> findAlbumById(String id) {
        return albumRepository.findById(id);
    }
    
    @Override
    @Transactional
    public AlbumResponse createAlbum(AlbumRequest request) {
        Album album = albumMapper.toEntity(request);
        
        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            String fileName = fileStorageService.storeFile(request.getImageFile());
            album.setCoverUrl(fileName);
        } else {
            album.setCoverUrl("default-album.jpg");  // Set default image if no image provided
        }
        
        Album savedAlbum = albumRepository.save(album);
        return albumMapper.toResponseDto(savedAlbum);
    }
    
    @Override
    @Transactional
    public AlbumResponse updateAlbum(String id, AlbumRequest request) {
        return albumRepository.findById(id)
                .map(album -> {
                    if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
                        if (album.getCoverUrl() != null && !album.getCoverUrl().equals("default-album.jpg")) {
                            fileStorageService.deleteFile(album.getCoverUrl());
                        }
                        String fileName = fileStorageService.storeFile(request.getImageFile());
                        album.setCoverUrl(fileName);
                    }
                    
                    albumMapper.updateEntityFromDto(request, album);
                    
                    // Ensure coverUrl is never null
                    if (album.getCoverUrl() == null) {
                        album.setCoverUrl("default-album.jpg");
                    }
                    
                    return albumMapper.toResponseDto(albumRepository.save(album));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id));
    }
    
    @Override
    @Transactional
    public void deleteAlbum(String id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id));
        
        if (album.getCoverUrl() != null) {
            fileStorageService.deleteFile(album.getCoverUrl());
        }
        
        albumRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public AlbumResponse addSongToAlbum(String albumId, String songId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + albumId));
        
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));
        
        song.setAlbum(album);
        album.getSongs().add(song);
        
        songRepository.save(song);
        Album savedAlbum = albumRepository.save(album);
        
        return albumMapper.toResponseDto(savedAlbum);
    }
} 
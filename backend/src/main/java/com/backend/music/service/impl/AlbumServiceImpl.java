package com.backend.music.service.impl;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.mapper.AlbumMapper;
import com.backend.music.model.Album;
import com.backend.music.model.Track;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.repository.TrackRepository;
import com.backend.music.service.AlbumService;
import com.backend.music.service.FileStorageService;
import com.backend.music.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AlbumServiceImpl implements AlbumService {
    
    private final AlbumRepository albumRepository;
    private final TrackRepository trackRepository;
    private final AlbumMapper albumMapper;
    private final FileStorageService fileStorageService;
    
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
    @Transactional
    public AlbumResponse createAlbum(AlbumRequest request) {
        String coverUrl = null;
        if (request.getImageFile() != null) {
            coverUrl = fileStorageService.storeFile(request.getImageFile());
        }
        
        Album album = albumMapper.toEntity(request);
        album.setCoverUrl(coverUrl);
        
        Album savedAlbum = albumRepository.save(album);
        return albumMapper.toResponseDto(savedAlbum);
    }
    
    @Override
    @Transactional
    public AlbumResponse updateAlbum(String id, AlbumRequest request) {
        return albumRepository.findById(id)
                .map(album -> {
                    if (request.getImageFile() != null) {
                        String coverUrl = fileStorageService.storeFile(request.getImageFile());
                        album.setCoverUrl(coverUrl);
                    }
                    
                    albumMapper.updateEntityFromDto(request, album);
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
    public AlbumResponse addTrackToAlbum(String albumId, String trackId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + albumId));
        
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new ResourceNotFoundException("Track not found with id: " + trackId));
        
        track.setAlbum(album);
        album.getTracks().add(track);
        
        trackRepository.save(track);
        Album savedAlbum = albumRepository.save(album);
        
        return albumMapper.toResponseDto(savedAlbum);
    }
} 
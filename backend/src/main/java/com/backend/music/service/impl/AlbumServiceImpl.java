package com.backend.music.service.impl;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.mapper.AlbumMapper;
import com.backend.music.mapper.SongMapper;
import com.backend.music.model.Album;
import com.backend.music.model.Song;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.repository.SongRepository;
import com.backend.music.service.AlbumService;
import com.backend.music.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;
    private final AlbumMapper albumMapper;
    private final SongMapper songMapper;
    private final FileStorageService fileStorageService;

    @Override
    public Page<AlbumResponse> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable)
            .map(album -> {
                if (album.getSongs() == null || album.getSongs().isEmpty()) {
                    album.setSongs(new ArrayList<>());
                }
                return albumMapper.toResponse(album);
            });
    }

    @Override
    public Page<AlbumResponse> searchByTitle(String title, Pageable pageable) {
        return albumRepository.findByTitleContainingIgnoreCase(title, pageable)
            .map(albumMapper::toResponse);
    }

    @Override
    public Page<AlbumResponse> searchByArtist(String artist, Pageable pageable) {
        return albumRepository.findByArtistContainingIgnoreCase(artist, pageable)
            .map(albumMapper::toResponse);
    }

    @Override
    public Page<AlbumResponse> filterByYear(Integer year, Pageable pageable) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        return albumRepository.findByReleaseDateBetween(startOfYear, endOfYear, pageable)
            .map(albumMapper::toResponse);
    }

    @Override
    public AlbumResponse getAlbumById(String id) {
        Album album = albumRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Album not found"));
            
        if (album.getSongs() == null || album.getSongs().isEmpty()) {
            album.setSongs(new ArrayList<>());
        }
        
        return albumMapper.toResponse(album);
    }

    @Override
    public Optional<Album> findAlbumById(String id) {
        return albumRepository.findById(id);
    }

    @Override
    @Transactional
    public AlbumResponse createAlbum(AlbumRequest request) {
        Album album = albumMapper.toEntity(request);
        
        if (request.getImageFile() != null) {
            String imageFileId = fileStorageService.store(request.getImageFile());
            album.setCoverUrl(imageFileId);
        }
        
        album.setSongs(new ArrayList<>());
        album.setReleaseDate(request.getReleaseDate().atStartOfDay());
        album.setCreatedAt(LocalDateTime.now());
        album.setUpdatedAt(LocalDateTime.now());
        
        Album savedAlbum = albumRepository.save(album);
        AlbumResponse response = albumMapper.toResponse(savedAlbum);
        response.setSongs(new ArrayList<>()); // Initialize empty songs list
        return response;
    }

    @Override
    @Transactional
    public AlbumResponse updateAlbum(String id, AlbumRequest request) {
        Album album = albumRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Album not found"));
            
        albumMapper.updateEntityFromRequest(request, album);
        
        if (request.getImageFile() != null) {
            if (album.getCoverUrl() != null) {
                fileStorageService.delete(album.getCoverUrl());
            }
            String imageFileId = fileStorageService.store(request.getImageFile());
            album.setCoverUrl(imageFileId);
        }
        
        album.setUpdatedAt(LocalDateTime.now());
        
        return albumMapper.toResponse(albumRepository.save(album));
    }

    @Override
    @Transactional
    public void deleteAlbum(String id) {
        Album album = albumRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Album not found"));
            
        if (album.getCoverUrl() != null) {
            fileStorageService.delete(album.getCoverUrl());
        }
        
        albumRepository.delete(album);
    }

    @Override
    @Transactional
    public AlbumResponse addSongToAlbum(String albumId, String songId) {
        Album album = albumRepository.findById(albumId)
            .orElseThrow(() -> new RuntimeException("Album not found"));
        
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new RuntimeException("Song not found"));
            
        if (!album.getSongs().contains(song)) {
            album.getSongs().add(song);
            song.setAlbum(album);
            
            songRepository.save(song);
            album = albumRepository.save(album);
        }
        
        AlbumResponse response = albumMapper.toResponse(album);
        response.setSongs(songMapper.toResponseList(album.getSongs()));
        return response;
    }
}

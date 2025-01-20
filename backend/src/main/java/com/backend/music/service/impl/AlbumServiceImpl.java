package com.backend.music.service.impl;

import com.backend.music.dto.AlbumDTO;
import com.backend.music.mapper.AlbumMapper;
import com.backend.music.model.Album;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.service.AlbumService;
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
    private final AlbumMapper albumMapper;
    
    @Override
    public Page<AlbumDTO> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable)
                .map(albumMapper::toDto);
    }
    
    @Override
    public Page<AlbumDTO> searchByTitle(String title, Pageable pageable) {
        return albumRepository.findByTitreContainingIgnoreCase(title, pageable)
                .map(albumMapper::toDto);
    }
    
    @Override
    public Page<AlbumDTO> searchByArtist(String artist, Pageable pageable) {
        return albumRepository.findByArtisteContainingIgnoreCase(artist, pageable)
                .map(albumMapper::toDto);
    }
    
    @Override
    public Page<AlbumDTO> filterByYear(Integer year, Pageable pageable) {
        return albumRepository.findByAnnee(year, pageable)
                .map(albumMapper::toDto);
    }
    
    @Override
    public AlbumDTO getAlbumById(String id) {
        return albumRepository.findById(id)
                .map(albumMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id));
    }
    
    @Override
    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        Album album = albumMapper.toEntity(albumDTO);
        Album savedAlbum = albumRepository.save(album);
        return albumMapper.toDto(savedAlbum);
    }
    
    @Override
    public AlbumDTO updateAlbum(String id, AlbumDTO albumDTO) {
        return albumRepository.findById(id)
                .map(album -> {
                    albumMapper.updateEntityFromDto(albumDTO, album);
                    return albumMapper.toDto(albumRepository.save(album));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id));
    }
    
    @Override
    public void deleteAlbum(String id) {
        if (!albumRepository.existsById(id)) {
            throw new ResourceNotFoundException("Album not found with id: " + id);
        }
        albumRepository.deleteById(id);
    }
} 
package com.backend.music.service;

import com.backend.music.dto.AlbumDTO;
import com.backend.music.mapper.AlbumMapper;
import com.backend.music.model.Album;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.service.impl.AlbumServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private AlbumMapper albumMapper;

    @InjectMocks
    private AlbumServiceImpl albumService;

    @Test
    void getAllAlbums_ShouldReturnPageOfAlbumDTOs() {
        // Arrange
        Album album = new Album();
        AlbumDTO albumDTO = new AlbumDTO();
        Page<Album> albumPage = new PageImpl<>(List.of(album));
        
        when(albumRepository.findAll(any(Pageable.class))).thenReturn(albumPage);
        when(albumMapper.toDto(album)).thenReturn(albumDTO);

        // Act
        Page<AlbumDTO> result = albumService.getAllAlbums(Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }
} 
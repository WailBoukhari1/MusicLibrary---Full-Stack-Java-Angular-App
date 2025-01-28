package com.backend.music.service;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.model.Album;
import com.backend.music.model.enums.Category;
import com.backend.music.model.enums.Genre;
import com.backend.music.repository.AlbumRepository;
import com.backend.music.repository.SongRepository;
import com.backend.music.mapper.AlbumMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.backend.music.service.impl.AlbumServiceImpl;

@ExtendWith(MockitoExtension.class)
public class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private AlbumMapper albumMapper;

    @Mock
    private SongRepository songRepository;

    @InjectMocks
    private AlbumServiceImpl albumService;

    private Album testAlbum;
    private AlbumRequest albumRequest;
    private MultipartFile imageFile;

    private AlbumResponse albumResponse;

    @BeforeEach
    void setUp() {
        testAlbum = Album.builder()
                .id("1")
                .title("Test Album")
                .artist("Test Artist")
                .releaseDate(LocalDateTime.now())
                .category(Category.EP)
                .genre(Genre.ROCK)
                .coverUrl("image123")
                .build();

        imageFile = new MockMultipartFile(
                "image",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        albumRequest = AlbumRequest.builder()
                .title("Test Album")
                .artist("Test Artist")
                .releaseDate(LocalDate.now())
                .category(Category.EP)
                .genre(Genre.ROCK)
                .imageFile(imageFile)
                .build();

        albumResponse = AlbumResponse.builder()
                .id("1")
                .title("Test Album")
                .artist("Test Artist")
                .build();
    }

    @Test
    void getAllAlbumsSuccess() {
        // Arrange
        Page<Album> albumPage = new PageImpl<>(List.of(testAlbum));
        when(albumRepository.findAll(any(Pageable.class))).thenReturn(albumPage);
        when(albumMapper.toResponse(any(Album.class))).thenReturn(albumResponse);

        // Act
        Page<AlbumResponse> result = albumService.getAllAlbums(Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testAlbum.getTitle(), result.getContent().get(0).getTitle());
    }

    @Test
    void createAlbumSuccess() {
        // Arrange
        when(fileStorageService.store(any(MultipartFile.class))).thenReturn("newImage123");
        when(albumRepository.save(any(Album.class))).thenReturn(testAlbum);
        when(albumMapper.toEntity(any(AlbumRequest.class))).thenReturn(testAlbum);
        when(albumMapper.toResponse(any(Album.class))).thenReturn(albumResponse);

        // Act
        AlbumResponse result = albumService.createAlbum(albumRequest);

        // Assert
        assertNotNull(result);
        assertEquals(albumRequest.getTitle(), result.getTitle());
        assertEquals(albumRequest.getArtist(), result.getArtist());
        verify(fileStorageService).store(any(MultipartFile.class));
    }

    @Test
    void getAlbumByIdSuccess() {
        // Arrange
        when(albumRepository.findById("1")).thenReturn(Optional.of(testAlbum));
        when(albumMapper.toResponse(any(Album.class))).thenReturn(albumResponse);

        // Act
        AlbumResponse result = albumService.getAlbumById("1");

        // Assert
        assertNotNull(result);
        assertEquals(testAlbum.getId(), result.getId());
        assertEquals(testAlbum.getTitle(), result.getTitle());
    }

    @Test
    void deleteAlbumSuccess() {
        // Arrange
        when(albumRepository.findById("1")).thenReturn(Optional.of(testAlbum));
        doNothing().when(albumRepository).delete(any(Album.class));
        doNothing().when(fileStorageService).delete(anyString());
        doNothing().when(songRepository).deleteByAlbumId(anyString());

        // Act & Assert
        assertDoesNotThrow(() -> albumService.deleteAlbum("1"));
        verify(albumRepository).delete(testAlbum);
        verify(fileStorageService).delete(testAlbum.getCoverUrl());
        verify(songRepository).deleteByAlbumId(testAlbum.getId());
    }

    @Test
    void searchByTitleSuccess() {
        // Arrange
        Page<Album> albumPage = new PageImpl<>(List.of(testAlbum));
        when(albumRepository.findByTitleContainingIgnoreCase(anyString(), any(Pageable.class)))
                .thenReturn(albumPage);
        when(albumMapper.toResponse(any(Album.class))).thenReturn(albumResponse);

        // Act
        Page<AlbumResponse> result = albumService.searchByTitle("Test", Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testAlbum.getTitle(), result.getContent().get(0).getTitle());
    }
} 
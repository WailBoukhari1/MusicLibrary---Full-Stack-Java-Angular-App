package com.backend.music.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.model.Album;
import com.backend.music.model.Song;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    imports = LocalDateTime.class
)
public interface AlbumMapper {
    
    @Mapping(target = "imageFile", ignore = true)
    AlbumRequest toRequestDto(Album album);
    
    @Mapping(target = "songs", ignore = true)
    @Mapping(target = "coverUrl", source = "coverUrl")
    AlbumResponse toResponseDto(Album album);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "songs", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "releaseDate", expression = "java(request.getReleaseDate() != null ? request.getReleaseDate().atStartOfDay() : null)")
    Album toEntity(AlbumRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "songs", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "releaseDate", expression = "java(request.getReleaseDate() != null ? request.getReleaseDate().atStartOfDay() : album.getReleaseDate())")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(AlbumRequest request, @MappingTarget Album album);

    default List<String> mapSongs(List<Song> songs) {
        if (songs == null) return new ArrayList<>();
        return songs.stream()
            .map(Song::getId)
            .collect(Collectors.toList());
    }
} 
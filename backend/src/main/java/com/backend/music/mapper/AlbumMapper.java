package com.backend.music.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.model.Album;
import com.backend.music.model.Track;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AlbumMapper {
    
    @Mapping(target = "imageFile", ignore = true)
    AlbumRequest toRequestDto(Album album);
    
    AlbumResponse toResponseDto(Album album);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tracks", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Album toEntity(AlbumRequest albumRequest);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tracks", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(AlbumRequest albumRequest, @MappingTarget Album album);

    default List<Long> mapTracks(List<Track> tracks) {
        if (tracks == null) return new ArrayList<>();
        return tracks.stream()
            .map(Track::getId)
            .collect(Collectors.toList());
    }
} 
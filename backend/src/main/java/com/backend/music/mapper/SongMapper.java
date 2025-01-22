package com.backend.music.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.backend.music.dto.request.SongRequest;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.dto.response.CategoryResponse;
import com.backend.music.model.Song;

@Mapper(
    componentModel = "spring", 
    uses = {AlbumMapper.class},
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface SongMapper {
    
    @Mapping(target = "audioFile", ignore = true)
    @Mapping(target = "categoryIds", source = "categories")
    SongRequest toRequestDto(Song song);
    
    @Mapping(source = "album", target = "album")
    @Mapping(source = "categories", target = "categories", qualifiedByName = "categoriesToDTOs")
    SongResponse toResponseDto(Song song);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "audioFileId", ignore = true)
    @Mapping(target = "album", ignore = true)
    @Mapping(target = "categories", source = "categoryIds")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Song toEntity(SongRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "audioFileId", ignore = true)
    @Mapping(target = "album", ignore = true)
    @Mapping(target = "categories", source = "categoryIds")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(SongRequest request, @MappingTarget Song entity);

    @org.mapstruct.Named("categoriesToDTOs")
    default List<CategoryResponse> categoriesToDTOs(List<String> categoryIds) {
        if (categoryIds == null) return new ArrayList<>();
        return categoryIds.stream()
            .map(id -> CategoryResponse.builder()
                .id(id)
                .build())
            .collect(Collectors.toList());
    }
} 
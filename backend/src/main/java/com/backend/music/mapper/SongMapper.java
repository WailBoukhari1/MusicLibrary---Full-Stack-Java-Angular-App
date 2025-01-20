package com.backend.music.mapper;

import com.backend.music.dto.SongDTO;
import com.backend.music.model.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SongMapper {
    
    @Mapping(target = "albumId", source = "album.id")
    SongDTO toDto(Song song);
    
    @Mapping(target = "album", ignore = true)
    Song toEntity(SongDTO songDTO);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "album", ignore = true)
    void updateEntityFromDto(SongDTO songDTO, @MappingTarget Song song);
} 
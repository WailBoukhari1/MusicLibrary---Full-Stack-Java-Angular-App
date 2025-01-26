package com.backend.music.mapper;

import java.util.List;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.backend.music.dto.request.AlbumRequest;
import com.backend.music.dto.response.AlbumResponse;
import com.backend.music.dto.response.SongResponse;
import com.backend.music.model.Album;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {SongMapper.class}
)
public abstract class AlbumMapper {
    
    @Autowired
    protected SongMapper songMapper;
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "songs", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "totalDuration", ignore = true)
    @Mapping(target = "totalTracks", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isFavorite", ignore = true)
    public abstract Album toEntity(AlbumRequest request);
    
    @Mapping(target = "imageUrl", source = "coverUrl")
    @Mapping(target = "songs", expression = "java(songMapper.toResponseList(album.getSongs()))")
    public abstract AlbumResponse toResponse(Album album);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "songs", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "totalDuration", ignore = true)
    @Mapping(target = "totalTracks", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isFavorite", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateEntityFromRequest(AlbumRequest request, @MappingTarget Album album);
} 
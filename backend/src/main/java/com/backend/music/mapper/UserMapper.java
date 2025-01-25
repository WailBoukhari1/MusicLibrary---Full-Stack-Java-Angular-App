package com.backend.music.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.UserResponse;
import com.backend.music.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponseDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "roles", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateEntityFromDto(RegisterRequest request, @MappingTarget User user);
} 
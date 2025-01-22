package com.backend.music.mapper;

import com.backend.music.dto.request.RegisterRequest;
import com.backend.music.dto.response.UserResponse;
import com.backend.music.model.User;
import com.backend.music.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {
    
    @Mapping(target = "roles", source = "roles", qualifiedByName = "rolesToStrings")
    UserResponse toResponseDto(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "active", constant = "true")
    User toEntity(RegisterRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateEntityFromDto(RegisterRequest request, @MappingTarget User user);

    @Named("rolesToStrings")
    default Set<String> rolesToStrings(Set<Role> roles) {
        if (roles == null) return Set.of();
        return roles.stream()
                .map(role -> role.getName().replace("ROLE_", ""))
                .collect(Collectors.toSet());
    }

    @Named("stringsToRoles")
    default Set<Role> stringsToRoles(Set<String> roleNames) {
        if (roleNames == null) return Set.of();
        return roleNames.stream()
            .map(name -> {
                Role role = new Role();
                role.setName("ROLE_" + name.toUpperCase());
                return role;
            })
            .collect(Collectors.toSet());
    }
} 
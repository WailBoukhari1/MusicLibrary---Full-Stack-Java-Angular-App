package com.backend.music.mapper;

import com.backend.music.dto.UserDTO;
import com.backend.music.model.User;
import com.backend.music.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "roles", source = "roles", qualifiedByName = "rolesToStrings")
    UserDTO toDTO(User user);
    
    @Mapping(target = "roles", source = "roles", qualifiedByName = "stringsToRoles")
    User toEntity(UserDTO userDTO);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateEntityFromDto(UserDTO userDTO, @MappingTarget User user);

    @Named("rolesToStrings")
    default Set<String> rolesToStrings(Set<Role> roles) {
        return roles.stream()
                .map(role -> role.getName().replace("ROLE_", ""))
                .collect(Collectors.toSet());
    }

    @Named("stringsToRoles")
    default Set<Role> stringsToRoles(Set<String> roleNames) {
        return roleNames.stream()
            .map(name -> {
                Role role = new Role();
                role.setName(name);
                return role;
            })
            .collect(Collectors.toSet());
    }
} 
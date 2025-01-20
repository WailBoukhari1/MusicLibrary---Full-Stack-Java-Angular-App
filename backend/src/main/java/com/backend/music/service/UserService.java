package com.backend.music.service;

import com.backend.music.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Set;

public interface UserService {
    Page<UserDTO> getAllUsers(Pageable pageable);
    UserDTO getUserById(String id);
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUserRoles(String id, Set<String> roles);
    void deleteUser(String id);
    UserDTO getUserByUsername(String username);
} 
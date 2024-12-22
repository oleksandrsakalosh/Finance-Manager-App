package com.example.personalfinancemanager.controller;

import com.example.personalfinancemanager.dto.AuthResponse;
import com.example.personalfinancemanager.dto.UserDTO;
import com.example.personalfinancemanager.model.User;
import com.example.personalfinancemanager.repository.UserRepository;
import com.example.personalfinancemanager.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserRepository userRepository;
    private JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getUser(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserDTO userDto = new UserDTO();
        userDto.setUserId(user.getUserId());
        userDto.setUsername(user.getUsername());
        userDto.setCurrency(user.getCurrency());

        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        if (!user.getPassword().equals(userDTO.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        user.setPassword(userDTO.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthResponse(token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO registerRequest) {
        User user = userRepository.findByUsername(registerRequest.getUsername());

        if (user != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }

        user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody UserDTO userDTO, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findByUsername(userDTO.getUsername());

        if (user != null && user.getUserId() != userId) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }

        user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setCurrency(userDTO.getCurrency());
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @DeleteMapping
    public ResponseEntity<?> delete(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }
}

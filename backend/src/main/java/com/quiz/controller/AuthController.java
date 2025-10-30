package com.quiz.controller;

import com.quiz.dto.AuthRequest;
import com.quiz.model.User;
import com.quiz.model.UserRole;
import com.quiz.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/register/student")
    public ResponseEntity<User> registerStudent(@RequestBody AuthRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRoles(Set.of(UserRole.STUDENT));
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/register/instructor")
    public ResponseEntity<User> registerInstructor(@RequestBody AuthRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRoles(Set.of(UserRole.INSTRUCTOR));
        return ResponseEntity.ok(authService.register(user));
    }
}
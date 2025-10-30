package com.quiz.controller;

import com.quiz.dto.QuizRequest;
import com.quiz.model.Quiz;
import com.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(
            @RequestBody QuizRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(quizService.createQuiz(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Quiz>> getActiveQuizzes() {
        return ResponseEntity.ok(quizService.getActiveQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateQuiz(@PathVariable Long id) {
        quizService.activateQuiz(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateQuiz(@PathVariable Long id) {
        quizService.deactivateQuiz(id);
        return ResponseEntity.ok().build();
    }
}
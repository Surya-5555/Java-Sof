package com.quiz.controller;

import com.quiz.model.QuizAttempt;
import com.quiz.service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempts")
@RequiredArgsConstructor
public class QuizAttemptController {
    private final QuizAttemptService quizAttemptService;

    @PostMapping("/{quizId}/start")
    public ResponseEntity<QuizAttempt> startQuiz(
            @PathVariable Long quizId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(quizAttemptService.startQuiz(quizId, userDetails.getUsername()));
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @PathVariable Long attemptId,
            @RequestBody List<Integer> answers) {
        return ResponseEntity.ok(quizAttemptService.submitQuiz(attemptId, answers));
    }

    @GetMapping("/{quizId}/leaderboard")
    public ResponseEntity<List<QuizAttempt>> getLeaderboard(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizAttemptService.getLeaderboard(quizId));
    }
}
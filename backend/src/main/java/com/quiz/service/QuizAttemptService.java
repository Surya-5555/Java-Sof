package com.quiz.service;

import com.quiz.model.Quiz;
import com.quiz.model.QuizAttempt;
import com.quiz.model.User;
import com.quiz.repository.QuizAttemptRepository;
import com.quiz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    public QuizAttempt startQuiz(Long quizId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user has already attempted this quiz
        if (!quizAttemptRepository.findByUserIdAndQuizId(user.getId(), quizId).isEmpty()) {
            throw new RuntimeException("Quiz already attempted");
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(new Quiz());
        attempt.getQuiz().setId(quizId);
        attempt.setStartTime(LocalDateTime.now());
        return quizAttemptRepository.save(attempt);
    }

    public QuizAttempt submitQuiz(Long attemptId, List<Integer> answers) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.isCompleted()) {
            throw new RuntimeException("Quiz already submitted");
        }

        // Calculate score
        int score = 0;
        List<Integer> correctAnswers = attempt.getQuiz().getQuestions().stream()
                .map(q -> q.getCorrectOption())
                .toList();

        for (int i = 0; i < answers.size(); i++) {
            if (i < correctAnswers.size() && answers.get(i).equals(correctAnswers.get(i))) {
                score += attempt.getQuiz().getQuestions().get(i).getPoints();
            }
        }

        attempt.setScore(score);
        attempt.setSubmitTime(LocalDateTime.now());
        attempt.setTimeSpent((int) java.time.Duration.between(attempt.getStartTime(), attempt.getSubmitTime()).getSeconds());
        attempt.setCompleted(true);

        return quizAttemptRepository.save(attempt);
    }

    public List<QuizAttempt> getLeaderboard(Long quizId) {
        return quizAttemptRepository.findByQuizIdOrderByScoreDesc(quizId);
    }
}
package com.quiz.repository;

import com.quiz.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizIdOrderByScoreDesc(Long quizId);
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);
}
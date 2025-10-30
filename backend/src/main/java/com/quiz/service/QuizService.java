package com.quiz.service;

import com.quiz.dto.QuizRequest;
import com.quiz.model.Question;
import com.quiz.model.Quiz;
import com.quiz.model.User;
import com.quiz.repository.QuizRepository;
import com.quiz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    @Transactional
    public Quiz createQuiz(QuizRequest request, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setCreator(creator);

        List<Question> questions = request.getQuestions().stream()
                .map(dto -> {
                    Question question = new Question();
                    question.setQuestionText(dto.getQuestionText());
                    question.setOptions(dto.getOptions());
                    question.setCorrectOption(dto.getCorrectOption());
                    question.setPoints(dto.getPoints());
                    question.setQuiz(quiz);
                    return question;
                })
                .collect(Collectors.toList());

        quiz.setQuestions(questions);
        return quizRepository.save(quiz);
    }

    public List<Quiz> getActiveQuizzes() {
        return quizRepository.findByIsActiveTrue();
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public void activateQuiz(Long id) {
        Quiz quiz = getQuizById(id);
        quiz.setActive(true);
        quizRepository.save(quiz);
    }

    public void deactivateQuiz(Long id) {
        Quiz quiz = getQuizById(id);
        quiz.setActive(false);
        quizRepository.save(quiz);
    }
}
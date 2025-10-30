package com.quiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizRequest {
    private String title;
    private String description;
    private Integer timeLimit;
    private List<QuestionDTO> questions;
}
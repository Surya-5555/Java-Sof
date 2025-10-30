package com.quiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionDTO {
    private String questionText;
    private List<String> options;
    private Integer correctOption;
    private Integer points;
}
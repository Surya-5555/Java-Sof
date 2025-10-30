package com.quiz.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String questionText;
    
    @ElementCollection
    private List<String> options = new ArrayList<>();
    
    private Integer correctOption;
    
    private Integer points = 1;
    
    @ManyToOne
    private Quiz quiz;
}
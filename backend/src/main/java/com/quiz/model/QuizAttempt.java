package com.quiz.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Quiz quiz;
    
    private Integer score;
    
    private LocalDateTime startTime;
    
    private LocalDateTime submitTime;
    
    private Integer timeSpent; // in seconds
    
    @Column(nullable = false)
    private boolean completed = false;
}
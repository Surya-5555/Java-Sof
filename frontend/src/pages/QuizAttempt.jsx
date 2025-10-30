import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  LinearProgress,
} from '@mui/material';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
        startQuiz();
      } catch (error) {
        setError('Failed to fetch quiz');
      }
    };

    fetchQuiz();
  }, [id, token]);

  useEffect(() => {
    if (quiz && timeLeft === null) {
      setTimeLeft(quiz.timeLimit * 60);
    }

    if (timeLeft === 0) {
      handleSubmit();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeLeft]);

  const startQuiz = async () => {
    try {
      const response = await api.post(`/quiz-attempts/${id}/start`, {});
      setAttemptId(response.data.id);
    } catch (error) {
      setError('Failed to start quiz');
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/quiz-attempts/${attemptId}/submit`, answers);
      const attempt = response.data; // expect { id, score, timeSpent, ... }
      navigate(`/result/${id}`, { state: { score: attempt.score, timeSpent: attempt.timeSpent } });
    } catch (error) {
      setError('Failed to submit quiz');
    }
  };

  if (!quiz) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {quiz.title}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          Time Remaining: {formatTime(timeLeft)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(timeLeft / (quiz.timeLimit * 60)) * 100}
          sx={{ mb: 3 }}
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {quiz.questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '2rem' }}>
            <Typography variant="h6">
              {index + 1}. {question.questionText}
            </Typography>
            <RadioGroup
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              {question.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={optionIndex}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </div>
        ))}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
          disabled={answers.includes(null)}
        >
          Submit Quiz
        </Button>
      </Paper>
    </Container>
  );
};

export default QuizAttempt;
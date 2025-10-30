import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const QuizCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleAddQuestion = () => {
    if (!currentQuestion || options.some(opt => !opt) || !correctOption) {
      setError('Please fill all question fields');
      return;
    }

    const newQuestion = {
      questionText: currentQuestion,
      options: [...options],
      correctOption: parseInt(correctOption) - 1,
      points: 1
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOption('');
    setError('');
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    try {
      const quizData = {
        title,
        description,
        timeLimit: parseInt(timeLimit),
        questions
      };

      const createRes = await api.post('/quizzes', quizData);
      const created = createRes.data;
      if (created?.id) {
        try {
          await api.put(`/quizzes/${created.id}/activate`);
        } catch (_e) {
          // ignore activation errors; user can activate later
        }
      }

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create quiz');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Quiz
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={2}
            required
          />
          <TextField
            fullWidth
            label="Time Limit (minutes)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            margin="normal"
            required
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Add Questions
          </Typography>

          <TextField
            fullWidth
            label="Question"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            margin="normal"
          />

          {options.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              margin="normal"
            />
          ))}

          <TextField
            fullWidth
            label="Correct Option (1-4)"
            type="number"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            margin="normal"
            InputProps={{ inputProps: { min: 1, max: 4 } }}
          />

          <Button
            variant="contained"
            onClick={handleAddQuestion}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Add Question
          </Button>

          <List sx={{ mt: 2 }}>
            {questions.map((question, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={question.questionText}
                  secondary={`Options: ${question.options.join(', ')}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3 }}
            disabled={questions.length === 0}
          >
            Create Quiz
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default QuizCreate;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await api.get('/quizzes');
        setQuizzes(response.data || []);
      } catch (_error) {
        setError('Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [token]);

  const handleQuizStart = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/leaderboard/${quizId}`);
  };

  const currentUsername = user?.username || user?.sub || user?.preferred_username;

  const handleDeactivate = async (quizId) => {
    try {
      await api.put(`/quizzes/${quizId}/deactivate`);
      // Optimistically remove from list since active list will exclude it
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (_e) {
      setError('Failed to deactivate quiz');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Quizzes
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : quizzes.length === 0 ? (
        <Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No quizzes available yet. Please check back later.
          </Typography>
          {(user?.roles === undefined || (Array.isArray(user?.roles) && user.roles.includes('INSTRUCTOR'))) && (
            <Button variant="contained" onClick={() => navigate('/quiz/create')}>
              Create your first quiz
            </Button>
          )}
        </Box>
      ) : (
      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {quiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {quiz.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={`Time: ${quiz.timeLimit} min`} size="small" color="primary" variant="outlined" />
                </Box>
                <Button
                  variant="contained"
                  onClick={() => handleQuizStart(quiz.id)}
                  sx={{ mt: 2, mr: 1 }}
                >
                  Start Quiz
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleViewLeaderboard(quiz.id)}
                  sx={{ mt: 2 }}
                >
                  Leaderboard
                </Button>
                {Array.isArray(user?.roles) && user.roles.includes('INSTRUCTOR') && quiz.creator?.username === currentUsername && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => handleDeactivate(quiz.id)}
                    sx={{ mt: 2, ml: 1 }}
                  >
                    Deactivate
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
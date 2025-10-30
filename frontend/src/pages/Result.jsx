import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, Button, Stack } from '@mui/material';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const result = location.state;

  useEffect(() => {
    if (!result) {
      navigate('/dashboard', { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Submitted
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          Score: {result.score}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Time Taken: {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => navigate(`/leaderboard/${quizId}`)}>
            View Leaderboard
          </Button>
          <Button variant="outlined" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Result;



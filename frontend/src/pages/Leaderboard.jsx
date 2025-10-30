import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Leaderboard = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizResponse, leaderboardResponse] = await Promise.all([
          api.get(`/quizzes/${id}`),
          api.get(`/quiz-attempts/${id}/leaderboard`),
        ]);
        setQuiz(quizResponse.data);
        setLeaderboard(leaderboardResponse.data);
      } catch (error) {
        setError('Failed to fetch leaderboard data');
      }
    };

    fetchData();
  }, [id, token]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Leaderboard: {quiz?.title}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time Taken</TableCell>
                <TableCell>Completion Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  sx={index < 3 ? { backgroundColor: '#f5f5f5' } : {}}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.user.username}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell>{formatTime(entry.timeSpent)}</TableCell>
                  <TableCell>
                    {new Date(entry.submitTime).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Leaderboard;
import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';

interface TrueOrFalseQuestionProps {
  correctAnswer: string;
  setCorrectAnswer: (correctAnswer: string) => void;
}

const TrueOrFalseQuestion: React.FC<TrueOrFalseQuestionProps> = ({
  correctAnswer,
  setCorrectAnswer,
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="Option 1"
        variant="outlined"
        value="True"
        InputProps={{
          readOnly: true,
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        label="Option 2"
        variant="outlined"
        value="False"
        InputProps={{
          readOnly: true,
        }}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        fullWidth
        select
        label="Correct Answer"
        variant="outlined"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">False</MenuItem>
      </TextField>
    </Box>
  );
};

export default TrueOrFalseQuestion;
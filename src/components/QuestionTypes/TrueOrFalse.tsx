import React from 'react';
import { Box, TextField } from "@mui/material";

interface TrueOrFalseQuestionProps {
  questionText: string;
  onQuestionChange: (value: string) => void;
}

const TrueOrFalseQuestion: React.FC<TrueOrFalseQuestionProps> = ({ questionText, onQuestionChange }) => {
  return (
    <Box>
      <TextField
        label="Question"
        value={questionText}
        onChange={(e) => onQuestionChange(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 1 }}
      />
      <TextField
        label="Option 1"
        value="True"
        variant="outlined"
        fullWidth
        disabled
        sx={{ marginBottom: 1 }}
      />
      <TextField
        label="Option 2"
        value="False"
        variant="outlined"
        fullWidth
        disabled
        sx={{ marginBottom: 1 }}
      />
    </Box>
  );
};

export default TrueOrFalseQuestion;
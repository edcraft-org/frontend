import React from 'react';
import { Box, TextField } from "@mui/material";

interface OpenEndedQuestionProps {
  questionText: string;
  correctAnswer: string;
  onQuestionChange: (value: string) => void;
  onCorrectAnswerChange: (value: string) => void;
}

const OpenEndedQuestion: React.FC<OpenEndedQuestionProps> = ({
  questionText,
  correctAnswer,
  onQuestionChange,
  onCorrectAnswerChange
}) => {
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
        label="Correct Answer"
        value={correctAnswer}
        onChange={(e) => onCorrectAnswerChange(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 1 }}
      />
    </Box>
  );
};

export default OpenEndedQuestion;
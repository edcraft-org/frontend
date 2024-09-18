import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import MultipleChoiceQuestion from './ManualCreation/MultipleChoice';
import TrueOrFalseQuestion from './ManualCreation/TrueFalse';

interface ManualCreationProps {
  description: string;
  setDescription: (description: string) => void;
  type: string;
  options: string[];
  setOptions: (options: string[]) => void;
  correctAnswer: string;
  setCorrectAnswer: (correctAnswer: string) => void;
}

const ManualCreation: React.FC<ManualCreationProps> = ({
  description,
  setDescription,
  type,
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
}) => {
  return (
    <Box
      sx={{
        marginBottom: 2,
        border: '1px solid #ccc', // Outline color
        borderRadius: '4px', // Optional: to make the corners rounded
        padding: 2, // Optional: to add some padding inside the box
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Manual Creation
      </Typography>
      <TextField
        fullWidth
        label="Question Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        sx={{ marginBottom: 2 }}
      />
      {type === 'multiple choice' && (
        <MultipleChoiceQuestion
          options={options}
          setOptions={setOptions}
          correctAnswer={correctAnswer}
          setCorrectAnswer={setCorrectAnswer}
        />
      )}
      {type === 'true or false' && (
        <TrueOrFalseQuestion
          correctAnswer={correctAnswer}
          setCorrectAnswer={setCorrectAnswer}
        />
      )}
    </Box>
  );
};

export default ManualCreation;
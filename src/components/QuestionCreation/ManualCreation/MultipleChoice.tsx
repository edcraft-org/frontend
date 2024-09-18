import React from 'react';
import { Box, Button, IconButton, TextField, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface MultipleChoiceQuestionProps {
  options: string[];
  setOptions: (options: string[]) => void;
  correctAnswer: string;
  setCorrectAnswer: (correctAnswer: string) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <Box>
      {options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <TextField
            fullWidth
            label={`Option ${index + 1}`}
            variant="outlined"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
            sx={{ marginRight: 1 }}
          />
          <IconButton onClick={() => handleDeleteOption(index)} disabled={options.length <= 2}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button onClick={handleAddOption} variant="contained" sx={{ marginBottom: 2 }}>
        Add Option
      </Button>
      <TextField
        fullWidth
        select
        label="Correct Answer"
        variant="outlined"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
      >
        {options
          .filter((option) => option.trim() !== '')
          .map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
    </Box>
  );
};

export default MultipleChoiceQuestion;
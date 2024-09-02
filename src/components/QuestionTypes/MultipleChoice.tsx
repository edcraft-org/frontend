import React from 'react';
import { Box, TextField, IconButton } from "@mui/material";
import { Remove } from "@mui/icons-material";

interface MultipleChoiceQuestionProps {
  questionText: string;
  options: string[];
  onQuestionChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionText,
  options,
  onQuestionChange,
  onOptionChange,
  onRemoveOption
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
      {options.map((option, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <TextField
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
            variant="outlined"
            fullWidth
          />
          <IconButton onClick={() => onRemoveOption(index)} sx={{ marginLeft: 1 }}>
            <Remove />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default MultipleChoiceQuestion;
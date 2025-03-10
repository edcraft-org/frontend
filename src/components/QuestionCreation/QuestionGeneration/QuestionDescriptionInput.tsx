import React from 'react';
import { TextField } from '@mui/material';

interface QuestionDescriptionInputProps {
  description: string;
  setDescription: (description: string) => void;
}

const QuestionDescriptionInput: React.FC<QuestionDescriptionInputProps> = ({
  description,
  setDescription,
}) => {
  return (
    <TextField
      fullWidth
      label="Question Description"
      variant="outlined"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
      sx={{ marginBottom: 2, bgcolor: 'white'}}
    />
  );
};

export default QuestionDescriptionInput;
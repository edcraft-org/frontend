import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import QuestionDescriptionInput from './QuestionDescriptionInput';

interface QuestionGenerationFormProps {
  description: string;
  setDescription: (description: string) => void;
  numOptions: number;
  setNumOptions: (numOptions: number) => void;
  numQuestions: number;
  setNumQuestions: (numQuestions: number) => void;
  type: string;
  loading: boolean;
  handleGenerate: () => void;
}

const QuestionGenerationForm: React.FC<QuestionGenerationFormProps> = ({
  description,
  setDescription,
  numOptions,
  setNumOptions,
  numQuestions,
  setNumQuestions,
  type,
  loading,
  handleGenerate,
}) => {
  return (
    <Box>
      <QuestionDescriptionInput
        description={description}
        setDescription={setDescription}
      />
      {/* <TextField
        fullWidth
        label="Number of Options"
        variant="outlined"
        type="number"
        value={numOptions}
        onChange={(e) => setNumOptions(Number(e.target.value))}
        required
        sx={{ marginBottom: 2 }}
        disabled={type === 'true or false'}
      />
      <TextField
        fullWidth
        label="Number of Questions"
        variant="outlined"
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        required
        sx={{ marginBottom: 2 }}
      /> */}
      <Button variant="contained" color="primary" onClick={handleGenerate} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Generate'}
      </Button>
    </Box>
  );
};

export default QuestionGenerationForm;

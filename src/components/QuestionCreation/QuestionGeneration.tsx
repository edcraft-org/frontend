import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';

interface QuestionGenerationProps {
  description: string;
  setDescription: (description: string) => void;
  type: string;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({ description, setDescription, type }) => {
  const [numOptions, setNumOptions] = useState<number>(4);
  const [numQuestions, setNumQuestions] = useState<number>(1);

  useEffect(() => {
    if (type === 'true or false') {
      setNumOptions(2);
    }
  }, [type]);

  const handleGenerate = () => {
    // Logic to generate questions
    console.log('Generating questions with the following parameters:');
    console.log('Description:', description);
    console.log('Number of Options:', numOptions);
    console.log('Number of Questions:', numQuestions);
  };

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
        Question Generation
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
      <TextField
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
      />
      <Button variant="contained" color="primary" onClick={handleGenerate}>
        Generate
      </Button>
    </Box>
  );
};

export default QuestionGeneration;
import React from 'react';
import { Box, MenuItem, TextField, Typography } from '@mui/material';

interface QuestionDetailsProps {
  type: string;
  marks: number | string;
  setType: (type: string) => void;
  setMarks: (marks: number | string) => void;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ type, marks, setType, setMarks }) => {
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
        Question Details
      </Typography>
      <TextField
        fullWidth
        select
        label="Question Type"
        variant="outlined"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      >
        <MenuItem value="multiple choice">Multiple Choice</MenuItem>
        <MenuItem value="true or false">True or False</MenuItem>
        <MenuItem value="fill in the blank">Fill in the Blank</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>
      <TextField
        fullWidth
        label="Question Marks"
        variant="outlined"
        type="number"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        required
        inputProps={{ min: 1 }}
        sx={{ marginTop: 2 }}
      />
    </Box>
  );
};

export default QuestionDetails;
import React from 'react';
import { Box, MenuItem, FormControl, InputLabel, Select, Chip, Typography, TextField } from '@mui/material';

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
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="question-type-label">Question Type</InputLabel>
        <Select
          labelId="question-type-label"
          label="Question Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          renderValue={(selected) => (
            <Chip label={selected} />
          )}
        >
          <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
          <MenuItem value="True or False">True or False</MenuItem>
          <MenuItem value="Fill in the blank">Fill in the Blank</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
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
import React from 'react';
import { Box, MenuItem, FormControl, InputLabel, Select, Chip, Typography, TextField } from '@mui/material';

interface QuestionDetailsProps {
  type: string;
  marks: number;
  setType: (type: string) => void;
  setMarks: (marks: number) => void;
  numOptions: number;
  setNumOptions: (numOptions: number) => void;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({ type, marks, setType, setMarks, numOptions, setNumOptions }) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setNumOptions(0)
      return
    }
    const cleanedValue = e.target.value.replace(/^0+/, "")
    const parsedValue = Number.parseInt(cleanedValue || "0", 10)
    setNumOptions(parsedValue)
  }

  return (
    <Box
      sx={{
        marginBottom: 2,
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Question Details
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2, bgcolor: 'white' }}>
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
          <MenuItem value="Fill in the blank">Fill in the Blank</MenuItem>
          {/* <MenuItem value="Multiple Response">Multiple Response></MenuItem>
          <MenuItem value="Other">Other</MenuItem> */}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Question Marks"
        variant="outlined"
        type="number"
        value={marks}
        onChange={(e) => setMarks(Number(e.target.value))}
        required
        inputProps={{ min: 1 }}
        sx={{ marginTop: 2, bgcolor: 'white'}}
      />
      <TextField
        fullWidth
        label="Number of Options"
        variant="outlined"
        type="number"
        value={numOptions === 0 ? "" : numOptions}
        onChange={handleNumberChange}
        required
        sx={{ marginTop: 2, bgcolor: "white" }}
        disabled={type === "true or false"}
        inputProps={{
          min: 0,
          inputMode: "numeric",
        }}
      />
    </Box>
  );
};

export default QuestionDetails;
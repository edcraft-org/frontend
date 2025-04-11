import React from 'react';
import { Box, MenuItem, FormControl, InputLabel, Select, Chip, Typography, TextField, Paper, Grid } from '@mui/material';

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
    <Paper
      elevation={2}
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        bgcolor: '#f8f9fa',
      }}>
        <Typography
          variant="h6"
          fontWeight="medium"
          color="primary"
        >
          Question Details
        </Typography>
      </Box>

      <Box sx={{ p: 3, width: '800px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="question-type-label">Question Type</InputLabel>
              <Select
                labelId="question-type-label"
                label="Question Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                renderValue={(selected) => (
                  <Chip
                    label={selected}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      bgcolor: 'grey.100',
                      color: 'grey.800',
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '& .MuiChip-label': {
                        px: 1,
                        fontWeight: 500
                      }
                    }}
                  />
                )}
              >
                <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                <MenuItem value="Fill in the blank">Fill in the Blank</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Question Marks"
              variant="outlined"
              type="number"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Number of Options"
              variant="outlined"
              type="number"
              value={numOptions === 0 ? "" : numOptions}
              onChange={handleNumberChange}
              required
              disabled={type === "true or false"}
              inputProps={{
                min: 0,
                inputMode: "numeric",
              }}
              helperText={type === "true or false" ? "Not applicable" : ""}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default QuestionDetails;
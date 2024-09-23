import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, TextField, Typography, Button, Select, MenuItem, FormControl, InputLabel, Chip, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from '@mui/material';
import { topics } from './utils';

interface QuestionGenerationProps {
  description: string;
  setDescription: (description: string) => void;
  type: string;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({
  description,
  setDescription,
  type
}) => {  const [numOptions, setNumOptions] = useState<number>(4);
  const [numQuestions, setNumQuestions] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");
  const [queryable, setQueryable] = useState<string>("");
  const [variables, setVariables] = useState<string[]>([]);


  useEffect(() => {
    if (queryable && topic) {
      setVariables(topics[topic][queryable].variables);
    }
  }, [queryable, topic]);
  
  useEffect(() => {
    if (type === 'true or false') {
      setNumOptions(2);
    }
  }, [type]);

  const handleGenerate = () => {
    // Check if all variables are used in the description
    const allVariablesUsed = variables.every((_, index) => description.includes(`{${index}}`));

    if (!allVariablesUsed) {
      alert('Please use all variables in the question description.');
      return;
    }

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
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="topic-label">Topic</InputLabel>
        <Select
          labelId="topic-label"
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          renderValue={(selected) => (
            <Chip label={selected} />
          )}
        >
          {Object.keys(topics).map((topic) => (
            <MenuItem value={topic}>{topic}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <Autocomplete
        id="topic-autocomplete"
        options={Object.keys(topics)}
        value={topic}
        onChange={(event, newValue) => {
          if (newValue) {
            setTopic(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Topic" />}
        sx = {{ marginBottom: 2 }}
      /> */}
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="queryable-label">Queryable</InputLabel>
        <Select
          labelId="queryable-label"
          label="Queryable"
          value={queryable}
          onChange={(e) => setQueryable(e.target.value)}
          disabled={!topic}
          renderValue={(selected) => (
            <Chip label={selected} />
          )}
        >
          {topic && Object.keys(topics[topic]).map((queryable) => (
            <MenuItem value={queryable}>{queryable}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Variables are placeholders in your question. Use {0}, {1}, etc. in your question description to represent these variables." placement='bottom-start'>
        <Typography variant="subtitle1" >
          Variables (Use in question description)
        </Typography>
      </Tooltip>
      <TableContainer component={Paper} sx={{ marginBottom: 2, border: '1px solid #ccc' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Variable Index</TableCell>
            <TableCell>Variable Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              <TableCell>{variable}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Paper variant="outlined" sx={{ padding: 1, marginBottom: 2, backgroundColor: '#f0f0f0' }}>
      <Typography variant="subtitle1">
        Output Type: {topic && queryable && topics[topic][queryable].outputType}
      </Typography>
    </Paper>
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
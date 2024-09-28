import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Select, MenuItem, FormControl, InputLabel, Chip, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from '@mui/material';
import { getTopics, getSubtopics, getQueryables, Topic, Subtopic, Queryable } from '../../utils/api/QuestionGenerationAPI';

interface QuestionGenerationProps {
  description: string;
  setDescription: (description: string) => void;
  type: string;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({
  description,
  setDescription,
  type
}) => {
  const [numOptions, setNumOptions] = useState<number>(4);
  const [numQuestions, setNumQuestions] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");
  const [subtopic, setSubtopic] = useState<string>("");
  const [queryable, setQueryable] = useState<string>("");
  const [variables, setVariables] = useState<string[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [queryables, setQueryables] = useState<Queryable[]>([]);

  useEffect(() => {
    // Fetch topics
    getTopics()
      .then(setTopics)
      .catch(error => console.error('Error fetching topics:', error));
  }, []);

  useEffect(() => {
    if (topic) {
      // Fetch subtopics
      getSubtopics(topic)
        .then(setSubtopics)
        .catch(error => console.error('Error fetching subtopics:', error));
    } else {
      setSubtopics([]);
      setSubtopic('');
      setQueryables([]);
      setQueryable('');
    }
  }, [topic]);

  useEffect(() => {
    if (subtopic) {
      // Fetch queryables
      getQueryables(topic, subtopic)
        .then(setQueryables)
        .catch(error => console.error('Error fetching queryables:', error));
    } else {
      setQueryables([]);
      setQueryable('');
    }
  }, [topic, subtopic]);

  useEffect(() => {
    if (queryable && topic && subtopic) {
      const selectedQueryable = queryables.find(q => q.queryable === queryable);
      setVariables(selectedQueryable ? selectedQueryable.variables : []);
    }
  }, [queryable, topic, subtopic, queryables]);

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
          {topics.map((topic) => (
            <MenuItem key={topic} value={topic}>{topic}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="subtopic-label">Subtopic</InputLabel>
        <Select
          labelId="subtopic-label"
          label="Subtopic"
          value={subtopic}
          onChange={(e) => setSubtopic(e.target.value)}
          disabled={!topic}
          renderValue={(selected) => (
            <Chip label={selected} />
          )}
        >
          {subtopics.map((subtopic) => (
            <MenuItem key={subtopic} value={subtopic}>{subtopic}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="queryable-label">Queryable</InputLabel>
        <Select
          labelId="queryable-label"
          label="Queryable"
          value={queryable}
          onChange={(e) => setQueryable(e.target.value)}
          disabled={!subtopic}
          renderValue={(selected) => (
            <Chip label={selected} />
          )}
        >
          {queryables.map((queryable) => (
            <MenuItem key={queryable.queryable} value={queryable.queryable}>{queryable.queryable}</MenuItem>
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
          Output Type: {topic && subtopic && queryable && queryables.find(q => q.queryable === queryable)?.outputType}
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
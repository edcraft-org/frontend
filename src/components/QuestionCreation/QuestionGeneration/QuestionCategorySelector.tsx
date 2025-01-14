import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Autocomplete, TextField } from '@mui/material';
import { formatText } from '../../../utils/format';

interface QuestionCategorySelectorProps {
  tabValue: number;
  topics: string[];
  subtopics: string[];
  topic: string;
  subtopic: string;
  userTopic: string;
  userSubtopic: string;
  setTopic: (value: string) => void;
  setSubtopic: (value: string) => void;
  setUserTopic: (value: string) => void;
  setUserSubtopic: (value: string) => void;
}

const QuestionCategorySelector: React.FC<QuestionCategorySelectorProps> = ({
  tabValue,
  topics,
  subtopics,
  topic,
  subtopic,
  userTopic,
  userSubtopic,
  setTopic,
  setSubtopic,
  setUserTopic,
  setUserSubtopic,
}) => {
  return (
    <>
      {tabValue === 0 ? (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="topic-label">Topic</InputLabel>
            <Select
              labelId="topic-label"
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              renderValue={(selected) => <Chip label={formatText(selected)} />}
            >
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {formatText(topic)}
                </MenuItem>
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
              renderValue={(selected) => <Chip label={formatText(selected)} />}
            >
              {subtopics.map((subtopic) => (
                <MenuItem key={subtopic} value={subtopic}>
                  {formatText(subtopic)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        <>
          <Autocomplete
            freeSolo
            fullWidth
            options={topics}
            value={userTopic}
            onChange={(event, newValue) => {
              setUserTopic(newValue || '');
              setTopic(newValue || '');
            }}
            onInputChange={(event, newInputValue) => setUserTopic(newInputValue)}
            renderInput={(params) => <TextField {...params} label="Topic" variant="outlined" />}
            renderOption={(props, option) => (
              <li {...props}>
                {formatText(option)}
              </li>
            )}
            sx={{ marginBottom: 2 }}
          />
          <Autocomplete
            freeSolo
            fullWidth
            options={subtopics}
            value={userSubtopic}
            onChange={(event, newValue) => setUserSubtopic(newValue || '')}
            onInputChange={(event, newInputValue) => setUserSubtopic(newInputValue)}
            renderInput={(params) => <TextField {...params} label="Subtopic" variant="outlined" />}
            renderOption={(props, option) => (
              <li {...props}>
                {formatText(option)}
              </li>
            )}
            sx={{ marginBottom: 2 }}
          />
        </>
      )}
    </>
  );
};

export default QuestionCategorySelector;
import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Autocomplete, TextField, Accordion, AccordionSummary, Typography, AccordionDetails, Button, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatText } from '../../../utils/format';
import QueryableClassCodeSnippetEditor from '../ClassCodeSnippetEditors/QueryableClassCodeSnippetEditor';

interface QuestionQueryableSelectorProps {
  tabValue: number;
  queryables: string[];
  queryable: string;
  setQueryable: (value: string) => void;
  setUserQueryableCode: (userQueryableCode: string, index?: number) => void;
  loading: boolean;
  index?: number;
}

const QuestionQueryableSelector: React.FC<QuestionQueryableSelectorProps> = ({
  tabValue,
  queryables,
  queryable,
  setQueryable,
  setUserQueryableCode,
  loading,
  index,
}) => {
  const [queryableCodeSnippet, setQueryableCodeSnippetState] = useState<string>('');

  const handleSaveCodeSnippet = () => {
    setUserQueryableCode(queryableCodeSnippet, index);
  };

  const handleSnippetChange = (code: string) => {
    setQueryableCodeSnippetState(code);
  };

  return (
    <>
      {tabValue === 0 ? (
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="queryable-label">Queryable</InputLabel>
          <Select
            labelId="queryable-label"
            label="Queryable"
            value={queryable}
            onChange={(e) => setQueryable(e.target.value)}
            renderValue={(selected) => <Chip label={formatText(selected)} />}
          >
            {queryables.map((queryable) => (
              <MenuItem key={queryable} value={queryable}>
                {formatText(queryable)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <Autocomplete
            freeSolo
            fullWidth
            options={queryables}
            value={queryable}
            onChange={(event, newValue) => setQueryable(newValue || '')}
            onInputChange={(event, newInputValue) => setQueryable(newInputValue || '')}
            renderInput={(params) => <TextField {...params} label="Queryable Class" variant="outlined" />}
            renderOption={(props, option) => (
              <li {...props}>
                {formatText(option)}
              </li>
            )}
            sx={{ marginBottom: 2 }}
          />
          {/* <Accordion sx={{ marginBottom: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ flexDirection: 'row-reverse' }}
            >
              <Typography>Define Code Snippet</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <QueryableClassCodeSnippetEditor setQueryableCodeSnippet={handleSnippetChange} setQueryableCodeRequiredLines={()=>{}} />
              <Button variant="contained" color="primary" onClick={handleSaveCodeSnippet} disabled={loading} sx={{ marginBottom: 2 }}>
                {loading ? <CircularProgress size={24} /> : 'Update Algorithm'}
              </Button>
            </AccordionDetails>
          </Accordion> */}
        </>
      )}
    </>
  );
};

export default QuestionQueryableSelector;
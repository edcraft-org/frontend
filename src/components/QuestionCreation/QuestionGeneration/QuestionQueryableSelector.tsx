import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Autocomplete, TextField } from '@mui/material';
import { formatText } from '../../../utils/format';

interface QuestionQueryableSelectorProps {
  title: string
  tabValue: number;
  queryables: string[];
  queryable: string;
  setQueryable: (value: string) => void;
  setUserQueryableCode: (userQueryableCode: string, index?: number) => void;
  loading: boolean;
  index?: number;
}

const QuestionQueryableSelector: React.FC<QuestionQueryableSelectorProps> = ({
  title,
  tabValue,
  queryables,
  queryable,
  setQueryable,
  // setUserQueryableCode,
  // index,
}) => {
  // const [queryableCodeSnippet, setQueryableCodeSnippetState] = useState<string>('');

  // const handleSaveCodeSnippet = () => {
  //   setUserQueryableCode(queryableCodeSnippet, index);
  // };

  // const handleSnippetChange = (code: string) => {
  //   setQueryableCodeSnippetState(code);
  // };

  return (
    <>
      {tabValue === 0 ? (
        <FormControl fullWidth sx={{ marginBottom: 2, bgcolor: 'white' }}>
          <InputLabel id="queryable-label">{title} Query</InputLabel>
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
            renderInput={(params) => <TextField {...params} label={`${title} Queryable`} variant="outlined" />}
            renderOption={(props, option) => (
              <li {...props}>
                {formatText(option)}
              </li>
            )}
            sx={{ marginBottom: 2, bgcolor: 'white' }}
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
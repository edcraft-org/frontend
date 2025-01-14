import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, Autocomplete, TextField } from '@mui/material';
import { formatText } from '../../../utils/format';

interface QuestionQueryableSelectorProps {
  tabValue: number;
  queryables: string[];
  queryable: string;
  userQueryable: string;
  setQueryable: (value: string) => void;
  setUserQueryable: (value: string) => void;
}

const QuestionQueryableSelector: React.FC<QuestionQueryableSelectorProps> = ({
  tabValue,
  queryables,
  queryable,
  userQueryable,
  setQueryable,
  setUserQueryable,
}) => {
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
        <Autocomplete
          freeSolo
          fullWidth
          options={queryables}
          value={userQueryable}
          onChange={(event, newValue) => setUserQueryable(newValue || '')}
          onInputChange={(event, newInputValue) => setUserQueryable(newInputValue || '')}
          renderInput={(params) => <TextField {...params} label="QueryableClass" variant="outlined" />}
          renderOption={(props, option) => (
            <li {...props}>
              {formatText(option)}
            </li>
          )}
          sx={{ marginBottom: 2 }}
        />
      )}
    </>
  );
};

export default QuestionQueryableSelector;
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { formatTextSplitUpperCase } from '../../../utils/format';

interface QuestionQueryableSelectorProps {
  title: string
  queryables: string[];
  queryable: string;
  setQueryable: (value: string) => void;
  setUserQueryableCode: (userQueryableCode: string, index?: number) => void;
  loading: boolean;
  index?: number;
}

const QuestionQueryableSelector: React.FC<QuestionQueryableSelectorProps> = ({
  title,
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
      <FormControl fullWidth sx={{ marginBottom: 2, bgcolor: 'white' }}>
        <InputLabel id="queryable-label">{title} Query</InputLabel>
        <Select
          labelId="queryable-label"
          label="Queryable"
          value={queryable}
          onChange={(e) => setQueryable(e.target.value)}
          renderValue={(selected) => <Chip label={formatTextSplitUpperCase(selected)} />}
        >
          {queryables.map((queryable) => (
            <MenuItem key={queryable} value={queryable}>
              {formatTextSplitUpperCase(queryable)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default QuestionQueryableSelector;
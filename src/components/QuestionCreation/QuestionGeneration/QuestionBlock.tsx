import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import VariableTable from './VariableTable';
import QuestionQueryableSelector from './QuestionQueryableSelector';
import QuestionGenerationForm from './QuestionGenerationForm';
import { Quantifiable, Variable, getQueryableVariables } from '../../../utils/api/QuestionGenerationAPI';

interface QuestionBlockProps {
  tabValue: number;
  queryables: string[];
  queryable: string;
  userQueryable: string;
  setQueryable: (value: string) => void;
  setUserQueryable: (value: string) => void;
  queryVariables: Variable[];
  quantifiables: Quantifiable[];
  description: string;
  setDescription: (description: string) => void;
  numOptions: number;
  setNumOptions: (numOptions: number) => void;
  numQuestions: number;
  setNumQuestions: (numQuestions: number) => void;
  type: string;
  loading: boolean;
  handleGenerate: () => void;
  topic: string;
  subtopic: string;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  tabValue,
  queryables,
  queryable,
  userQueryable,
  setQueryable,
  setUserQueryable,
  queryVariables,
  quantifiables,
  description,
  setDescription,
  numOptions,
  setNumOptions,
  numQuestions,
  setNumQuestions,
  type,
  loading,
  handleGenerate,
  topic,
  subtopic,
}) => {
  const [localQueryVariables, setLocalQueryVariables] = useState<Variable>([]);

  useEffect(() => {
    if (topic && subtopic && queryable) {
      getQueryableVariables(topic, subtopic, queryable)
        .then(data => setLocalQueryVariables(data))
        .catch(error => console.error('Error fetching queryable variables:', error));
    } else {
      setLocalQueryVariables([]);
    }
  }, [topic, subtopic, queryable]);

  return (
    <Box
      sx={{
        marginBottom: 2,
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, color: 'primary' }}>
        Question block
      </Typography>
      <QuestionQueryableSelector
        tabValue={tabValue}
        queryables={queryables}
        queryable={queryable}
        userQueryable={userQueryable}
        setQueryable={setQueryable}
        setUserQueryable={setUserQueryable}
      />
      <Tooltip title="Query Variables are used to fetch data. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
        <Typography variant="subtitle1">
          Query Variables (Use variable name in question description)
        </Typography>
      </Tooltip>
      <VariableTable
        variables={localQueryVariables}
        quantifiables={quantifiables}
        selectedQuantifiables={{}}
        selectedSubclasses={{}}
        variableArguments={{}}
        handleQuantifiableChange={() => {}}
        handleSubclassChange={() => {}}
        handleArgumentChange={() => {}}
      />
      <QuestionGenerationForm
        description={description}
        setDescription={setDescription}
        numOptions={numOptions}
        setNumOptions={setNumOptions}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        type={type}
        loading={loading}
        handleGenerate={handleGenerate}
      />
    </Box>
  );
};

export default QuestionBlock;
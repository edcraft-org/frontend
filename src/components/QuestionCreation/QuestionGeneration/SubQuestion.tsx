import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, FormControlLabel, Checkbox, Collapse, TextField, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, Delete } from '@mui/icons-material';
import QuestionDescriptionInput from './QuestionDescriptionInput';
import QuestionQueryableSelector from './QuestionQueryableSelector';
import { numberToAlphabet } from '../../../utils/format';
import VariableTable from './VariableTable';
import { Variable } from '../../../utils/api/QuestionGenerationAPI';
import CodeBlock from './CodeBlock';
import QuestionDetails from '../QuestionDetails';
import { SubQuestionType } from '../../../reducer/questionGenerationReducer';

interface SubQuestionProps {
  index: number;
  subQuestion: SubQuestionType;
  setDescription: (description: string, index: number) => void;
  setQueryable: (index: number, queryable: string) => void;
  setUserQueryable: (index: number, userQueryable: string) => void;
  handleGenerate: () => void;
  removeSubQuestion: (index: number) => void;
  topics: string[];
  subtopics: string[];
  contextActions: {
    setTopic: (value: string) => void;
    setSubtopic: (value: string) => void;
    setUserTopic: (value: string) => void;
    setUserSubtopic: (value: string) => void;
    setProcessorCodeSnippet: (value: string) => void;
    setProcessorCodeRequiredLines: (value: string[]) => void;
    handleSaveCodeSnippet: () => void;
    handleQuantifiableChange: (variableName: string, value: string) => void;
    handleSubclassChange: (variableName: string, subclassName: string) => void;
    handleArgumentChange: (variableName: string, argName: string, value: any) => void;
    handleArgumentInit: (argumentsInit: { [key: string]: { [arg: string]: any } }, index?: number) => void;
  };
}

const SubQuestion: React.FC<SubQuestionProps> = ({
  index,
  subQuestion,
  setDescription,
  setQueryable,
  setUserQueryable,
  handleGenerate,
  removeSubQuestion,
  contextActions
}) => {
  const [addContext, setAddContext] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [marks, setMarks] = useState<number>(1);
  const [type, setType] = useState<string>('Multiple Choice');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAddContextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setAddContext(isChecked);
    if (isChecked) {
      setExpanded(true);
    }
  };


  return (
    <Box sx={{ marginBottom: 2, border: '1px solid #ccc', borderRadius: '4px', padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom>
          {numberToAlphabet(index)}.
        </Typography>
        <IconButton onClick={() => removeSubQuestion(index)}>
          <Delete />
        </IconButton>
      </Box>
      <FormControlLabel
        control={<Checkbox checked={addContext} onChange={handleAddContextChange} />}
        label="Add Context"
      />
      {addContext && (
        <>
          <Box sx={{ marginBottom: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleExpandClick}
              startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ textTransform: 'none' }}
            >
              {expanded ? 'Hide' : 'Show'}
            </Button>
          </Box>
          <Collapse in={expanded}>
            <CodeBlock
              tabValue={0}
              handleTabChange={() => {}}
              context = {subQuestion.context}
              {...contextActions}
              index = {index}
              loading={false}
            />
          </Collapse>
        </>
      )}
      <QuestionDescriptionInput
        description={subQuestion.description}
        setDescription={(desc) => setDescription(desc, index)}
      />
      <QuestionQueryableSelector
        tabValue={0}
        queryables={subQuestion.queryables}
        queryable={subQuestion.selectedQueryable}
        userQueryable={''}
        setQueryable={(q) => setQueryable(index, q)}
        setUserQueryable={(uq) => setUserQueryable(index, uq)}
      />
      {subQuestion.queryVariables.length > 0 && (
        <>
          <Tooltip title="Query Variables are used to fetch data. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
            <Typography variant="subtitle1">
              Query Variables (Use variable name in question description)
            </Typography>
          </Tooltip>
          <VariableTable
            variables={subQuestion.queryVariables}
            quantifiables={subQuestion.context.quantifiables}
            selectedQuantifiables={subQuestion.context.selectedQuantifiables}
            selectedSubclasses={subQuestion.context.selectedSubclasses}
            variableArguments={subQuestion.context.variableArguments}
            handleQuantifiableChange={contextActions.handleQuantifiableChange}
            handleSubclassChange={contextActions.handleSubclassChange}
            handleArgumentChange={contextActions.handleArgumentChange}
          />
        </>
      )}
      <QuestionDetails
        type={type}
        marks={marks}
        setType={setType}
        setMarks={setMarks}
      />
      {/* <Button variant="contained" color="primary" onClick={handleGenerate} sx={{ marginTop: 2 }}>
        Preview Question
      </Button> */}
    </Box>
  );
};

export default SubQuestion;
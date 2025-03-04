import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, FormControlLabel, Checkbox, Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, Delete } from '@mui/icons-material';
import QuestionDescriptionInput from './QuestionDescriptionInput';
import QuestionQueryableSelector from './QuestionQueryableSelector';
import { numberToAlphabet } from '../../../utils/format';
import VariableTable from './VariableTable';
import CodeBlock from './CodeBlock';
import QuestionDetails from '../QuestionDetails';
import { ContextBlockType, initialState, InputDetailsType, SubQuestionType } from '../../../reducer/questionGenerationReducer';

interface SubQuestionProps {
  index: number;
  subQuestion: SubQuestionType;
  outerContext: ContextBlockType;
  setDescription: (description: string, index: number) => void;
  setQueryable: (index: number, queryable: string) => void;
  setInputQueryable: (index: number, queryable: string) => void;
  handleNumOptionsChange: (numOptions: number) => void;
  handleGenerate: () => void;
  removeSubQuestion: (index: number) => void;
  topics: string[];
  subtopics: string[];
  contextActions: {
    setTopic: (value: string) => void;
    setSubtopic: (value: string) => void;
    setInputPath: (inputPath: { [key: string]: any }) => void;
    handleQuantifiableChange: (variableName: string, value: string) => void;
    handleSubclassChange: (variableName: string, subclassName: string) => void;
    handleArgumentChange: (variableName: string, argName: string, value: any) => void;
    handleInputArgumentChange: (variableName: string, argName: string, value: any) => void;
    copyInputArgument: (variableName: string, inputName: string, argName: string, inputDetailIndex: number) => void;
    handleArgumentInit: (argumentsInit: { [key: string]: { [arg: string]: any } }, index?: number) => void;
    handleInputInit: (inputInit: { [key: string]: { [arg: string]: any } }, index?: number) => void;
    copyInputInit: (variableName: string, inputName: string, inputDetailIndex: number, index?: number) => void;
    setUserAlgoCode: (userAlgoCode: string, index?: number) => void;
    setUserEnvCode: (userEnvCode: string, index?: number) => void;
    setUserQueryableCode: (userQueryableCode: string, index?: number) => void;
    setInputQueryable: (inputPath: { [key: string]: any }, index?: number) => void;
    removeInputDetailsItem: (inputDetailIndex: number) => void;
    copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => void;
  };
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  loading: boolean;
  outerGeneratedInputs: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: any }, context_init: { [key: string]: any } }>;
}

const SubQuestion: React.FC<SubQuestionProps> = ({
  index,
  subQuestion,
  outerContext,
  setDescription,
  setQueryable,
  setInputQueryable,
  handleNumOptionsChange,
  removeSubQuestion,
  contextActions,
  tabValue,
  handleTabChange,
  loading,
  outerGeneratedInputs
}) => {
  const [addContext, setAddContext] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [marks, setMarks] = useState<number>(1);
  const [type, setType] = useState<string>('Multiple Choice');
  const [generatedInputs, setGeneratedInputs] = useState<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: any }, context_init: { [key: string]: any } }>>([]);

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
              tabValue={tabValue}
              handleTabChange={handleTabChange}
              context = {subQuestion.context}
              outerContext={outerContext}
              {...contextActions}
              index = {index}
              loading={false}
              generatedInputs={generatedInputs}
              setGeneratedInputs={setGeneratedInputs}
              outerGeneratedInputs={outerGeneratedInputs}
            />
          </Collapse>
        </>
      )}
      <QuestionDescriptionInput
        description={subQuestion.description}
        setDescription={(desc) => setDescription(desc, index)}
      />
      <QuestionQueryableSelector
        title = {'Input'}
        tabValue={tabValue}
        queryables={subQuestion.inputQueryables}
        queryable={subQuestion.selectedInputQueryable}
        setQueryable={(q) => setInputQueryable(index, q)}
        setUserQueryableCode={(userQueryableCode) => {}}
        loading={loading}
      />
      {subQuestion.inputQueryVariables.length > 0 && (
        <>
          <Tooltip title="Query Variables are used to fetch data. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
            <Typography variant="subtitle1">
              Input Query Variables (Use variable name in question description)
            </Typography>
          </Tooltip>
          <VariableTable
            variables={subQuestion.inputQueryVariables}
            quantifiables={subQuestion.context.quantifiables}
            selectedQuantifiables={subQuestion.context.selectedQuantifiables}
            selectedSubclasses={subQuestion.context.selectedSubclasses}
            variableArguments={subQuestion.context.variableArguments}
            handleQuantifiableChange={contextActions.handleQuantifiableChange}
            handleSubclassChange={contextActions.handleSubclassChange}
            handleArgumentChange={contextActions.handleArgumentChange}
            isAlgoTable={false}
            isInnerInputTable={false}
            context={subQuestion.context}
            outerContext={initialState.context}
            copyInputArgument={contextActions.copyInputArgument}
            copyInputInit={contextActions.copyInputInit}
            useGeneratedInput={{}}
            setUseGeneratedInput={()=>{}}
            setInputInit={()=>{}}
            generatedInputs={[]}
            outerGeneratedInputs={[]}
            copyInputDetailsItem={()=>{}}
          />
        </>
      )}
      <QuestionQueryableSelector
        title={'Algo'}
        tabValue={tabValue}
        queryables={subQuestion.queryables}
        queryable={subQuestion.selectedQueryable}
        setQueryable={(q) => setQueryable(index, q)}
        setUserQueryableCode={(userQueryableCode) => contextActions.setUserQueryableCode(userQueryableCode, index)}
        loading={loading}
      />
      {subQuestion.queryVariables.length > 0 && (
        <>
          <Tooltip title="Query Variables are used to fetch data. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
            <Typography variant="subtitle1">
              Algo Query Variables (Use variable name in question description)
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
            isAlgoTable={false}
            isInnerInputTable={false}
            context={subQuestion.context}
            outerContext={initialState.context}
            copyInputArgument={contextActions.copyInputArgument}
            copyInputInit={contextActions.copyInputInit}
            useGeneratedInput={{}}
            setUseGeneratedInput={()=>{}}
            setInputInit={()=>{}}
            generatedInputs={[]}
            outerGeneratedInputs={[]}
            copyInputDetailsItem={()=>{}}
          />
        </>
      )}
      <QuestionDetails
        type={type}
        marks={marks}
        setType={setType}
        setMarks={setMarks}
        numOptions={subQuestion.numOptions}
        setNumOptions={handleNumOptionsChange}
      />
    </Box>
  );
};

export default SubQuestion;
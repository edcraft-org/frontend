import React, { useState } from 'react';
import { Box, Typography, Tooltip, IconButton, Button, Collapse } from '@mui/material';
import { Delete, ExpandLess, ExpandMore } from '@mui/icons-material';
import QuestionDescriptionInput from './QuestionDescriptionInput';
import QuestionQueryableSelector from './QuestionQueryableSelector';
import { numberToAlphabet } from '../../../utils/format';
import VariableTable from './VariableTable';
import QuestionDetails from '../QuestionDetails';
import { ContextBlockType, Detail, initialState, InputDetailsType, SubQuestionType } from '../../../reducer/questionGenerationReducer';
import ContextSelector from './ContextSelector';
import CodeBlock from './CodeBlock';

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
    setInputPath: (inputPath: { [key: string]: unknown }) => void;
    handleQuantifiableChange: (variableName: string, value: string) => void;
    handleInputQuantifiableChange: (variableName: string, value: string) => void;
    handleSubclassChange: (variableName: string, subclassName: string) => void;
    handleArgumentChange: (variableName: string, argName: string, value: unknown) => void;
    handleInputArgumentChange: (variableName: string, argName: string, value: unknown) => void;
    handleArgumentInit: (argumentsInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => void;
    handleInputInit: (inputInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => void;
    copyInputDetails: (variableName: string, inputName: string, inputDetailIndex: number, args?: string[]) => void;
    setUserAlgoCode: (userAlgoCode: string, index?: number) => void;
    setUserEnvCode: (userEnvCode: string, index?: number) => void;
    setUserQueryableCode: (userQueryableCode: string, index?: number) => void;
    setInputQueryable: (inputPath: { [key: string]: unknown }, index?: number) => void;
    addDetailsItem: (isAlgo: boolean) => void;
    removeDetailsItem: (inputDetailIndex: number, deleteGenerated: boolean) => void;
    copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => void;
    handleAddGeneratedOutput: (input_path: { [key: string]: unknown }, input_init: { [key: string]: { [arg: string]: unknown } }, user_env_code: string) => void;
  };
  loading: boolean;
  outerGeneratedContext: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>;
  setSelectedDetail: (detail: Detail, index: number) => void;
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
  loading,
  outerGeneratedContext,
  setSelectedDetail
}) => {
  const [expanded, setExpanded] = useState(false);
  const [marks, setMarks] = useState<number>(1);
  const [type, setType] = useState<string>('Multiple Choice');
  const [generatedContext, setGeneratedContext] = useState<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>>([]);

  const handleContextSelected = (context: any) => {
    // console.log("Selected context:", context)
    // You can perform additional actions here when a context is selected
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
      <>
        <Box sx={{ marginBottom: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleExpandClick}
            startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{ textTransform: 'none' }}
          >
            {expanded ? 'Hide Context' : 'Show Context'}
          </Button>
        </Box>
        <Collapse in={expanded}>
          <CodeBlock
            context = {subQuestion.context}
            outerContext={outerContext}
            {...contextActions}
            index = {index}
            loading={false}
            generatedContext={generatedContext}
            setGeneratedContext={setGeneratedContext}
            outerGeneratedContext={outerGeneratedContext}
          />
        </Collapse>
      </>
      <ContextSelector
        outerGeneratedContext={outerGeneratedContext}
        outerContext={outerContext}
        setSelectedDetail={(detail: Detail) => setSelectedDetail(detail, index)}
        onContextSelected={handleContextSelected}
      />
      <QuestionDescriptionInput
        description={subQuestion.description}
        setDescription={(desc) => setDescription(desc, index)}
      />
      {(subQuestion.context.selectedDetail && subQuestion.context.selectedDetail.type == 'algo') ?
        <>
          <QuestionQueryableSelector
            title={''}
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
                  Query Variables (Use variable name in question description)
                </Typography>
              </Tooltip>
              <VariableTable
                variables={subQuestion.queryVariables}
                quantifiables={subQuestion.context.quantifiables}
                selectedQuantifiables={{}}
                selectedSubclasses={{}}
                variableArguments={{}}
                handleQuantifiableChange={contextActions.handleQuantifiableChange}
                handleSubclassChange={contextActions.handleSubclassChange}
                handleArgumentChange={contextActions.handleArgumentChange}
                isAlgoTable={false}
                isInnerInputTable={false}
                context={subQuestion.context}
                outerContext={initialState.context}
                useGeneratedInput={{}}
                setUseGeneratedInput={()=>{}}
                setInputInit={()=>{}}
                generatedContext={[]}
                outerGeneratedContext={[]}
                copyInputDetailsItem={()=>{}}
                copyInputDetails={()=>{}}
              />
            </>
          )}
        </>
      :
        <>
          <QuestionQueryableSelector
            title = {''}
            queryables={subQuestion.inputQueryables}
            queryable={subQuestion.selectedInputQueryable}
            setQueryable={(q) => setInputQueryable(index, q)}
            setUserQueryableCode={() => {}}
            loading={loading}
          />
          {subQuestion.inputQueryVariables.length > 0 && (
            <>
              <Tooltip title="Query Variables are used to fetch data. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
                <Typography variant="subtitle1">
                  Query Variables (Use variable name in question description)
                </Typography>
              </Tooltip>
              <VariableTable
                variables={subQuestion.inputQueryVariables}
                quantifiables={subQuestion.context.quantifiables}
                selectedQuantifiables={{}}
                selectedSubclasses={{}}
                variableArguments={{}}
                handleQuantifiableChange={contextActions.handleQuantifiableChange}
                handleSubclassChange={contextActions.handleSubclassChange}
                handleArgumentChange={contextActions.handleArgumentChange}
                isAlgoTable={false}
                isInnerInputTable={false}
                context={subQuestion.context}
                outerContext={initialState.context}
                useGeneratedInput={{}}
                setUseGeneratedInput={()=>{}}
                setInputInit={()=>{}}
                generatedContext={[]}
                outerGeneratedContext={[]}
                copyInputDetailsItem={()=>{}}
                copyInputDetails={()=>{}}
              />
            </>
          )}
        </>
      }
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
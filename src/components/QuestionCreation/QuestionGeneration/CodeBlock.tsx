import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, CircularProgress, Tabs, Tab, FormControlLabel, Checkbox, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VariableTable from './VariableTable';
import QuestionCategorySelector from './QuestionCategorySelector';
import { GenerateInputRequest, GenerateVariableRequest, generateInput, generateVariable } from '../../../utils/api/QuestionGenerationAPI';
import { convertArguments, convertInputArguments } from '../../../utils/format';
import { ContextBlockType, initialState, InputDetailsType } from '../../../reducer/questionGenerationReducer';
import ProcessorClassCodeSnippetEditor from '../ClassCodeSnippetEditors/ProcessorClassCodeSnippetEditor';
import QuestionEnvSelector from './QuestionEnvSelector';
import GeneratedVariablesTable from '../../Table/GeneratedVariablesTable';
import { v4 as uuidv4 } from 'uuid';
import InputClassCodeSnippetEditor from '../ClassCodeSnippetEditors/InputClassCodeSnippetEditor';

interface CodeBlockProps {
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  context: ContextBlockType;
  outerContext: ContextBlockType;
  setTopic: (value: string) => void;
  setSubtopic: (value: string) => void;
  setInputPath: (inputPath: { [key: string]: unknown }) => void;
  loading: boolean;
  handleQuantifiableChange: (variableName: string, value: string) => void;
  handleInputQuantifiableChange: (variableName: string, value: string) => void;
  copyInputQuantifiable: (variableName: string, inputName: string, inputDetailIndex: number) => void;
  handleSubclassChange: (variableName: string, subclassName: string) => void;
  handleArgumentChange: (variableName: string, argName: string, value: unknown) => void;
  handleInputArgumentChange: (variableName: string, argName: string, value: unknown) => void;
  copyInputArgument: (variableName: string, inputName: string, argName: string, inputDetailIndex: number) => void;
  handleArgumentInit: (argumentsInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => void;
  handleInputInit: (inputInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => void;
  copyInputInit: (variableName: string, inputName: string, inputDetailIndex: number, index?: number) => void;
  setUserAlgoCode: (userAlgoCode: string, index?: number) => void;
  setUserEnvCode: (userEnvCode: string, index?: number) => void;
  removeInputDetailsItem: (inputDetailIndex: number) => void;
  copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => void;
  generatedInputs: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown } }>;
  setGeneratedInputs: (value: React.SetStateAction<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown } }>>) => void;
  outerGeneratedInputs: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown } }>;
  index?: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  tabValue,
  handleTabChange,
  context,
  outerContext,
  setTopic,
  setSubtopic,
  setInputPath,
  loading,
  handleQuantifiableChange,
  handleInputQuantifiableChange,
  copyInputQuantifiable,
  handleSubclassChange,
  handleArgumentChange,
  handleInputArgumentChange,
  copyInputArgument,
  handleArgumentInit,
  handleInputInit,
  copyInputInit,
  setUserAlgoCode,
  setUserEnvCode,
  removeInputDetailsItem,
  copyInputDetailsItem,
  generatedInputs,
  setGeneratedInputs,
  outerGeneratedInputs,
  index,
}) => {
  const [generatedVariables, setGeneratedVariables] = useState<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown } }>({ id: '', type: 'algo', context: {}, context_init: {} });
  const [generating, setGenerating] = useState<boolean>(false);
  const [useOuterContext, setUseOuterContext] = useState<boolean>(false);
  const [processorCodeSnippet, setProcessorCodeSnippetState] = useState<string>('');
  const [inputCodeSnippet, setInputCodeSnippetState] = useState<string>('');
  const [useGeneratedOuterInput, setUseGeneratedOuterInput] = useState<{ [key: string]: number }>({});
  const [useGeneratedInput, setUseGeneratedInput] = useState<{ [key: string]: number }>({});
  const [inputInit, setInputInit] = useState<{ [key: string]: { [arg: string]: unknown } }>({});
  const handleGenerateInput = async () => {
    try {
      if (context.inputDetails.length === 0 || context.inputDetails[context.inputDetails.length-1].inputVariables.length === 0) {
        return;
      }
      const request: GenerateInputRequest = {
        input_path: { ...context.inputDetails[context.inputDetails.length-1].inputPath },
        variable_options: convertInputArguments(context.inputDetails[context.inputDetails.length-1].inputVariableArguments, context.inputDetails[context.inputDetails.length-1].inputVariables),
        input_init: (outerContext.inputDetails.length > 0 && Object.keys(outerContext.inputDetails[0].inputPath).length > 0 && Object.values(useGeneratedOuterInput)[0] !== -1) ? { ...context.inputDetails[context.inputDetails.length-1].inputInit } : undefined,
        user_env_code: context.userEnvCode,
        element_type: context.inputDetails[context.inputDetails.length-1].selectedQuantifiables || {},
      };
      const data = await generateInput(request);
      if (index !== undefined) {
        setGeneratedInputs([{ id: uuidv4(), type: 'input', context: data.context, context_init: data.context_init }]);
      } else {
        setGeneratedInputs((prevInputs) => [...prevInputs, { id: uuidv4(), type: 'input', context: data.context, context_init: data.context_init }]);
      }
      setUseGeneratedInput({});
      copyInputArgument('', '', '', -1);
      copyInputQuantifiable('', '', -1);
      setInputInit({});
      handleInputInit(data.context_init, index);
    } catch (error) {
      console.error('Error generating variables:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateVariables = async () => {
    const convertedArguments = convertArguments(context.variableArguments, context.algoVariables, context.selectedSubclasses);
    setGenerating(true);
    try {
      const argumentsInit = Object.keys(inputInit).reduce((acc, key) => {
        acc[key] = inputInit[key];
        return acc;
      }, {} as { [key: string]: { [arg: string]: unknown } });
      const request: GenerateVariableRequest = {
        topic: context.selectedTopic,
        subtopic: context.selectedSubtopic,
        element_type: context.selectedQuantifiables,
        subclasses: context.selectedSubclasses,
        arguments: convertedArguments,
        arguments_init: argumentsInit,
        question_description: '',
        userAlgoCode: context.userAlgoCode,
        userEnvCode: context.userEnvCode,
      };
      const data = await generateVariable(request);
      setGeneratedVariables({ id: uuidv4(), type: 'algo', context: data.context, context_init: data.context_init });
      handleArgumentInit(data.context_init, index);
    } catch (error) {
      console.error('Error generating variables:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveAlgoCodeSnippet = () => {
    setUserAlgoCode(processorCodeSnippet, index);
  };

  const handleAlgoSnippetChange = (code: string) => {
    setProcessorCodeSnippetState(code);
  };

  const handleSaveInputCodeSnippet = () => {
    setUserEnvCode(inputCodeSnippet, index);
  };

  const handleInputSnippetChange = (code: string) => {
    setInputCodeSnippetState(code);
  };

  const handleDeleteGeneratedVariable = (id: string, variableName: string, index: number) => {
    setGeneratedInputs((prevInputs) =>
      prevInputs.reduce((acc, input) => {
        if (input.id === id) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [variableName]: _, ...rest } = input.context;
          if (Object.keys(rest).length > 0) {
            acc.push({ ...input, context: rest });
          }
        } else {
          acc.push(input);
        }
        return acc;
      }, [] as Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown } }>)
    );
    setUseGeneratedInput({});
    setUseGeneratedOuterInput({});
    removeInputDetailsItem(index);
    setInputInit({});
    copyInputArgument('', '', '', -1);
    copyInputQuantifiable('', '', -1);
  };

  const updateTabChange = (event: React.SyntheticEvent, newValue: number) => {
    handleTabChange(event, newValue);
    setUseGeneratedInput({});
    setUseGeneratedOuterInput({});
    setInputInit({});
    setGeneratedVariables({ id: '', type: 'algo', context: {}, context_init: {} })
    setGeneratedInputs([]);
  };

  return (
    <Box sx={{ marginBottom: 2, border: '1px solid #ccc', borderRadius: '4px', padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, color: 'primary' }}>
        Code block
      </Typography>
      <Tabs value={tabValue} onChange={updateTabChange} aria-label="algorithm type tabs" sx={{ marginBottom: 4 }}>
        <Tab label="Defined Algorithms" />
        <Tab label="User Algorithms" />
      </Tabs>
      <Accordion sx={{ marginBottom: 2, boxShadow: 2, borderRadius: '2px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
          <Typography variant="subtitle1">
            Input Selector
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <QuestionEnvSelector key={tabValue} tabValue={tabValue} setInputPath={setInputPath} />
          </Box>
        </AccordionDetails>
      </Accordion>
      {tabValue === 1 && context.inputDetails.length > 0 && Object.keys(context.inputDetails[context.inputDetails.length - 1].inputPath).length > 0 && (
        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ flexDirection: 'row-reverse' }}
          >
            <Typography>Define Code Snippet</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InputClassCodeSnippetEditor setInputCodeSnippet={handleInputSnippetChange} setInputCodeRequiredLines={() => { }} />
            <Button variant="contained" color="primary" onClick={handleSaveInputCodeSnippet} disabled={loading} sx={{ marginBottom: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Update Code'}
            </Button>
          </AccordionDetails>
        </Accordion>
      )}
      {!useOuterContext && context.inputDetails.length > 0 && context.inputDetails[context.inputDetails.length-1].inputVariables.length > 0 && (
        <>
          <Tooltip title="Variables are placeholders in your question. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
            <Typography variant="subtitle1">
              Input Variables (Use variable name in question description)
            </Typography>
          </Tooltip>
          <VariableTable
            variables={context.inputDetails[context.inputDetails.length-1].inputVariables}
            quantifiables={context.quantifiables}
            selectedQuantifiables={context.inputDetails[context.inputDetails.length-1].selectedQuantifiables || {}}
            selectedSubclasses={context.selectedSubclasses}
            variableArguments={context.inputDetails[context.inputDetails.length-1].inputVariableArguments}
            handleQuantifiableChange={handleInputQuantifiableChange}
            handleSubclassChange={handleSubclassChange}
            handleArgumentChange={handleInputArgumentChange}
            isAlgoTable={false}
            isInnerInputTable={index !== undefined}
            context={context}
            outerContext={outerContext}
            copyInputArgument={copyInputArgument}
            copyInputInit={copyInputInit}
            useGeneratedInput={useGeneratedOuterInput}
            setUseGeneratedInput={setUseGeneratedOuterInput}
            setInputInit={setInputInit}
            generatedInputs={generatedInputs}
            outerGeneratedInputs={outerGeneratedInputs}
            copyInputDetailsItem={copyInputDetailsItem}
            copyInputQuantifiable={copyInputQuantifiable}
          />
        </>
      )}
      <Button variant="contained" color="primary" onClick={handleGenerateInput} disabled={generating} sx={{ marginBottom: 2 }}>
        {generating ? <CircularProgress size={24} /> : 'Generate Input'}
      </Button>

      {generatedInputs.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Generated Variables
          </Typography>
          {generatedInputs.map((input, idx) => (
            <GeneratedVariablesTable key={input.id} generatedVariables={input} onDelete={(id: string, variableName: string) => handleDeleteGeneratedVariable(id, variableName, idx)} />
          ))}
        </>
      )}
      <Accordion sx={{ marginBottom: 2, boxShadow: 2, borderRadius: '2px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse'}}>
          <Typography variant="subtitle1" >
            Algo Selector
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <QuestionCategorySelector
              key={tabValue}
              tabValue={tabValue}
              setTopic={setTopic}
              setSubtopic={setSubtopic}
              context={context}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      {tabValue === 1 && context.selectedTopic && context.selectedSubtopic && (
        <Accordion sx={{ marginBottom: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ flexDirection: 'row-reverse' }}
          >
            <Typography>Define Code Snippet</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProcessorClassCodeSnippetEditor setProcessorCodeSnippet={handleAlgoSnippetChange} setProcessorCodeRequiredLines={() => { }} />
            <Button variant="contained" color="primary" onClick={handleSaveAlgoCodeSnippet} disabled={loading} sx={{ marginBottom: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Update Code'}
            </Button>
          </AccordionDetails>
        </Accordion>
      )}
      {index !== undefined && (
        <FormControlLabel
          control={
            <Checkbox
              checked={useOuterContext}
              onChange={(e) => {
                setUseOuterContext(e.target.checked);
                handleArgumentInit({}, index);
              }}
            />
          }
          label="Use Outer Context Variables"
          sx={{ marginTop: 2 }}
        />
      )}
      {!useOuterContext && context.algoVariables.length > 0 && (
        <>
          <Tooltip title="Variables are placeholders in your question. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
            <Typography variant="subtitle1">
              Algorithm Variables (Use variable name in question description)
            </Typography>
          </Tooltip>
          <VariableTable
            variables={context.algoVariables}
            quantifiables={context.quantifiables}
            selectedQuantifiables={context.selectedQuantifiables}
            selectedSubclasses={context.selectedSubclasses}
            variableArguments={context.variableArguments}
            handleQuantifiableChange={handleQuantifiableChange}
            handleSubclassChange={handleSubclassChange}
            handleArgumentChange={handleArgumentChange}
            isAlgoTable={true}
            isInnerInputTable={false}
            context={context}
            outerContext = {initialState.context}
            copyInputArgument={copyInputArgument}
            copyInputInit={copyInputInit}
            useGeneratedInput={useGeneratedInput}
            setUseGeneratedInput={setUseGeneratedInput}
            setInputInit={setInputInit}
            generatedInputs={generatedInputs}
            outerGeneratedInputs={outerGeneratedInputs}
            copyInputDetailsItem={copyInputDetailsItem}
            copyInputQuantifiable={copyInputQuantifiable}
          />
          <Button variant="contained" color="primary" onClick={handleGenerateVariables} disabled={generating} sx={{ marginTop: 2 }}>
            {generating ? <CircularProgress size={24} /> : 'Generate Variables'}
          </Button>
          {Object.keys(generatedVariables.context).length > 0 && (
            <GeneratedVariablesTable generatedVariables={generatedVariables} onDelete={() => {}} />
          )}
        </>
      )}
    </Box>
  );
};

export default CodeBlock;
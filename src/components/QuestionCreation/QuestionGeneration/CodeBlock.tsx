import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, CircularProgress, Tabs, Tab, FormControlLabel, Checkbox, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VariableTable from './VariableTable';
import QuestionCategorySelector from './QuestionCategorySelector';
import { GenerateInputRequest, GenerateVariableRequest, Variable, generateInput, generateVariable } from '../../../utils/api/QuestionGenerationAPI';
import { convertArguments, convertArgumentValue } from '../../../utils/format';
import { ContextBlockType } from '../../../reducer/questionGenerationReducer';
import ProcessorClassCodeSnippetEditor from '../ClassCodeSnippetEditors/ProcessorClassCodeSnippetEditor';
import QuestionEnvSelector from './QuestionEnvSelector';
import GeneratedVariablesTable from '../../Table/GeneratedVariablesTable';

interface CodeBlockProps {
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  context: ContextBlockType;
  setTopic: (value: string) => void;
  setSubtopic: (value: string) => void;
  loading: boolean;
  handleQuantifiableChange: (variableName: string, value: string) => void;
  handleSubclassChange: (variableName: string, subclassName: string) => void;
  handleArgumentChange: (variableName: string, argName: string, value: any) => void;
  handleInputArgumentChange: (variableName: string, argName: string, value: any) => void;
  copyInputArgument: (variableName: string, inputName: string, argName: string) => void;
  handleArgumentInit: (argumentsInit: { [key: string]: { [arg: string]: any } }, index?: number) => void;
  handleInputInit: (inputInit: { [key: string]: { [arg: string]: any } }, index?: number) => void;
  copyInputInit: (variableName: string, inputName: string, index?: number) => void;
  setUserAlgoCode: (userAlgoCode: string, index?: number) => void;
  setUserEnvCode: (userEnvCode: string, index?: number) => void;
  index?: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  tabValue,
  handleTabChange,
  context,
  setTopic,
  setSubtopic,
  loading,
  handleQuantifiableChange,
  handleSubclassChange,
  handleArgumentChange,
  handleInputArgumentChange,
  copyInputArgument,
  handleArgumentInit,
  handleInputInit,
  copyInputInit,
  setUserAlgoCode,
  index,
}) => {
  const [generatedInput, setGeneratedInput] = useState<{ context: { [key: string]: any }, context_init: { [key: string]: any } }>({ context: {}, context_init: {} });
  const [generatedVariables, setGeneratedVariables] = useState<{ context: { [key: string]: any }, context_init: { [key: string]: any } }>({ context: {}, context_init: {} });
  const [generating, setGenerating] = useState<boolean>(false);
  const [useOuterContext, setUseOuterContext] = useState<boolean>(false);
  const [processorCodeSnippet, setProcessorCodeSnippetState] = useState<string>('');
  const [inputVariable, setInputVariable] = useState<Variable>([]);
  const [inputPath, setInputPath] = useState<{ [key: string]: any }>({});
  const [useGeneratedInput, setUseGeneratedInput] = useState<{ [key: string]: boolean }>({});
  const [inputInit, setInputInit] = useState<{ [key: string]: { [arg: string]: any } }>({});
  const handleGenerateInput = async () => {
    try {
      if (inputVariable.length === 0) {
        return;
      }
      const convertedVariableArguments = Object.keys(context.inputVariableArguments).reduce((acc, variableName) => {
        acc[variableName] = Object.keys(context.inputVariableArguments[variableName]).reduce((argAcc, argName) => {
          const argType = inputVariable.find(v => v.name === variableName)?.arguments?.find(a => a.name === argName)?.type;
          if (argType) {
            argAcc[argName] = convertArgumentValue(argType, context.inputVariableArguments[variableName][argName]);
          }
          return argAcc;
        }, {} as { [key: string]: any });
        return acc;
      }, {} as { [key: string]: { [arg: string]: any } });

      const request: GenerateInputRequest = {
        input_path: { ...inputPath },
        variable_options: convertedVariableArguments,
      };
      const data = await generateInput(request)
      setGeneratedInput({ context: data.context, context_init: data.context_init });
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
      const request: GenerateVariableRequest = {
        topic: context.selectedTopic,
        subtopic: context.selectedSubtopic,
        element_type: context.selectedQuantifiables,
        subclasses: context.selectedSubclasses,
        arguments: convertedArguments,
        // arguments_init: context.argumentsInit || {},
        arguments_init: inputInit || {},
        question_description: '',
        userAlgoCode: context.userAlgoCode,
      };
      const data = await generateVariable(request);
      setGeneratedVariables({ context: data.context, context_init: data.context_init });
      handleArgumentInit(data.context_init, index);
    } catch (error) {
      console.error('Error generating variables:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveCodeSnippet = () => {
    setUserAlgoCode(processorCodeSnippet, index);
  };

  const handleSnippetChange = (code: string) => {
    setProcessorCodeSnippetState(code);
  };

  const checkArgumentType = (type: string): boolean => {
    if (context.inputInit) {
      const inputInitKeys = Object.keys(context.inputInit);
      if (inputInitKeys.length > 0) {
        if (type.includes(inputInitKeys[0])) {
          return true;
        }
      }
    }
    if (inputVariable.length > 0) {
      if (type.includes(inputVariable[0].type)) {
        return true;
      }
    }
    return false
  }


  return (
    <Box sx={{ marginBottom: 2, border: '1px solid #ccc', borderRadius: '4px', padding: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2, color: 'primary' }}>
        Code block
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="algorithm type tabs" sx={{ marginBottom: 4 }}>
        <Tab label="Defined Algorithms" />
        <Tab label="User Algorithms" />
      </Tabs>
      <Accordion sx={{ marginBottom: 2, boxShadow: 2, borderRadius: '2px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
          <Typography variant="subtitle1" gutterBottom>
            Input Selector
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <QuestionEnvSelector tabValue={tabValue} setInputVariable={setInputVariable} setInputPath={setInputPath}/>
          </Box>
        </AccordionDetails>
      </Accordion>
      <VariableTable
          variables={inputVariable}
          quantifiables={context.quantifiables}
          selectedQuantifiables={context.selectedQuantifiables}
          selectedSubclasses={context.selectedSubclasses}
          variableArguments={context.inputVariableArguments}
          handleQuantifiableChange={handleQuantifiableChange}
          handleSubclassChange={handleSubclassChange}
          handleArgumentChange={handleInputArgumentChange}
          isAlgoTable={false}
          context={context}
          copyInputArgument={copyInputArgument}
          copyInputInit={copyInputInit}
          useGeneratedInput={useGeneratedInput}
          setUseGeneratedInput={setUseGeneratedInput}
          checkArgumentType={checkArgumentType}
          setInputInit={setInputInit}
      />
      <Button variant="contained" color="primary" onClick={handleGenerateInput} disabled={generating} sx={{ marginBottom: 2 }}>
        {generating ? <CircularProgress size={24} /> : 'Generate Input'}
      </Button>
      {Object.keys(generatedInput.context).length > 0 && (
        <GeneratedVariablesTable generatedVariables={generatedInput}/>
      )}
      <Accordion sx={{ marginBottom: 2, boxShadow: 2, borderRadius: '2px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ flexDirection: 'row-reverse' }}>
          <Typography variant="subtitle1" gutterBottom>
            Algo Selector
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <QuestionCategorySelector
              tabValue={tabValue}
              setTopic={setTopic}
              setSubtopic={setSubtopic}
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
            <ProcessorClassCodeSnippetEditor setProcessorCodeSnippet={handleSnippetChange} setProcessorCodeRequiredLines={()=>{}} />
            <Button variant="contained" color="primary" onClick={handleSaveCodeSnippet} disabled={loading} sx={{ marginBottom: 2 }}>
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
            context={context}
            copyInputArgument={copyInputArgument}
            copyInputInit={copyInputInit}
            useGeneratedInput={useGeneratedInput}
            setUseGeneratedInput={setUseGeneratedInput}
            checkArgumentType={checkArgumentType}
            setInputInit={setInputInit}
          />
          <Button variant="contained" color="primary" onClick={handleGenerateVariables} disabled={generating} sx={{ marginTop: 2 }}>
            {generating ? <CircularProgress size={24} /> : 'Generate Variables'}
          </Button>
          {Object.keys(generatedVariables.context).length > 0 && (
            <GeneratedVariablesTable generatedVariables={generatedVariables} />
          )}
        </>
      )}
    </Box>
  );
};

export default CodeBlock;
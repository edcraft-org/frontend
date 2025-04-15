import type React from "react"
import { useState } from "react"
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Paper,
  Divider,
  useTheme,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputIcon from "@mui/icons-material/Input"
import CodeIcon from "@mui/icons-material/Code"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import QuestionEnvSelector from "./QuestionEnvSelector"
import QuestionCategorySelector from "./QuestionCategorySelector"
import { GenerateInputRequest, GenerateVariableRequest, GeneratedContext, generateInput, generateVariable } from '../../../utils/api/QuestionGenerationAPI';
import { convertArguments, convertInputArguments } from '../../../utils/format';
import { AlgoDetailsType, ContextBlockType, initialState, InputDetailsType } from '../../../reducer/questionGenerationReducer';
import VariableTable from "./VariableTable"
import ProcessorClassCodeSnippetEditor from '../ClassCodeSnippetEditors/ProcessorClassCodeSnippetEditor';
import InputClassCodeSnippetEditor from "../ClassCodeSnippetEditors/InputClassCodeSnippetEditor"
import { v4 as uuidv4 } from 'uuid';


interface AddContextButtonProps {
  context: ContextBlockType;
  outerContext: ContextBlockType;
  setTopic: (value: string) => void;
  setSubtopic: (value: string) => void;
  setInputPath: (inputPath: { [key: string]: unknown }) => void;
  loading: boolean;
  handleQuantifiableChange: (variableName: string, value: string) => void;
  handleInputQuantifiableChange: (variableName: string, value: string) => void;
  handleSubclassChange: (variableName: string, subclassName: string) => void;
  handleArgumentChange: (variableName: string, argName: string, value: unknown) => void;
  handleInputArgumentChange: (variableName: string, argName: string, value: unknown) => void;
  copyInputDetails: (variableName: string, inputName: string, inputDetailIndex: number, args?: string[]) => void;
  handleArgumentInit: (argumentsInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => void;
  handleInputInit: (inputInit: { [key: string]: { [arg: string]: unknown } }, index?: number) => void;
  setUserAlgoCode: (userAlgoCode: string, index?: number) => void;
  setUserEnvCode: (userEnvCode: string, index?: number) => void;
  addDetailsItem: (isAlgo: boolean) => void;
  removeDetailsItem: (inputDetailIndex: number, deleteGenerated: boolean) => void;
  copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => void;
  outerGeneratedContext: GeneratedContext;
  index?: number;
  generatedContext: GeneratedContext
  setGeneratedContext: (value: React.SetStateAction<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>>) => void;
}

const AddContextButton: React.FC<AddContextButtonProps> = ({
  context,
  outerContext,
  setTopic,
  setSubtopic,
  setInputPath,
  loading,
  handleQuantifiableChange,
  handleInputQuantifiableChange,
  handleSubclassChange,
  handleArgumentChange,
  handleInputArgumentChange,
  copyInputDetails,
  handleArgumentInit,
  handleInputInit,
  setUserAlgoCode,
  setUserEnvCode,
  addDetailsItem,
  removeDetailsItem,
  copyInputDetailsItem,
  outerGeneratedContext,
  index,
  generatedContext,
  setGeneratedContext
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [contextType, setContextType] = useState<"input" | "algo" | null>(null)
  const [processorCodeSnippet, setProcessorCodeSnippetState] = useState<string>('');
  const [inputCodeSnippet, setInputCodeSnippetState] = useState<string>('');
  const [useGeneratedInput, setUseGeneratedInput] = useState<{ [key: string]: number }>({});
  const [inputInit, setInputInit] = useState<{ [key: string]: { [arg: string]: unknown } }>({});
  const [useGeneratedOuterInput, setUseGeneratedOuterInput] = useState<{ [key: string]: number }>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenerateInput = async () => {
    try {
      if (context.details.length === 0 || context.details[context.details.length-1].type == 'algo' || (context.details[context.details.length-1].details as InputDetailsType).inputVariables.length === 0) {
        return;
      }
      const inputDetails = context.details[context.details.length-1].details as InputDetailsType;

      let outerInputDetails;
      if (outerContext.details.length > 0 &&
          outerContext.details[outerContext.details.length-1].type === 'input' &&
          Object.keys(useGeneratedOuterInput).length > 0 &&
          Object.values(useGeneratedOuterInput)[0] !== -1) {
        const outerDetails = outerContext.details[outerContext.details.length-1].details as InputDetailsType;
        outerInputDetails = { ...outerDetails.inputInit };
      }

      const request: GenerateInputRequest = {
        input_path: { ...inputDetails.inputPath },
        variable_options: convertInputArguments(inputDetails.inputVariableArguments, inputDetails.inputVariables),
        input_init: outerInputDetails || undefined,
        user_env_code: inputDetails.userEnvCode,
        element_type: inputDetails.selectedQuantifiables || {},
      };
      const data = await generateInput(request);
      setGeneratedContext((prevContexts) => [...prevContexts, { id: uuidv4(), type: 'input', context: data.context, context_init: data.context_init, name: data.cls_name, has_output: data.has_output }]);
      setUseGeneratedInput({});
      copyInputDetails('', '', -1, []);
      setInputInit({});
      handleInputInit(data.context_init, index);
    } catch (error) {
      console.error('Error generating variables:', error);
    }
  };

  const handleGenerateVariables = async () => {
    if (context.details.length === 0 || context.details[context.details.length-1].type == 'input' || (context.details[context.details.length-1].details as AlgoDetailsType).algoVariables.length === 0) {
      return false;
    }
    const algoDetails = context.details[context.details.length-1].details as AlgoDetailsType;

    const variablesWithSubclasses = algoDetails.algoVariables.filter(
      variable => variable.subclasses && variable.subclasses.length > 0
    );

    if (variablesWithSubclasses.length > 0) {
      const hasSelectedSubclass = variablesWithSubclasses.some(
        variable => algoDetails.selectedSubclasses[variable.name] &&
                  algoDetails.selectedSubclasses[variable.name].length > 0
      );

      if (!hasSelectedSubclass) {
        setValidationError("Please select at least one subclass.");
        return false;
      }
    }

    setValidationError(null);

    const convertedArguments = convertArguments(algoDetails.variableArguments, algoDetails.algoVariables, algoDetails.selectedSubclasses);
    try {
      const argumentsInit = Object.keys(inputInit).reduce((acc, key) => {
        acc[key] = inputInit[key];
        return acc;
      }, {} as { [key: string]: { [arg: string]: unknown } });
      const request: GenerateVariableRequest = {
        topic: algoDetails.selectedTopic,
        subtopic: algoDetails.selectedSubtopic,
        element_type: algoDetails.selectedQuantifiables,
        subclasses: algoDetails.selectedSubclasses,
        arguments: convertedArguments,
        arguments_init: argumentsInit,
        question_description: '',
        userAlgoCode: algoDetails.userAlgoCode,
        userEnvCode: algoDetails.userEnvCode,
      };
      const data = await generateVariable(request);
      setGeneratedContext((prevContexts) => [...prevContexts, { id: uuidv4(), type: 'algo', context: data.context, context_init: data.context_init, name: data.cls_name, has_output: data.has_output }]);
      setUseGeneratedInput({});
      setInputInit({});
      handleArgumentInit(data.context_init, index);
      return true
    } catch (error) {
      console.error('Error generating variables:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true)
    setStep(0)
    setContextType(null)
    setValidationError(null)
  }

  const handleClose = () => {
    setOpen(false)
    removeDetailsItem(context.details.length-1, false);
    setUseGeneratedInput({});
    setValidationError(null)
  }

  const handleBack = () => {
    setStep(0)
    removeDetailsItem(context.details.length-1, false);
    setUseGeneratedInput({});
  }

  const handleTypeSelect = (type: "input" | "algo") => {
    setContextType(type)
    setStep(1)
    addDetailsItem(type == 'algo')
  }

  const handleConfirm = async () => {
    if (contextType === "input") {
      handleGenerateInput()

    } else if (contextType === "algo") {
      if (!await handleGenerateVariables()) {
        return
      }
    }
    setOpen(false)
    setUseGeneratedInput({});
  }

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


  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <IconButton
          color="primary"
          onClick={handleOpen}
          sx={{
            border: "2px dashed rgba(25, 118, 210, 0.5)",
            borderRadius: "50%",
            // p: 1.5,
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              border: "2px dashed rgba(25, 118, 210, 0.8)",
              transform: "scale(1.05)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: "800px",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {step === 1 && (
            <IconButton size="small" onClick={() => handleBack()} sx={{ mr: 1 }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}
          <Typography variant="h6" component="span">
            {step === 0 ? "Add New Context" : contextType === "input" ? "Select Input Type" : "Select Algorithm Type"}
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3, pb: 3 }}>
          {step === 0 && (
            <Box sx={{ display: "flex", gap: 3, p: 1 }}>
              <Paper
                elevation={2}
                onClick={() => handleTypeSelect("input")}
                sx={{
                  width: "50%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    borderColor: theme.palette.primary.light,
                  },
                }}
              >
                <InputIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Input
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Add input context
                </Typography>
              </Paper>

              <Paper
                elevation={2}
                onClick={() => handleTypeSelect("algo")}
                sx={{
                  width: "50%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    borderColor: theme.palette.secondary.light,
                  },
                }}
              >
                <CodeIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 2 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Algorithm
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Add algorithm context
                </Typography>
              </Paper>
            </Box>
          )}

          {step === 1 && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {contextType === "input"
                  ? "Select the type of input you want to add."
                  : "Select the algorithm type you want to add."
                }
              </Typography>

              {contextType === "input" ? (
                <>
                  <QuestionEnvSelector
                    setInputPath={setInputPath}
                  />
                    <Accordion sx={{ marginY: 2 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ flexDirection: 'row-reverse' }}
                      >
                        <Typography>Define Code Snippet</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <InputClassCodeSnippetEditor setInputCodeSnippet={handleInputSnippetChange} setInputCodeRequiredLines={() => { }} />
                        <Button variant="contained" color="primary" onClick={handleSaveInputCodeSnippet} disabled={loading} sx={{ marginBottom: 2 }}>
                          {loading ? <CircularProgress size={24} /> : 'Apply Code'}
                        </Button>
                      </AccordionDetails>
                    </Accordion>
                  {context.details.length > 0 && context.details[context.details.length-1].type == 'input' && ((context.details[context.details.length-1].details as InputDetailsType).inputVariables?.length > 0) && (
                    <>
                      <Tooltip title="Variables are placeholders in your question. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
                        <Typography variant="subtitle1">
                          Input Variables (Use variable name in question description)
                        </Typography>
                      </Tooltip>
                      <VariableTable
                        variables={(context.details[context.details.length-1].details as InputDetailsType).inputVariables}
                        quantifiables={context.quantifiables}
                        selectedQuantifiables={context.details[context.details.length-1].details.selectedQuantifiables || {}}
                        selectedSubclasses={{}}
                        variableArguments={(context.details[context.details.length-1].details as InputDetailsType).inputVariableArguments}
                        handleQuantifiableChange={handleInputQuantifiableChange}
                        handleSubclassChange={handleSubclassChange}
                        handleArgumentChange={handleInputArgumentChange}
                        isAlgoTable={false}
                        isInnerInputTable={index !== undefined}
                        context={context}
                        outerContext={outerContext}
                        copyInputDetails={copyInputDetails}
                        useGeneratedInput={useGeneratedOuterInput}
                        setUseGeneratedInput={setUseGeneratedOuterInput}
                        setInputInit={setInputInit}
                        generatedContext={generatedContext}
                        outerGeneratedContext={outerGeneratedContext}
                        copyInputDetailsItem={copyInputDetailsItem}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <QuestionCategorySelector
                    setTopic={setTopic}
                    setSubtopic={setSubtopic}
                    context={context}
                  />
                  <Accordion sx={{ marginY: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ flexDirection: 'row-reverse' }}
                    >
                      <Typography>Define Code Snippet</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ProcessorClassCodeSnippetEditor setProcessorCodeSnippet={handleAlgoSnippetChange} setProcessorCodeRequiredLines={() => { }} />
                      <Button variant="contained" color="primary" onClick={handleSaveAlgoCodeSnippet} disabled={loading} sx={{ marginBottom: 2 }}>
                        {loading ? <CircularProgress size={24} /> : 'Apply Code'}
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  {context.details.length > 0 && context.details[context.details.length-1].type == 'algo' && ((context.details[context.details.length-1].details as AlgoDetailsType).algoVariables?.length > 0) && (
                    <>
                      <Tooltip title="Variables are placeholders in your question. Use {Input}, {Step}, etc. in your question description to represent these variables." placement="bottom-start">
                        <Typography variant="subtitle1">
                          Algorithm Variables (Use variable name in question description)
                        </Typography>
                      </Tooltip>
                      <VariableTable
                        variables={(context.details[context.details.length-1].details as AlgoDetailsType).algoVariables}
                        quantifiables={context.quantifiables}
                        selectedQuantifiables={(context.details[context.details.length-1].details as AlgoDetailsType).selectedQuantifiables}
                        selectedSubclasses={(context.details[context.details.length-1].details as AlgoDetailsType).selectedSubclasses}
                        variableArguments={(context.details[context.details.length-1].details as AlgoDetailsType).variableArguments}
                        handleQuantifiableChange={handleQuantifiableChange}
                        handleSubclassChange={handleSubclassChange}
                        handleArgumentChange={handleArgumentChange}
                        isAlgoTable={true}
                        isInnerInputTable={false}
                        context={context}
                        outerContext = {initialState.context}
                        copyInputDetails={copyInputDetails}
                        useGeneratedInput={useGeneratedInput}
                        setUseGeneratedInput={setUseGeneratedInput}
                        setInputInit={setInputInit}
                        generatedContext={generatedContext}
                        outerGeneratedContext={outerGeneratedContext}
                        copyInputDetailsItem={copyInputDetailsItem}
                      />
                    </>
                  )}
                </>
              )}
            </Box>
          )}
        </DialogContent>

        {validationError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setValidationError(null)}
          >
            {validationError}
          </Alert>
        )}

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 1 }}>
            Cancel
          </Button>

          {step === 1 && (
            <Button
              variant="contained"
              onClick={handleConfirm}
              sx={{
                borderRadius: 1,
                px: 3,
                backgroundColor: contextType === "input" ? theme.palette.primary.main : theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: contextType === "input" ? theme.palette.primary.dark : theme.palette.secondary.dark,
                },
              }}
            >
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddContextButton


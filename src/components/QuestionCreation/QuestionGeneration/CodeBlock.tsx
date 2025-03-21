import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { AlgoDetailsType, ContextBlockType, InputDetailsType } from '../../../reducer/questionGenerationReducer';
import GeneratedVariablesTable from '../../Table/GeneratedVariablesTable';
import AddContextButton from './AddContextButton';
import GeneratedAlgosTable from '../../Table/GeneratedAlgosTable';
import { convertArguments } from '../../../utils/format';
import { generateOutput, GenerateVariableRequest } from '../../../utils/api/QuestionGenerationAPI';
import { v4 as uuidv4 } from 'uuid';

interface CodeBlockProps {
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
  handleAddGeneratedOutput: (input_path: { [key: string]: unknown }, input_init: { [key: string]: { [arg: string]: unknown } }, user_env_code: string) => void;
  outerGeneratedContext: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>;
  generatedContext: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>;
  setGeneratedContext: (value: React.SetStateAction<Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean, name?: string }>>) => void;
  index?: number;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
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
  handleAddGeneratedOutput,
  outerGeneratedContext,
  generatedContext,
  setGeneratedContext,
  index,
}) => {

  const handleDeleteGeneratedVariable = (id: string, variableName: string, index: number) => {
    setGeneratedContext((prevContexts) =>
      prevContexts.reduce((acc, input) => {
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
      }, [] as Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: unknown }, context_init: { [key: string]: unknown }, has_output: boolean }>)
    );
    // setUseGeneratedInput({});
    // setUseGeneratedOuterInput({});
    removeDetailsItem(index, true);
    // setInputInit({});
    // copyInputArgument('', '', '', -1);
    // copyInputQuantifiable('', '', -1);
    // copyInputDetails('', '', -1, []);
  };

  const handleGenerateOutput = async (algoDetails: AlgoDetailsType) => {
    const convertedArguments = convertArguments(algoDetails.variableArguments, algoDetails.algoVariables, algoDetails.selectedSubclasses);
    try {
      const request: GenerateVariableRequest = {
        topic: algoDetails.selectedTopic,
        subtopic: algoDetails.selectedSubtopic,
        element_type: algoDetails.selectedQuantifiables,
        subclasses: algoDetails.selectedSubclasses,
        arguments: convertedArguments,
        arguments_init: algoDetails.argumentsInit,
        question_description: '',
        userAlgoCode: algoDetails.userAlgoCode,
        userEnvCode: algoDetails.userEnvCode,
      };
      const data = await generateOutput(request);
      if (Object.keys(data.context).length === 0) {
        return;
      }

      handleAddGeneratedOutput(data.output_path, data.output_init, data.user_env_code ?? '');
      setGeneratedContext((prevContexts) => [...prevContexts, { id: uuidv4(), type: 'input', context: data.context, context_init: data.output_init, has_output: false}]);
    } catch (error) {
      console.error('Error generating output:', error);
    }
  }

  return (
    <Box sx={{ marginBottom: 2, border: '1px solid #ccc', borderRadius: '4px', padding: 2 }}>
      {generatedContext.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Generated Context
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {generatedContext.map((contextItem, idx) => (
            (contextItem.type === 'input') ? (
              <GeneratedVariablesTable key={contextItem.id} generatedVariables={contextItem} onDelete={(id: string, variableName: string) => handleDeleteGeneratedVariable(id, variableName, idx)} />
            ) :(
              <GeneratedAlgosTable key={contextItem.id} generatedVariables={contextItem} contextDetail={context.details[idx]} onDelete={(id: string, variableName: string) => handleDeleteGeneratedVariable(id, variableName, idx)} onGenerateOutput={()=>{handleGenerateOutput(context.details[idx].details as AlgoDetailsType)}}/>
            )
          ))}
          <Divider/>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 2 }}>
        <AddContextButton
          context={context}
          outerContext={outerContext}
          setTopic={setTopic}
          setSubtopic={setSubtopic}
          setInputPath={setInputPath}
          loading={loading}
          handleQuantifiableChange={handleQuantifiableChange}
          handleInputQuantifiableChange={handleInputQuantifiableChange}
          handleSubclassChange={handleSubclassChange}
          handleArgumentChange={handleArgumentChange}
          handleInputArgumentChange={handleInputArgumentChange}
          copyInputDetails={copyInputDetails}
          handleArgumentInit={handleArgumentInit}
          handleInputInit={handleInputInit}
          setUserAlgoCode={setUserAlgoCode}
          setUserEnvCode={setUserEnvCode}
          addDetailsItem={addDetailsItem}
          removeDetailsItem={removeDetailsItem}
          copyInputDetailsItem={copyInputDetailsItem}
          outerGeneratedContext={outerGeneratedContext}
          index={index}
          generatedContext={generatedContext}
          setGeneratedContext={setGeneratedContext}
        />
        <Typography variant="body1" color="text.secondary" sx={{ marginLeft: 2 }}>
          Add Context
        </Typography>
      </Box>
    </Box>
  );
};

export default CodeBlock;
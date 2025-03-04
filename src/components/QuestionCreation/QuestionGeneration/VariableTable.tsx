import React, { useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { Variable, Quantifiable, VariableItem } from '../../../utils/api/QuestionGenerationAPI';
import { ContextBlockType, InputDetailsType } from '../../../reducer/questionGenerationReducer';
import CodeSnippetEditor from '../CodeSnippetEditor';

interface VariableTableProps {
  variables: Variable;
  quantifiables: Quantifiable[];
  selectedQuantifiables: { [key: string]: string };
  selectedSubclasses: { [key: string]: string };
  variableArguments: { [key: string]: { [arg: string]: any } };
  handleQuantifiableChange: (variableName: string, value: string) => void;
  handleSubclassChange: (variableName: string, subclassName: string) => void;
  handleArgumentChange: (variableName: string, argName: string, value: any) => void;
  isAlgoTable: boolean;
  isInnerInputTable: boolean;
  context: ContextBlockType;
  outerContext: ContextBlockType;
  copyInputArgument: (variableName: string, inputName: string, argName: string, inputDetailIndex: number) => void;
  copyInputInit: (variableName: string, inputName: string, inputDetailIndex: number) => void;
  useGeneratedInput: { [key: string]: number };
  setUseGeneratedInput: (value: React.SetStateAction<{[key: string]: number}>) => void;
  setInputInit: (value: React.SetStateAction<{[key: string]: { [arg: string]: any}}>) => void;
  generatedInputs: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: any }, context_init: { [key: string]: any } }>;
  outerGeneratedInputs: Array<{ id: string, type: 'input' | 'algo', context: { [key: string]: any }, context_init: { [key: string]: any } }>;
  copyInputDetailsItem: (inputDetailsItem: InputDetailsType) => void;
}

const VariableTable: React.FC<VariableTableProps> = ({
  variables,
  quantifiables,
  selectedQuantifiables,
  selectedSubclasses,
  variableArguments,
  handleQuantifiableChange,
  handleSubclassChange,
  handleArgumentChange,
  isAlgoTable,
  isInnerInputTable,
  context,
  outerContext,
  copyInputArgument,
  setInputInit,
  useGeneratedInput,
  setUseGeneratedInput,
  generatedInputs,
  outerGeneratedInputs,
  copyInputDetailsItem,
}) => {
  const isQuantifiable = (type: string): boolean => {
    return type === 'Quantifiable' || type.includes('Quantifiable');
  };
  const [codeSnippets, setCodeSnippets] = useState<{ [key: string]: string }>({});
  const inputDetails = isInnerInputTable ? outerContext.inputDetails : context.inputDetails;
  const referenceGeneratedInputs = isInnerInputTable ? outerGeneratedInputs : generatedInputs;
  const handleUseGeneratedInputChange = (useOuterInput: boolean, variable: VariableItem, inputDetailIndex: number | null) => {
    if (useOuterInput) {
      handleUseOuterGeneratedInputChange(variable, inputDetailIndex);
    } else {
      handleAlgoUseGeneratedInputChange(variable, inputDetailIndex);
    }
  };

  const handleAlgoUseGeneratedInputChange = (variable: VariableItem, inputDetailIndex: number | null) => {
    if (inputDetailIndex !== null && inputDetailIndex !== -1 && inputDetails[inputDetailIndex].inputInit && Object.keys(inputDetails[inputDetailIndex].inputInit).length > 0) {
      const inputName = Object.keys(inputDetails[inputDetailIndex].inputInit)[0];
      variable.arguments?.forEach((arg) => {
        copyInputArgument(variable.name, inputName, arg.name, inputDetailIndex);
      });
      handleSubclassChange(variable.name, inputName);
      setInputInit({[variable.name]: inputDetails[inputDetailIndex].inputInit[inputName]});
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }));
    }
    if (inputDetailIndex === -1) {
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }));
      setInputInit((prev) => {
        const newInputInit = { ...prev };
        delete newInputInit[variable.name];
        return newInputInit;
      });
    }
  };

  const handleUseOuterGeneratedInputChange = (variable: VariableItem, inputDetailIndex: number | null) => {
    if (inputDetailIndex !== null && inputDetailIndex !== -1 && inputDetails[inputDetailIndex].inputInit && Object.keys(inputDetails[inputDetailIndex].inputInit).length > 0) {
      copyInputDetailsItem(inputDetails[inputDetailIndex]);
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }));
    }
    if (inputDetailIndex === -1) {
      setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: inputDetailIndex }));
      copyInputDetailsItem({...context.inputDetails[0], inputInit: {}});
    }
  };

  const handleCodeSnippetChange = (variableName: string, argName: string, code: string) => {
    setCodeSnippets((prev) => ({
      ...prev,
      [`${variableName}_${argName}`]: code,
    }));
    handleArgumentChange(variableName, argName, code);
  };

  const hasQuantifiable = variables.some((variable) => isQuantifiable(variable.type));
  const hasSubclasses = variables.some((variable) => variable.subclasses && variable.subclasses.length > 0);
  const hasMatchingInput = (type: string) => inputDetails.length > 0 && inputDetails.some((_inputDetail, index) => checkArgumentType(type, index));

  const checkArgumentType = (type: string, inputDetailIndex: number): boolean => {
    if (inputDetails.length > inputDetailIndex) {
      if (inputDetails[inputDetailIndex].inputInit) {
        const inputInitKeys = Object.keys(inputDetails[inputDetailIndex].inputInit);
        if (inputInitKeys.length > 0) {
          if (type.includes(inputInitKeys[0])) {
            return true;
          }
        }
      }
      const inputVariable = inputDetails[inputDetailIndex].inputVariables;
      if (inputVariable.length > 0) {
        if (type.includes(inputVariable[0].type)) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 2, border: '1px solid #ccc' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '20%' }}>Variable Name</TableCell>
            <TableCell sx={{ width: '20%' }}>Variable Type</TableCell>
            {hasQuantifiable && <TableCell sx={{ width: '20%' }}>Quantifiable</TableCell>}
            {hasSubclasses && <TableCell sx={{ width: '20%' }}>Subclass</TableCell>}
            <TableCell sx={{ width: '20%' }}>Options</TableCell>
            {(isAlgoTable || isInnerInputTable) && <TableCell sx={{ width: '20%' }}>Use Generated Input</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => {
            const disableFields = (isAlgoTable || isInnerInputTable) && hasMatchingInput(variable.type) && useGeneratedInput[variable.name] != -1;
            return (
              <TableRow key={index}>
                <TableCell sx={{ width: '20%' }}>{variable.name}</TableCell>
                <TableCell sx={{ width: '20%' }}>{variable.type}</TableCell>
                {hasQuantifiable ? (
                  <TableCell sx={{ width: '20%' }}>
                    {isQuantifiable(variable.type) ? (
                      <FormControl fullWidth disabled={disableFields}>
                        <Select
                          value={selectedQuantifiables[variable.name] || ''}
                          onChange={(e) => handleQuantifiableChange(variable.name, e.target.value)}
                        >
                          {quantifiables.map((quantifiable) => (
                            <MenuItem key={quantifiable} value={quantifiable}>
                              {quantifiable}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField fullWidth value="N/A" disabled />
                    )}
                  </TableCell>
                ) : null}
                {hasSubclasses && (
                  <TableCell sx={{ width: '20%' }}>
                    {variable.subclasses && variable.subclasses.length > 0 ? (
                      <FormControl fullWidth disabled={disableFields}>
                        <Select
                          value={selectedSubclasses[variable.name] || ''}
                          onChange={(e) => handleSubclassChange(variable.name, e.target.value)}
                        >
                          {variable.subclasses.map((subclass) => (
                            <MenuItem key={subclass.name} value={subclass.name}>
                              {subclass.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField fullWidth value="N/A" disabled />
                    )}
                  </TableCell>
                )}
                {selectedSubclasses[variable.name] &&
                variables
                  .find((v) => v.name === variable.name)
                  ?.subclasses?.find((s) => s.name === selectedSubclasses[variable.name])?.arguments ? (
                  <TableCell sx={{ width: '20%' }}>
                    {variables
                      .find((v) => v.name === variable.name)
                      ?.subclasses?.find((s) => s.name === selectedSubclasses[variable.name])?.arguments.map((arg) => (
                        arg.type.includes('typing.Callable') ? (
                          <CodeSnippetEditor
                            key={arg.name}
                            title={`${arg.name} (${arg.type})`}
                            codeSnippet={codeSnippets[`${variable.name}_${arg.name}`] || ''}
                            setCodeSnippet={(code) => handleCodeSnippetChange(variable.name, arg.name, code)}
                          />
                        ) : (
                          <TextField
                            key={arg.name}
                            label={`${arg.name} (${arg.type})`}
                            value={variableArguments[variable.name]?.[arg.name] || ''}
                            onChange={(e) => handleArgumentChange(variable.name, arg.name, e.target.value)}
                            fullWidth
                            sx={{ marginBottom: 2 }}
                            disabled={disableFields}
                          />
                        )
                      ))}
                  </TableCell>
                ) : (
                  variable.arguments && (
                    <TableCell sx={{ width: '20%' }}>
                      {variable.arguments.map((arg) => (
                        arg.type === 'typing.Callable' ? (
                          <CodeSnippetEditor
                            key={arg.name}
                            title=''
                            codeSnippet={codeSnippets[`${variable.name}_${arg.name}`] || ''}
                            setCodeSnippet={(code) => handleCodeSnippetChange(variable.name, arg.name, code)}
                          />
                        ) : (
                          <TextField
                            key={arg.name}
                            label={`${arg.name} (${arg.type})`}
                            value={variableArguments[variable.name]?.[arg.name] || ''}
                            onChange={(e) => handleArgumentChange(variable.name, arg.name, e.target.value)}
                            fullWidth
                            disabled={disableFields}
                          />
                        )
                      ))}
                    </TableCell>
                  )
                )}
                {(isAlgoTable || isInnerInputTable) && (
                  <TableCell sx={{ width: '20%'}}>
                    <FormControl fullWidth>
                      <Select
                        value={useGeneratedInput[variable.name] !== undefined ? useGeneratedInput[variable.name].toString() : '-1'}
                        onChange={(e) => handleUseGeneratedInputChange(isInnerInputTable, variable, e.target.value === '-1' ? -1 : parseInt(e.target.value))}
                        displayEmpty
                      >
                        <MenuItem value="-1">
                          <em>None</em>
                        </MenuItem>
                        {inputDetails.map((_inputDetail, idx) => (
                          checkArgumentType(variable.type, idx) && referenceGeneratedInputs && referenceGeneratedInputs[idx] && (
                            <MenuItem key={idx} value={idx.toString()}>
                              {`Input: ${Object.values(referenceGeneratedInputs[idx].context)[0]}`}
                            </MenuItem>
                          )
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VariableTable;

import React, { useEffect, useState } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { Variable, Quantifiable, VariableItem } from '../../../utils/api/QuestionGenerationAPI';
import { ContextBlockType } from '../../../reducer/questionGenerationReducer';
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
  context: ContextBlockType;
  copyInputArgument: (variableName: string, inputName: string, argName: string) => void;
  copyInputInit: (variableName: string, inputName: string) => void;
  useGeneratedInput: { [key: string]: boolean };
  setUseGeneratedInput: (value: React.SetStateAction<{[key: string]: boolean}>) => void;
  checkArgumentType: (type: string) => boolean;
  setInputInit: (value: React.SetStateAction<{[key: string]: { [arg: string]: any}}>) => void;
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
  context,
  copyInputArgument,
  // copyInputInit,
  setInputInit,
  useGeneratedInput,
  setUseGeneratedInput,
  checkArgumentType
}) => {
  const isQuantifiable = (type: string): boolean => {
    return type === 'Quantifiable' || type.includes('Quantifiable');
  };
  const [inputName, setInputName] = useState<string>('');
  const [codeSnippets, setCodeSnippets] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (context.inputInit) {
      const inputInitKeys = Object.keys(context.inputInit);
      if (inputInitKeys.length > 0) {
        setInputName(inputInitKeys[0]);
      }
    }
    variables.map((variable) => {
      if (useGeneratedInput[variable.name] && checkArgumentType(variable.type)) {
        handleUseGeneratedInputChange(variable, useGeneratedInput[variable.name]);
      }
    });
  }, [context.inputInit]);


  const handleUseGeneratedInputChange = (variable: VariableItem, checked: boolean) => {
      if (checked) {
        variable.arguments?.forEach((arg) => {
          copyInputArgument(variable.name, inputName, arg.name);
        });
        handleSubclassChange(variable.name, inputName);
      if (context.inputInit) {
        setInputInit({[variable.name]: context.inputInit[inputName]});
      }
    }
    setUseGeneratedInput((prev) => ({ ...prev, [variable.name]: checked }));
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
  const hasGeneratedInput = variables.some((variable) => checkArgumentType(variable.type));
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
            {isAlgoTable && hasGeneratedInput && <TableCell sx={{ width: '20%' }}>Use Generated Input</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => {
            const disableFields = checkArgumentType(variable.type) && useGeneratedInput[variable.name];
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
                {isAlgoTable && checkArgumentType(variable.type) && (
                  <TableCell sx={{ width: '20%'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useGeneratedInput[variable.name] || false}
                          onChange={(e) => handleUseGeneratedInputChange(variable, e.target.checked)}
                        />
                      }
                      label=""
                    />
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

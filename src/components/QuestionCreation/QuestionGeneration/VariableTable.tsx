import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { Variable, Quantifiable } from '../../../utils/api/QuestionGenerationAPI';

interface VariableTableProps {
  variables: Variable;
  // variables: Variable[];
  quantifiables: Quantifiable[];
  selectedQuantifiables: { [key: string]: string };
  selectedSubclasses: { [key: string]: string };
  variableArguments: { [key: string]: { [arg: string]: any } };
  handleQuantifiableChange: (variableName: string, value: string) => void;
  handleSubclassChange: (variableName: string, subclassName: string) => void;
  handleArgumentChange: (variableName: string, argName: string, value: any) => void;
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
}) => {
  const isQuantifiable = (type: string): boolean => {
    return type === 'Quantifiable' || type.includes('Quantifiable');
  };

  const hasQuantifiable = variables.some((variable) => isQuantifiable(variable.type));
  const hasSubclasses = variables.some((variable) => variable.subclasses && variable.subclasses.length > 0);

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
          </TableRow>
        </TableHead>
        <TableBody>
          {variables.map((variable, index) => (
            <TableRow key={index}>
              <TableCell sx={{ width: '20%' }}>{variable.name}</TableCell>
              <TableCell sx={{ width: '20%' }}>{variable.type}</TableCell>
              {hasQuantifiable ? (
                <TableCell sx={{ width: '20%' }}>
                  {isQuantifiable(variable.type) ? (
                    <FormControl fullWidth>
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
                    <FormControl fullWidth>
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
                      <TextField
                        key={arg.name}
                        label={`${arg.name} (${arg.type})`}
                        value={variableArguments[variable.name]?.[arg.name] || ''}
                        onChange={(e) => handleArgumentChange(variable.name, arg.name, e.target.value)}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                      />
                    ))}
                </TableCell>
              ) : (
                variable.arguments && (
                  <TableCell sx={{ width: '20%' }}>
                    {variable.arguments.map((arg) => (
                      <TextField
                        key={arg.name}
                        label={`${arg.name} (${arg.type})`}
                        value={variableArguments[variable.name]?.[arg.name] || ''}
                        onChange={(e) => handleArgumentChange(variable.name, arg.name, e.target.value)}
                        fullWidth
                        // sx={{ marginBottom: 2 }}
                      />
                    ))}
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VariableTable;

import React from 'react';
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatValue } from '../../utils/format';

interface GeneratedVariablesTableProps {
  generatedVariables: { id: string, type: 'input' | 'algo', context: { [key: string]: any } };
  onDelete: (id: string, variableName: string) => void;
}

const GeneratedVariablesTable: React.FC<GeneratedVariablesTableProps> = ({ generatedVariables, onDelete }) => {
  return (
    <Box sx={{ marginY: 2 }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: generatedVariables.type === 'input' ? '40%' : '50%' }}>Variable Name</TableCell>
              <TableCell sx={{ width: generatedVariables.type === 'input' ? '40%' : '50%' }}>Value</TableCell>
              {generatedVariables.type === 'input' && (
                <TableCell sx={{ width: '20%' }}>Delete</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(generatedVariables.context).map(([name, value]) => (
              <TableRow key={name}>
                <TableCell sx={{ width: generatedVariables.type === 'input' ? '40%' : '50%' }}>{name}</TableCell>
                <TableCell sx={{ width: generatedVariables.type === 'input' ? '40%' : '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                  <Tooltip title={formatValue(value)} placement="top-start">
                    <span>{formatValue(value)}</span>
                  </Tooltip>
                </TableCell>
                {generatedVariables.type === 'input' && (
                  <TableCell sx={{ width: '20%' }}>
                    <IconButton onClick={() => onDelete(generatedVariables.id, name)} aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GeneratedVariablesTable;
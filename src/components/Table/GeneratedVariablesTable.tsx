import React from 'react';
import { Box, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { formatValue } from '../../utils/format';

interface GeneratedVariablesTableProps {
  generatedVariables: { context: { [key: string]: any } };
}

const GeneratedVariablesTable: React.FC<GeneratedVariablesTableProps> = ({ generatedVariables }) => {
  return (
    <Box sx={{ marginY: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generated Variables
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Variable Name</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(generatedVariables.context).map(([name, value]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{formatValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GeneratedVariablesTable;
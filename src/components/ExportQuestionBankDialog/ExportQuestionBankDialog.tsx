import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Question {
  title: string;
  description: string;
}

interface ExportQuestionBankDialogProps {
  open: boolean;
  onClose: () => void;
  selectedQuestions: Question[];
  questionBanks: string[];
//   selectedQuestionBanks: string[];
  newQuestionBank: string;
  handleNewQuestionBankChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  setSelectedQuestionBanks: (questionBanks: string[]) => void;
}

const ExportQuestionBankDialog: React.FC<ExportQuestionBankDialogProps> = ({
  open,
  onClose,
  selectedQuestions,
  questionBanks,
//   selectedQuestionBanks,
  newQuestionBank,
  handleNewQuestionBankChange,
  handleExport,
  setSelectedQuestionBanks
}) => {
  const questionColumns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  const questionBankColumns: GridColDef[] = [
    { field: 'questionBank', headerName: 'Question Banks', width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Selected Questions</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Selected Questions</Typography>
        <Paper sx={{ width: '100%', marginBottom: 2 }}>
          <DataGrid
            rows={selectedQuestions.map((question, index) => ({ id: index, title: question.title, description: question.description }))}
            columns={questionColumns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            autoHeight
          />
        </Paper>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Select Question Banks</Typography>
        <Paper sx={{ width: '100%', marginBottom: 2}}>
          <DataGrid
            rows={questionBanks.map((questionBank, index) => ({ id: index, questionBank }))}
            columns={questionBankColumns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            autoHeight
            onRowSelectionModelChange={(newSelection) => {
              const selectedIDs = new Set(newSelection);
              setSelectedQuestionBanks(
                questionBanks.filter((_, index) => selectedIDs.has(index))
              );
            }}
          />
          <TextField
            fullWidth
            label="Create New Question Bank"
            value={newQuestionBank}
            onChange={handleNewQuestionBankChange}
            sx={{ marginTop: 2 }}
          />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleExport} color="primary" variant="contained">
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportQuestionBankDialog;
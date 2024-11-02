import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Question } from '../../../utils/api/QuestionAPI';
import { QuestionBank } from '../../../utils/api/QuestionBankAPI';

interface ExportQuestionBankDialogProps {
  open: boolean;
  onClose: () => void;
  selectedQuestions: Question[];
  questionBanks: QuestionBank[];
  currentQuestionBankId: string;
  newQuestionBankTitle: string;
  handleNewQuestionBankChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  setSelectedQuestionBanks: (questionBanks: QuestionBank[]) => void;
}

const ExportQuestionBankDialog: React.FC<ExportQuestionBankDialogProps> = ({
  open,
  onClose,
  selectedQuestions,
  questionBanks,
  currentQuestionBankId,
  newQuestionBankTitle,
  handleNewQuestionBankChange,
  handleExport,
  setSelectedQuestionBanks
}) => {
  const questionColumns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  const questionBankColumns: GridColDef[] = [
    { field: 'title', headerName: 'Question Banks', width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const filteredQuestionBanks = questionBanks.filter(qb => qb._id !== currentQuestionBankId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Selected Questions</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Selected Questions</Typography>
        <Paper sx={{ width: '100%', marginBottom: 2 }}>
          <DataGrid
            rows={selectedQuestions.map((question, index) => ({ id: question._id, title: index + 1, description: question.text }))}
            columns={questionColumns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            autoHeight
          />
        </Paper>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Select Question Banks</Typography>
        <Paper sx={{ width: '100%', marginBottom: 2}}>
          <DataGrid
            rows={filteredQuestionBanks.map((questionBank) => ({ id: questionBank._id, title: questionBank.title }))}
            columns={questionBankColumns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            autoHeight
            onRowSelectionModelChange={(newSelection) => {
              const selectedIDs = new Set(newSelection);
              setSelectedQuestionBanks(
                questionBanks.filter((questionBank) => selectedIDs.has(questionBank._id))
              );
            }}
          />
          <TextField
            fullWidth
            label="Create New Question Bank"
            value={newQuestionBankTitle}
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
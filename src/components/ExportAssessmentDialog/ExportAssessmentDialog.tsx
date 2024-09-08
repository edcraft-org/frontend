import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Question } from '../../utils/api/QuestionAPI';
import { AssessmentList } from '../../utils/api/AssessmentAPI';

interface ExportAssessmentsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedQuestions: Question[];
  assessments: AssessmentList[];
  newAssessmentTitle: string;
  handleNewAssessmentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
  setSelectedAssessments: (assessments: AssessmentList[]) => void;
}

const ExportAssessmentsDialog: React.FC<ExportAssessmentsDialogProps> = ({
  open,
  onClose,
  selectedQuestions,
  assessments,
  newAssessmentTitle,
  handleNewAssessmentChange,
  handleExport,
  setSelectedAssessments
}) => {
  const questionColumns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  const assessmentColumns: GridColDef[] = [
    { field: 'title', headerName: 'Assessments', width: 200 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

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
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Select Assessments</Typography>
        <Paper sx={{ width: '100%', marginBottom: 2}}>
          <DataGrid
            rows={assessments.map((assessment) => ({ id: assessment._id, title: assessment.title }))}
            columns={assessmentColumns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            autoHeight
            onRowSelectionModelChange={(newSelection) => {
              const selectedIDs = new Set(newSelection);
              setSelectedAssessments(
                assessments.filter((assessment) => selectedIDs.has(assessment._id))
              );
            }}
          />
          <TextField
            fullWidth
            label="Create New Assessment"
            value={newAssessmentTitle}
            onChange={handleNewAssessmentChange}
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

export default ExportAssessmentsDialog;
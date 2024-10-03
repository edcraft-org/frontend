import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, List, ListItem, ListItemText, Divider, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { GeneratedQuestion } from '../../utils/api/QuestionGenerationAPI';

interface GeneratedQuestionsProps {
  questions: GeneratedQuestion[];
  onAddQuestion: (selectedQuestions: GeneratedQuestion[]) => void;
  project: { id: string, title: string };
  assessmentId?: string;
  questionBankId?: string;
}

const GeneratedQuestions: React.FC<GeneratedQuestionsProps> = ({ questions, onAddQuestion, project, assessmentId, questionBankId }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSelectQuestion = (index: number) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmSelection = () => {
    const selected = selectedQuestions.map(index => questions[index]);
    onAddQuestion(selected);
    setDialogOpen(false);
    if (assessmentId) {
      navigate(`/projects/${project.id}/assessments/${assessmentId}`, {
        state: project.title
      });
    } else if (questionBankId) {
      navigate(`/projects/${project.id}/questionBanks/${questionBankId}`, {
        state: project.title
      });
    }
  };

  const selectedQuestionRows = selectedQuestions.map(index => ({
    id: index,
    question: questions[index].question,
    answer: questions[index].answer,
  }));

  const questionColumns: GridColDef[] = [
    { field: 'question', headerName: 'Question', width: 300 },
    { field: 'answer', headerName: 'Answer', flex: 1 },
  ];

  const addButtonText = assessmentId ? 'Add to Assessment' : 'Add to Question Bank';

  return (
    <Box
      sx={{
        marginTop: 2,
        padding: 2,
        backgroundColor: '#f0f4f8',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', marginBottom: 4, color: '#333' }}>
        Generated Questions
      </Typography>
      {questions.map((qa, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <CardHeader
            title={`Question ${index + 1}`}
            sx={{ backgroundColor: '#e8e8e8', padding: 1 }}
            action={
              <Checkbox
                checked={selectedQuestions.includes(index)}
                onChange={() => handleSelectQuestion(index)}
              />
            }
          />
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#555' }}>
              {qa.question}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Typography variant="body1" gutterBottom sx={{ color: '#777' }}>
              Options:
            </Typography>
            <List>
              {qa.options.map((option, idx) => (
                <ListItem key={idx} sx={{ paddingLeft: 0 }}>
                  <ListItemText primary={`${String.fromCharCode(65 + idx)}. ${option}`} sx={{ color: '#333' }} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body2" sx={{ color: '#888' }}>
              Answer: {qa.answer}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" color="primary" onClick={handleOpenDialog} disabled={selectedQuestions.length === 0}>
        {addButtonText}
      </Button>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Selection</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>Selected Questions</Typography>
          <Paper sx={{ width: '100%', marginBottom: 2 }}>
            <DataGrid
              rows={selectedQuestionRows}
              columns={questionColumns}
              pageSizeOptions={[5, 10]}
              autoHeight
            />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSelection} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GeneratedQuestions;
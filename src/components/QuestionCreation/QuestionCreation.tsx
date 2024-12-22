import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, List, ListItem, Divider, Checkbox, Button, Tooltip, TextField, IconButton, Select, MenuItem, FormControl, InputLabel, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmSelectionDialog from '../Dialogs/ConfirmSelectionDialog/ConfirmSelectionDialog';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { QuestionCreationItem } from '../../utils/api/QuestionAPI';

interface QuestionCreationProps {
  questions: QuestionCreationItem[];
  onAddQuestion: (selectedQuestions: QuestionCreationItem[]) => void;
  project: { id: string, title: string };
  assessmentId?: string;
  questionBankId?: string;
  isManualCreation?: boolean;
}

const QuestionCreation: React.FC<QuestionCreationProps> = ({ questions, onAddQuestion, project, assessmentId, questionBankId, isManualCreation }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editableQuestions, setEditableQuestions] = useState<QuestionCreationItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(isManualCreation ? 0 : null);
  const [includeGraph, setIncludeGraph] = useState<{ [key: number]: boolean }>({});
  const [includeTable, setIncludeTable] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    setEditableQuestions(questions);
  }, [questions]);

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

  const handleConfirmSelection = async () => {
    const selected = selectedQuestions.map(index => {
      const question = { ...editableQuestions[index] };
      if (!includeGraph[index] && question.svg?.graph) {
        delete question.svg.graph;
      }
      if (!includeTable[index] && question.svg?.table) {
        delete question.svg.table;
      }
      return question;
    });
    setDialogOpen(false);
    try {
      await onAddQuestion(selected);
      if (assessmentId) {
        navigate(`/projects/${project.id}/assessments/${assessmentId}`, {
          state: { projectTitle: project.title }
        });
      } else if (questionBankId) {
        navigate(`/projects/${project.id}/questionBanks/${questionBankId}`, {
          state: { projectTitle: project.title }
        });
      }
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    setEditableQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return updatedQuestions;
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setEditableQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      const oldOption = updatedOptions[optionIndex];
      updatedOptions[optionIndex] = value;
      updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options: updatedOptions };

      // If the current answer is the old option, update the answer to the new value
      if (updatedQuestions[questionIndex].answer === oldOption) {
        updatedQuestions[questionIndex].answer = value;
      }

      return updatedQuestions;
    });
  };

  const handleAddOption = (questionIndex: number) => {
    setEditableQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options.push('');
      return updatedQuestions;
    });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    setEditableQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const removedOption = updatedQuestions[questionIndex].options.splice(optionIndex, 1)[0];

      // If the removed option was the answer, reset the answer
      if (updatedQuestions[questionIndex].answer === removedOption) {
        updatedQuestions[questionIndex].answer = '';
      }

      return updatedQuestions;
    });
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveClick = () => {
    setEditingIndex(null);
  };

  useEffect(() => {
    setEditableQuestions(questions);
    const initialIncludeGraph: { [key: number]: boolean } = {};
    const initialIncludeTable: { [key: number]: boolean } = {};
    questions.forEach((_, index) => {
      initialIncludeGraph[index] = true;
      initialIncludeTable[index] = true;
    });
    setIncludeGraph(initialIncludeGraph);
    setIncludeTable(initialIncludeTable);
  }, [questions]);


  const selectedQuestionRows = selectedQuestions.map(index => ({
    id: index,
    question: editableQuestions[index].question,
    answer: editableQuestions[index].answer,
  }));

  const questionColumns: GridColDef[] = [
    {
      field: 'question',
      headerName: 'Question',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <span className="cell-content">{params.value}</span>
        </Tooltip>
      ),
    },
    { field: 'answer', headerName: 'Answer', flex: 1 },
  ];

  const addButtonText = assessmentId
    ? 'Add to Assessment'
    : questionBankId
    ? 'Add to Question Bank'
    : '';

  return (
    <Box>
      {editableQuestions.map((qa, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <CardHeader
            title={`Question ${index + 1}`}
            sx={{ backgroundColor: '#e8e8e8', padding: 1 }}
            action={
              <>
                <Checkbox
                  checked={selectedQuestions.includes(index)}
                  onChange={() => handleSelectQuestion(index)}
                />
                {editingIndex === index ? (
                  <IconButton onClick={handleSaveClick}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditClick(index)}>
                    <EditIcon />
                  </IconButton>
                )}
              </>
            }
          />
          <CardContent>
            <TextField
              label="Question"
              value={qa.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ marginBottom: 2 }}
              disabled={editingIndex !== index}
            />
            {qa.svg && (
              <>
                {qa.svg.table && (
                  <FormControlLabel
                    control={<Checkbox checked={includeTable[index]} onChange={(e) => setIncludeTable(prev => ({ ...prev, [index]: e.target.checked }))} />}
                    label="Include Table SVG"
                  />
                )}
                {qa.svg.graph && (
                  <FormControlLabel
                    control={<Checkbox checked={includeGraph[index]} onChange={(e) => setIncludeGraph(prev => ({ ...prev, [index]: e.target.checked }))} />}
                    label="Include Graph SVG"
                  />
                )}
                <Box sx={{ display: 'flex'}}>
                  {includeTable[index] && qa.svg.table && (
                    <img src={`data:image/svg+xml;base64,${btoa(qa.svg.table)}`} alt="Table SVG" />
                  )}
                  {includeGraph[index] && qa.svg.graph && (
                    <img src={`data:image/svg+xml;base64,${btoa(qa.svg.graph)}`} alt="Graph SVG" />
                  )}
                </Box>
              </>
            )}
            <Divider sx={{ marginBottom: 2 }} />
            <Typography variant="body1" gutterBottom sx={{ color: '#777' }}>
              Options:
            </Typography>
            <List>
              {qa.options.map((option, idx) => (
                <ListItem key={idx} sx={{ paddingLeft: 0, display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label={`Option ${String.fromCharCode(65 + idx)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, idx, e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                    disabled={editingIndex !== index}
                  />
                  {editingIndex === index && (
                    <IconButton onClick={() => handleRemoveOption(index, idx)} sx={{ marginLeft: 1 }}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
              {editingIndex === index && (
                <ListItem sx={{ paddingLeft: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddOption(index)}
                  >
                    Add Option
                  </Button>
                </ListItem>
              )}
            </List>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }} disabled={editingIndex !== index}>
              <InputLabel>Answer</InputLabel>
              <Select
                label="Answer"
                value={qa.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value as string)}
              >
                {qa.options.map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      ))}
      {addButtonText && (
        <Button variant="contained" color="primary" onClick={handleOpenDialog} disabled={selectedQuestions.length === 0}>
          {addButtonText}
        </Button>
      )}
      <ConfirmSelectionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmSelection}
        selectedRows={selectedQuestionRows}
        columns={questionColumns}
      />
    </Box>
  );
};

export default QuestionCreation;

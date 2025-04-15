import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, List, ListItem, Divider, Checkbox, Button, Tooltip, TextField, IconButton, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmSelectionDialog from '../Dialogs/ConfirmSelectionDialog/ConfirmSelectionDialog';
import { GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { SubQuestion, GenerateQuestionResponse, NewQuestion } from '../../utils/api/QuestionAPI';
import { numberToAlphabet } from '../../utils/format';
import { AuthContext } from '../../context/Authcontext';
import { useNavigationWarning } from '../../context/NavigationWarningContext';
import { QuestionBlock } from '../../reducer/questionGenerationReducer';
import { GeneratedContext } from '../../utils/api/QuestionGenerationAPI';

interface QuestionCreationProps {

  questions: GenerateQuestionResponse;
  onAddQuestion: (newQuestion: NewQuestion) => void;
  project: { id: string, title: string };
  state?: QuestionBlock;
  generatedContext?: GeneratedContext;
  assessmentId?: string;
  questionBankId?: string;
  isManual?: boolean;
  isUpdate?: boolean;
}

const QuestionCreation: React.FC<QuestionCreationProps> = ({ state, generatedContext, questions, onAddQuestion, project, assessmentId, questionBankId, isManual = false, isUpdate = false }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editableQuestions, setEditableQuestions] = useState<SubQuestion[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [includeGraph, setIncludeGraph] = useState<{ [key: number]: boolean }>({});
  const [includeTable, setIncludeTable] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { setBypassWarning } = useNavigationWarning();

  useEffect(() => {
    const combinedQuestions: SubQuestion[] = [];

    // Add subquestions
    if (questions.subquestions) {
      combinedQuestions.push(...questions.subquestions);
    }

    setEditableQuestions(combinedQuestions);

    const initialIncludeGraph: { [key: number]: boolean } = {};
    const initialIncludeTable: { [key: number]: boolean } = {};
    combinedQuestions.forEach((_, index) => {
      initialIncludeGraph[index] = true;
      initialIncludeTable[index] = true;
    });
    setIncludeGraph(initialIncludeGraph);
    setIncludeTable(initialIncludeTable);
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
    const selected = selectedQuestions
    .slice()
    .sort((a, b) => a - b)
    .map(index => {
      const question = { ...editableQuestions[index] };
      if (!includeGraph[index] && question.svg?.graph) {
        delete question.svg.graph;
      }
      if (!includeTable[index] && question.svg?.table) {
        delete question.svg.table;
      }
      return question;
    });
    const newQuestion: NewQuestion = {
      user_id: user?.id || '',
      description: questions.description,
      svg: questions.svg,
      subquestions: selected,
      generated_context: generatedContext,
      state: state,
    };
    setDialogOpen(false);
    try {
      await onAddQuestion(newQuestion);
      setBypassWarning(true); // Set bypass first
      setTimeout(() => { // Use setTimeout to ensure bypass is set before navigation
        if (assessmentId) {
          navigate(`/projects/${project.id}/assessments/${assessmentId}`, {
            state: { projectTitle: project.title }
          });
        } else if (questionBankId) {
          navigate(`/projects/${project.id}/questionBanks/${questionBankId}`, {
            state: { projectTitle: project.title }
          });
        }
      }, 0);
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

  const handleAddSubQuestion = () => {
    setEditableQuestions(prevQuestions => [...prevQuestions, {
      description: '',
      options: [''],
      answer: '',
      marks: 1,
      numOptions: 1
    }]);
  };

  const handleDeleteSubQuestion = (index: number) => {
    setEditableQuestions(prevQuestions =>
      prevQuestions.filter((_, i) => i !== index)
    );
    setSelectedQuestions(prev =>
      prev.filter(i => i !== index)
    );
  };

  const selectedQuestionRows = selectedQuestions
    .slice()
    .sort((a, b) => a - b)
    .map(index => ({
      id: index,
      description: editableQuestions[index].description,
      answer: editableQuestions[index].answer,
    }));

  const questionColumns: GridColDef[] = [
    {
      field: 'description',
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
  ? isUpdate
    ? 'Update Assessment'
    : 'Add to Assessment'
  : questionBankId
    ? isUpdate
      ? 'Update Question Bank'
      : 'Add to Question Bank'
    : '';

  return (
    <Box
      // sx={{
      //   marginTop: 2,
      //   padding: 2,
      //   backgroundColor: '#f0f4f8',
      //   borderRadius: '8px',
      //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      //   minHeight: "100vh",
      //   minWidth: "100vh",
      // }}
    >
      {questions.description && (
        <Card variant="outlined" sx={{ marginBottom: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <CardHeader
            title="Q"
            sx={{ backgroundColor: '#e8e8e8', padding: 1 }}
          />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {questions.description}
            </Typography>
            {questions.svg && (
              <Box sx={{ display: 'flex' }}>
                {questions.svg.table && (
                  <img src={`data:image/svg+xml;base64,${btoa(questions.svg.table)}`} alt="Table SVG" />
                )}
                {questions.svg.graph && (
                  <img src={`data:image/svg+xml;base64,${btoa(questions.svg.graph)}`} alt="Graph SVG" />
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      {editableQuestions.map((qa, index) => (
        qa &&
        <Card key={index} variant="outlined" sx={{ marginBottom: 4, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <CardHeader
            title={`${numberToAlphabet(index).toLowerCase()}.`}
            sx={{ backgroundColor: '#e8e8e8', padding: 1 }}
            action={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Checkbox
                  checked={selectedQuestions.includes(index)}
                  onChange={() => handleSelectQuestion(index)}
                />

                {editingIndex === index ? (
                  <IconButton onClick={handleSaveClick} size="small">
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditClick(index)} size="small">
                    <EditIcon />
                  </IconButton>
                )}

                {isManual && (
                  <>
                    <Box sx={{ height: 20, borderLeft: '2px solid rgba(0, 0, 0, 1)' }} />
                    <IconButton
                      onClick={() => handleDeleteSubQuestion(index)}
                      size="small"
                      sx={{
                        '&:hover': {
                          color: 'error.main'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Stack>
            }
          />
          <CardContent>
            <TextField
              label="Question"
              value={qa.description}
              onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
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
            {qa.answer_svg?.table && (
              <img src={`data:image/svg+xml;base64,${btoa(qa.answer_svg.table)}`} alt="Table SVG" />
            )}
            {qa.answer_svg?.graph && (
              <img src={`data:image/svg+xml;base64,${btoa(qa.answer_svg.graph)}`} alt="Graph SVG" />
            )}
          </CardContent>
        </Card>
      ))}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '200px' }}>
        {isManual && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSubQuestion}
            sx={{ marginBottom: 2 }}
            fullWidth
          >
            Add Subquestion
          </Button>
        )}
        {addButtonText && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            disabled={selectedQuestions.length === 0}
            fullWidth
          >
            {addButtonText}
          </Button>
        )}
      </Box>
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
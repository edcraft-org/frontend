import { Box, Grid, Button, TextField, ToggleButton, ToggleButtonGroup, IconButton } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import NavBar from "../../../components/NavBar/Navbar";
import { getUserProjectQuestionBanks, createQuestionBank, renameQuestionBankTitle, deleteQuestionBank, QuestionBankList } from "../../../utils/api/QuestionBankAPI";
import { AuthContext } from "../../../context/Authcontext";
import EditDialog from "../../../components/Dialogs/EditDialog/EditDialog";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog/DeleteDialog";

const QuestionBankPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [questionBanks, setQuestionBanks] = useState<QuestionBankList[]>([]);
  const [newQuestionBankTitle, setNewQuestionBankTitle] = useState<string>("");
  const [editQuestionBank, setEditQuestionBank] = useState<QuestionBankList | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [questionBankToDelete, setQuestionBankToDelete] = useState<QuestionBankList | null>(null);
  const [view, setView] = useState<'assessment' | 'questionBank'>('questionBank');

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { projectTitle } = location.state || {};

  useEffect(() => {
    if (view === 'assessment') {
      navigate(`/projects/${projectId}/assessments`, {
        state: { projectTitle },
      });
    }
  }, [view, navigate, projectId, projectTitle]);

  const fetchQuestionBanks = useCallback(async () => {
    if (user && projectId) {
      const userQuestionBanks = await getUserProjectQuestionBanks(user.id, projectId);
      setQuestionBanks(userQuestionBanks);
    }
  }, [user, projectId]);

  useEffect(() => {
    fetchQuestionBanks();
  }, [user, projectId, fetchQuestionBanks]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }
  if (!user) {
    return <div>Error: User is missing</div>;
  }

  const addQuestionBank = async () => {
    if (newQuestionBankTitle.trim() !== "" && !questionBanks.some(qb => qb.title === newQuestionBankTitle.trim())) {
      const newQuestionBankData = {
        title: newQuestionBankTitle,
        questions: [],
        user_id: user.id,
        project_id: projectId
      };
      await createQuestionBank(newQuestionBankData);
      fetchQuestionBanks();
      setNewQuestionBankTitle("");
    } else {
      alert("Question Bank already exists or input is empty.");
    }
  };

  const handleQuestionBankClick = (questionBank: string) => {
    navigate(`/projects/${projectId}/questionBanks/${questionBank}`, {
      state: { projectTitle },
    });
  };

  const handleEditClick = (questionBank: QuestionBankList) => {
    setEditQuestionBank(questionBank);
    setEditTitle(questionBank.title);
    setDialogOpen(true);
  };

  const handleDeleteClick = (questionBank: QuestionBankList) => {
    setQuestionBankToDelete(questionBank);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (questionBankToDelete) {
      await deleteQuestionBank(questionBankToDelete._id);
      fetchQuestionBanks();
      setDeleteDialogOpen(false);
      setQuestionBankToDelete(null);
    }
  };

  const handleEditSave = async () => {
    if (editQuestionBank && editTitle.trim() !== "") {
      await renameQuestionBankTitle(editQuestionBank._id, { title: editTitle });
      fetchQuestionBanks();
      setDialogOpen(false);
      setEditQuestionBank(null);
      setEditTitle("");
    } else {
      alert("Title cannot be empty.");
    }
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'assessment' | 'questionBank') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar project={{id: projectId, title: projectTitle}} isProjectQuestionBank={view === 'questionBank'}/>
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
            <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view selection"
            >
                <ToggleButton value="assessment" aria-label="assessment">
                Assessment
                </ToggleButton>
                <ToggleButton value="questionBank" aria-label="question bank">
                Question Bank
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {questionBanks.map((questionBank, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => handleQuestionBankClick(questionBank._id)}
              >
                {questionBank.title}
                <IconButton
                  sx={{ position: 'absolute', top: '8px', right: '40px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(questionBank);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ position: 'absolute', top: '8px', right: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(questionBank);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                border: '1px dashed #ccc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ width: '80%' }}>
                <TextField
                  value={newQuestionBankTitle}
                  onChange={(e) => setNewQuestionBankTitle(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button onClick={addQuestionBank} variant="outlined" fullWidth>
                  Create new Question Bank
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <EditDialog
        open={dialogOpen}
        title="Question Bank"
        value={editTitle}
        onClose={() => setDialogOpen(false)}
        onSave={handleEditSave}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="question bank"
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
      />
    </Box>
  );
};

export default QuestionBankPage;
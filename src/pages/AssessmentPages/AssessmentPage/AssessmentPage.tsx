import { Box, Grid, Button, TextField, ToggleButton, ToggleButtonGroup, IconButton } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import NavBar from "../../../components/NavBar/Navbar";
import { getUserProjectAssessments, createAssessment, deleteAssessment, renameAssessmentTitle, AssessmentList } from "../../../utils/api/AssessmentAPI";
import { AuthContext } from "../../../context/Authcontext";
import EditDialog from "../../../components/Dialogs/EditDialog/EditDialog";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog/DeleteDialog";

const AssessmentPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [assessments, setAssessments] = useState<AssessmentList[]>([]);
  const [newAssessment, setNewAssessment] = useState<string>("");
  const [editAssessment, setEditAssessment] = useState<AssessmentList | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<AssessmentList | null>(null);
  const [view, setView] = useState<'assessment' | 'questionBank'>('assessment');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { projectTitle } = location.state || {};

  useEffect(() => {
    if (view === 'questionBank') {
      navigate(`/projects/${projectId}/questionBanks`, {
        state: { projectTitle },
      });
    }
  }, [view, navigate, projectId, projectTitle]);

  const fetchAssessments = useCallback(async () => {
    if (user && projectId) {
      const userAssessments = await getUserProjectAssessments(user.id, projectId);
      setAssessments(userAssessments);
    }
  }, [user, projectId]);

  useEffect(() => {
    fetchAssessments();
  }, [user, projectId, fetchAssessments]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }
  if (!user) {
    return <div>Error: User is missing</div>;
  }

  const addAssessment = async () => {
    if (newAssessment.trim() !== "" && !assessments.some(assessment => assessment.title === newAssessment.trim())) {
      const newAssessmentData = {
        title: newAssessment,
        questions: [],
        user_id: user.id,
        project_id: projectId
      };
      await createAssessment(newAssessmentData);
      fetchAssessments();
      setNewAssessment("");
    } else {
      alert("Assessment already exists or input is empty.");
    }
  };

  const handleAssessmentClick = (assessment: string) => {
    navigate(`/projects/${projectId}/assessments/${assessment}`, {
      state: { projectTitle }
    });
  };

  const handleEditClick = (assessment: AssessmentList) => {
    setEditAssessment(assessment);
    setEditTitle(assessment.title);
    setDialogOpen(true);
  };

  const handleDeleteClick = (assessment: AssessmentList) => {
    setAssessmentToDelete(assessment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (assessmentToDelete) {
      await deleteAssessment(assessmentToDelete._id);
      fetchAssessments();
      setDeleteDialogOpen(false);
      setAssessmentToDelete(null);
    }
  };

  const handleEditSave = async () => {
    if (editAssessment && editTitle.trim() !== "") {
      await renameAssessmentTitle(editAssessment._id, { title: editTitle });
      fetchAssessments();
      setDialogOpen(false);
      setEditAssessment(null);
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
      <NavBar project={{ id: projectId, title: projectTitle }} isProjectAssessment={view === 'assessment'} />
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
          {assessments.map((assessment, index) => (
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
                onClick={() => handleAssessmentClick(assessment._id)}
              >
                {assessment.title}
                <IconButton
                  sx={{ position: 'absolute', top: '8px', right: '40px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(assessment);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{ position: 'absolute', top: '8px', right: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(assessment);
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
                  value={newAssessment}
                  onChange={(e) => setNewAssessment(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button onClick={addAssessment} variant="outlined" fullWidth>
                  Create new assessment
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <EditDialog
        open={dialogOpen}
        title="Assessment"
        value={editTitle}
        onClose={() => setDialogOpen(false)}
        onSave={handleEditSave}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="assessment"
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
      />
    </Box>
  );
};

export default AssessmentPage;
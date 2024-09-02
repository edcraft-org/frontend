import { Box, Grid, Button, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../../components/NavBar/Navbar";

const AssessmentPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [assessments, setAssessments] = useState<string[]>(["Assessment 1", "Assessment 2", "Assessment 3", "Assessment 4"]);
  const [newAssessment, setNewAssessment] = useState<string>("");
  const [view, setView] = useState<'assessment' | 'questionBank'>('assessment');
  const navigate = useNavigate();

  useEffect(() => {
    if (view === 'questionBank') {
      navigate(`/projects/${projectId}/questionBanks`);
    }
  }, [view, navigate, projectId]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  const addAssessment = () => {
    if (newAssessment.trim() !== "" && !assessments.includes(newAssessment)) {
      setAssessments([...assessments, newAssessment]);
      setNewAssessment("");
      navigate(`/projects/${projectId}/createAssessment/${newAssessment}`);
    } else {
      alert("Assessment already exists or input is empty.");
    }
  };

  const handleAssessmentClick = (assessment: string) => {
    navigate(`/projects/${projectId}/assessments/${assessment}`);
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'assessment' | 'questionBank') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar projectId={projectId} />
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
                  cursor: 'pointer',
                }}
                onClick={() => handleAssessmentClick(assessment)}
              >
                {assessment}
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
    </Box>
  );
};

export default AssessmentPage;
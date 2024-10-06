import { Box, Grid, Typography, Button } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../../components/NavBar/Navbar";
import QuestionGroupPage from "../../QuestionPages/QuestionGroupPage/QuestionGroupPage";
import { AuthContext } from "../../../context/Authcontext";
import { getAssessmentById } from "../../../utils/api/AssessmentAPI";
import { Question } from "../../../utils/api/QuestionAPI";

interface AssessmentDetails {
  title: string;
  questions: Question[];
}

const AssessmentDetailsPage: React.FC = () => {
  const { projectId, assessmentId } = useParams<{ projectId: string, assessmentId: string }>();
  const [assessmentDetails, setAssessmentDetails] = useState<AssessmentDetails | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { projectTitle } = location.state || {};

  useEffect(() => {
    const fetchAssessmentQuestions = async () => {
      if (assessmentId) {
        const assessmentQuestions = await getAssessmentById(assessmentId);
        setAssessmentDetails(assessmentQuestions);
      }
    };
    fetchAssessmentQuestions();
  }, [assessmentId, location.state]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }
  if (!assessmentId) {
    return <div>Error: Assessment ID is missing</div>;
  }
  if (!user) {
    return <div>Error: User is missing</div>;
  }

  // const importQuestions = () => {
  //   // Logic to import questions from the question bank
  //   alert("Import questions from the question bank");
  // };

  const createNewQuestion = () => {
    // Logic to create a new question
    navigate(`/projects/${projectId}/createQuestion`, {
      state: { assessmentId, assessmentTitle: assessmentDetails?.title, projectTitle },
    });
  };

  const previewAssessment = () => {
    // Logic to preview the assessment
    alert("Preview assessment");
  };

  const publishAssessment = () => {
    // Logic to publish the assessment
    alert("Publish assessment");
  };

  const exportAssessment = () => {
    // Logic to export the assessment
    alert("Export assessment");
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar project={{id: projectId, title: projectTitle}} assessment={assessmentDetails ? { id: assessmentId, title: assessmentDetails.title } : undefined} />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <Typography variant="h4" gutterBottom>
            {assessmentDetails ? assessmentDetails.title : 'Loading...'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={previewAssessment} sx={{ marginBottom: 1, width: '150px' }}>
                Preview
            </Button>
            <Button variant="contained" color="primary" onClick={publishAssessment} sx={{ marginBottom: 1, width: '150px' }}>
                Publish
            </Button>
            <Button variant="contained" color="primary" onClick={exportAssessment} sx={{ width: '150px' }}>
                Export
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {assessmentDetails?.questions.map((question, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#d0e7ff',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <QuestionGroupPage questionNumber= {index+1} question={question} />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          {/* <Button variant="contained" color="primary" onClick={importQuestions} sx={{ marginRight: 2 }}>
            Import Questions
          </Button> */}
          <Button variant="contained" color="primary" onClick={createNewQuestion}>
            Create New Question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssessmentDetailsPage;
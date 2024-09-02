import { Box, Grid, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import NavBar from "../../../components/NavBar/Navbar";
import QuestionGroupPage from "../../QuestionPages/QuestionGroupPage/QuestionGroupPage";

interface Question {
  title: string;
  description: string;
}

const AssessmentDetailsPage: React.FC = () => {
  const { projectId, assessmentId } = useParams<{ projectId: string, assessmentId: string }>();
  // const [questions, setQuestions] = useState<Question[]>([
  const [questions] = useState<Question[]>([
  { title: "Question 1", description: "This is a short description of question 1." },
    { title: "Question 2", description: "This is a short description of question 2." },
    { title: "Question 3", description: "This is a short description of question 3." },
    { title: "Question 4", description: "This is a short description of question 4." },
  ]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  const importQuestions = () => {
    // Logic to import questions from the question bank
    alert("Import questions from the question bank");
  };

  const createNewQuestion = () => {
    // Logic to create a new question
    alert("Create a new question");
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
      <NavBar projectId={projectId} assessmentId={assessmentId} />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <Typography variant="h4" gutterBottom>
            {assessmentId}
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
          {questions.map((question, index) => (
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
                <Box sx={{ marginBottom: 2, backgroundColor: '#e0e0e0', paddingY: '8px', paddingLeft: '16px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#1e88e5' }}>{question.title}</Typography>
                </Box>
                <Box sx={{ paddingBottom: '16px', paddingLeft: '16px', borderRadius: '0 0 8px 8px' }}>
                  {/* <QuestionGroupPage projectId={projectId} questionGroupId ={"holder"} questionTitle={question.title} /> */}
                  <QuestionGroupPage questionTitle={question.title} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button variant="contained" color="primary" onClick={importQuestions} sx={{ marginRight: 2 }}>
            Import Questions
          </Button>
          <Button variant="contained" color="primary" onClick={createNewQuestion}>
            Create New Question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssessmentDetailsPage;
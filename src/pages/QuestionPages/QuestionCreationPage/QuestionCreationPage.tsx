import React from 'react';
import { Box, Typography } from '@mui/material';
import NavBar from '../../../components/NavBar/Navbar';
import { useLocation, useParams } from 'react-router-dom';
// import QuestionDetails from '../../../components/QuestionCreation/QuestionDetails';
import QuestionGeneration from '../../../components/QuestionCreation/QuestionGeneration';

const QuestionCreationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const { projectTitle, assessmentId, assessmentTitle, questionBankId, questionBankTitle } = location.state || {};


  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }


  return (
    <Box sx={{ width: '100%' }}>
      <NavBar project={{id: projectId, title: projectTitle}} assessment={ {id: assessmentId, title: assessmentTitle} } questionBank={{id: questionBankId, title: questionBankTitle}} isQuestionCreation={true}/>
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Question
        </Typography>
        <QuestionGeneration
          project= {{id: projectId, title: projectTitle}}
          assessmentId={assessmentId}
          questionBankId={questionBankId}
        />
      </Box>
    </Box>
  );
};

export default QuestionCreationPage;
import React from 'react';
import { Box } from '@mui/material';
import NavBar from '../../../components/NavBar/Navbar';
import { useLocation, useParams } from 'react-router-dom';
import QuestionGeneration from '../../../components/QuestionCreation/QuestionGeneration';
import { NavigationWarning } from '../../../components/QuestionCreation/QuestionGeneration/NavigationWarning';
import ManualCreation from '../../../components/QuestionCreation/ManualCreation';

const QuestionCreationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const { projectTitle, assessmentId, assessmentTitle, questionBankId, questionBankTitle, isManual } = location.state || {};

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }


  return (
    <Box sx={{ width: '100%', bgcolor: "#f5f7fa" }}>
      <NavBar project={{id: projectId, title: projectTitle}} assessment={ {id: assessmentId, title: assessmentTitle} } questionBank={{id: questionBankId, title: questionBankTitle}} isQuestionCreation={true}/>
      <NavigationWarning/>
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        {isManual ? (
            <ManualCreation
              project={{ id: projectId, title: projectTitle }}
              assessmentId={assessmentId}
              questionBankId={questionBankId}
            />
          ) : (
            <QuestionGeneration
              project={{ id: projectId, title: projectTitle }}
              assessmentId={assessmentId}
              questionBankId={questionBankId}
            />
        )}
      </Box>
    </Box>
  );
};

export default QuestionCreationPage;
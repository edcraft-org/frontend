import React from 'react';
import { Box } from '@mui/material';
import NavBar from '../../../components/NavBar/Navbar';
import { useLocation, useParams } from 'react-router-dom';
import { NavigationWarning } from '../../../components/QuestionCreation/QuestionGeneration/NavigationWarning';
import { NavigationWarningProvider } from '../../../context/NavigationWarningContext';
import EditQuestionGeneration from '../../../components/QuestionCreation/EditQuestionGeneration';
import EditManualCreation from '../../../components/QuestionCreation/EditManualCreation';

const QuestionEditPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const { projectTitle, assessmentId, assessmentTitle, questionBankId, questionBankTitle, isManual, question } = location.state || {};

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  return (
    <NavigationWarningProvider>
      <Box sx={{ minHeight: "100vh", width: '100%', bgcolor: "#f5f7fa" }}>
        <NavBar
          project={{id: projectId, title: projectTitle}}
          assessment={{ id: assessmentId, title: assessmentTitle }}
          questionBank={{id: questionBankId, title: questionBankTitle}}
          isQuestionEdit={true}
        />
        <NavigationWarning/>
        <Box sx={{ marginTop: '64px', padding: 2 }}>
          {isManual ? (
            <EditManualCreation
              project={{ id: projectId, title: projectTitle }}
              question={question}
              assessmentId={assessmentId}
              questionBankId={questionBankId}
            />
          ) : (
            <EditQuestionGeneration
              project={{ id: projectId, title: projectTitle }}
              question={question}
              assessmentId={assessmentId}
              questionBankId={questionBankId}
            />
          )}
        </Box>
      </Box>
    </NavigationWarningProvider>
  );
};

export default QuestionEditPage;
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import NavBar from '../../../components/NavBar/Navbar';
import { useLocation, useParams } from 'react-router-dom';
import QuestionDetails from '../../../components/QuestionCreation/QuestionDetails';
import QuestionGeneration from '../../../components/QuestionCreation/QuestionGeneration';
import ManualCreation from '../../../components/QuestionCreation/ManualCreation';

const QuestionCreationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const { projectTitle, assessmentId, assessmentTitle, questionBankId, questionBankTitle } = location.state || {};
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [marks, setMarks] = useState<number>(1);
  const [creationMethod, setCreationMethod] = useState('generation');

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCreationMethod(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar project={{id: projectId, title: projectTitle}} assessment={ {id: assessmentId, title: assessmentTitle} } questionBank={{id: questionBankId, title: questionBankTitle}} isQuestionCreation={true}/>
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Question
        </Typography>
        <QuestionDetails type={type} marks={marks} setType={setType} setMarks={setMarks} />
        <Tabs value={creationMethod} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
          <Tab label="Question Generation" value="generation" />
          <Tab label="Manual Creation" value="manual" />
        </Tabs>
        {creationMethod === 'generation' ? (
          <QuestionGeneration
            project= {{id: projectId, title: projectTitle}}
            description={description}
            setDescription={setDescription}
            type={type} marks={marks}
            assessmentId={assessmentId}
            questionBankId={questionBankId}
          />
        ) : (
          <ManualCreation
          project= {{id: projectId, title: projectTitle}}
          marks={marks}
          assessmentId={assessmentId}
          questionBankId={questionBankId}
          />
        )}
      </Box>
    </Box>
  );
};

export default QuestionCreationPage;
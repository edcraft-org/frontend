import React, { useState } from 'react';
import { Box, Switch, Typography, FormControlLabel } from '@mui/material';
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
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const questionData = {
      description,
      type,
      marks: Number(marks),
      options: creationMethod === 'manual' ? options : undefined,
      correctAnswer: creationMethod === 'manual' ? correctAnswer : undefined,
    };
    console.log('Question Data:', questionData);
    // Add logic to save the question data
  };

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreationMethod(event.target.checked ? 'generation' : 'manual');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar project={{id: projectId, title: projectTitle}} assessment={ {id: assessmentId, title: assessmentTitle} } questionBank={{id: questionBankId, title: questionBankTitle}} isQuestionCreation={true}/>
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Question
        </Typography>
        <form onSubmit={handleSubmit}>
          <QuestionDetails type={type} marks={marks} setType={setType} setMarks={setMarks} />
          <FormControlLabel
            control={
              <Switch
                checked={creationMethod === 'generation'}
                onChange={handleToggleChange}
                name="creationMethod"
                color="primary"
              />
            }
            label={creationMethod === 'generation' ? 'Question Generation' : 'Manual Creation'}
            sx={{ marginBottom: 2 }}
          />
          {creationMethod === 'generation' ? (
            <QuestionGeneration project= {{id: projectId, title: projectTitle}} description={description} setDescription={setDescription} type={type} marks={marks} assessmentId={assessmentId} questionBankId={questionBankId}/>
          ) : (
            <ManualCreation
              description={description}
              setDescription={setDescription}
              type={type} // Pass the type prop here
              options={options}
              setOptions={setOptions}
              correctAnswer={correctAnswer}
              setCorrectAnswer={setCorrectAnswer}
            />
          )}
          {/* <Button type="submit" variant="contained" color="primary">
            Create Question
          </Button> */}
        </form>
      </Box>
    </Box>
  );
};

export default QuestionCreationPage;
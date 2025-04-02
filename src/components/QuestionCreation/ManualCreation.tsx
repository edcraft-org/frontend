import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import QuestionCreation from './QuestionCreation';
import { AuthContext } from '../../context/Authcontext';
import { createQuestion, NewQuestion } from '../../utils/api/QuestionAPI';
import { addExistingQuestionToAssessment } from '../../utils/api/AssessmentAPI';
import { addExistingQuestionToQuestionBank } from '../../utils/api/QuestionBankAPI';

interface ManualCreationProps {
  project: { id: string, title: string };
  assessmentId?: string;
  questionBankId?: string;
}

const ManualCreation: React.FC<ManualCreationProps> = ({
  project,
  assessmentId,
  questionBankId
}) => {
  const { user } = useContext(AuthContext);

  const onAddQuestion = async (newQuestion: NewQuestion) => {
    try {
      if (!user) {
        throw new Error('User is not logged in');
      }

      const question = await createQuestion(newQuestion);

      if (assessmentId) {
      await addExistingQuestionToAssessment(assessmentId, question._id);
      } else if (questionBankId) {
      await addExistingQuestionToQuestionBank(questionBankId, question._id);
      } else {
      throw new Error('Assessment ID or Question Bank ID is missing');
      }
      console.log('Questions added to assessment successfully');
    } catch (error) {
      console.error('Error adding questions to assessment:', error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 2,
        padding: 2,
        backgroundColor: '#f0f4f8',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        minHeight: "100vh",
        minWidth: "100vh",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 2 }}>
        Manual Creation
      </Typography>
      <QuestionCreation
          project={project}
          questions={{ description: '', svg: undefined, subquestions: [{description: '', options: [], answer: '', marks: 1}] }}
          onAddQuestion={onAddQuestion}
          assessmentId={assessmentId}
          questionBankId={questionBankId}
          isManual={true}
      />

    </Box>
  );
};

export default ManualCreation;

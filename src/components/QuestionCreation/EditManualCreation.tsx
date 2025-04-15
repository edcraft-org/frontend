import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import QuestionCreation from './QuestionCreation';
import { AuthContext } from '../../context/Authcontext';
import { updateQuestion, NewQuestion, Question } from '../../utils/api/QuestionAPI';

interface EditManualCreationProps {
  project: { id: string, title: string };
  question: Question;
  assessmentId?: string;
  questionBankId?: string;
}

const EditManualCreation: React.FC<EditManualCreationProps> = ({
  project,
  question,
  assessmentId,
  questionBankId
}) => {
  const { user } = useContext(AuthContext);

  const onUpdateQuestion = async (updatedQuestion: NewQuestion) => {
    try {
      if (!user) {
        throw new Error('User is not logged in');
      }

      await updateQuestion(question._id, updatedQuestion);
      console.log('Question updated successfully');

    } catch (error) {
      console.error('Error updating question:', error);
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
        Edit Question
      </Typography>
      <QuestionCreation
        project={project}
        questions={{
          description: question.description,
          svg: question.svg,
          subquestions: question.subquestions || []
        }}
        onAddQuestion={onUpdateQuestion}
        assessmentId={assessmentId}
        questionBankId={questionBankId}
        isManual={true}
        isUpdate={true}
      />
    </Box>
  );
};

export default EditManualCreation;
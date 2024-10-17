import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import QuestionCreation from './QuestionCreation';
import { AuthContext } from '../../context/Authcontext';
import { createQuestion, QuestionCreationItem } from '../../utils/api/QuestionAPI';
import { addExistingQuestionToAssessment } from '../../utils/api/AssessmentAPI';
import { addExistingQuestionToQuestionBank } from '../../utils/api/QuestionBankAPI';

interface ManualCreationProps {
  description: string;
  setDescription: (description: string) => void;
  type: string;
  marks: number;
  project: { id: string, title: string };
  assessmentId?: string;
  questionBankId?: string;
}


const ManualCreation: React.FC<ManualCreationProps> = ({
  description,
  setDescription,
  type,
  marks,
  project,
  assessmentId,
  questionBankId
}) => {
  const { user } = useContext(AuthContext);

  const onAddQuestion = async (selectedQuestions: QuestionCreationItem[]) => {
    try {
      // TODO: To be updated when authentication logic is implemented
      if (!user) {
        throw new Error('User is not logged in');
      }

      for (const selectedQuestion of selectedQuestions) {
        const newQuestion = {
          text: selectedQuestion.question,
          options: selectedQuestion.options,
          answer: selectedQuestion.answer,
          marks: selectedQuestion.marks,
          user_id: user.id
        };

        // Create the question
        const question = await createQuestion(newQuestion);

        if (assessmentId) {
          // Add the question to the assessment
          await addExistingQuestionToAssessment(assessmentId, question._id);
        } else if (questionBankId) {
          // Add the question to the question bank
          await addExistingQuestionToQuestionBank(questionBankId, question._id);
        } else {
          throw new Error('Assessment ID or Question Bank ID is missing');
        }
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
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
        Manual Creation
      </Typography>
      <QuestionCreation
          project={project}
          questions={[{ question: '', answer: '', options: [], marks: marks }]}
          onAddQuestion={onAddQuestion}
          assessmentId={assessmentId}
          questionBankId={questionBankId}
          isManualCreation={true}
      />

    </Box>
  );
};

export default ManualCreation;
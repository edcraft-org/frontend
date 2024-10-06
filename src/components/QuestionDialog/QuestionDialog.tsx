import React from 'react';
import { Dialog, DialogActions, Button } from "@mui/material";
import QuestionGroupPage from '../../pages/QuestionPages/QuestionGroupPage/QuestionGroupPage';
import { Question } from '../../utils/api/QuestionAPI';

interface QuestionDialogProps {
  open: boolean;
  onClose: () => void;
  question: Question | null;
  questionNumber: number | null;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({ open, onClose, question, questionNumber }) => {
  if (!question || !questionNumber) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <QuestionGroupPage questionNumber={questionNumber} question={question} />
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
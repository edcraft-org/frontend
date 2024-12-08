import React from 'react';
import { Box, Grid, Typography, Checkbox, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Question } from '../../utils/api/QuestionAPI';

interface QuestionListProps {
  questions: Question[];
  selectedQuestions: Question[];
  handleQuestionClick: (question: Question) => void;
  selectAll: boolean;
  handleSelectAll: () => void;
  onQuestionClick: (question: Question, index: number) => void;
  handleRemoveQuestion: (questionId: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, selectedQuestions, handleQuestionClick, selectAll, handleSelectAll, onQuestionClick, handleRemoveQuestion }) => {
  return (
    <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
          />
        </Box>
      </Grid>
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
            onClick={() => onQuestionClick(question, index + 1)}
          >
            <Box sx={{ marginBottom: 2, backgroundColor: '#e0e0e0', paddingY: '8px', paddingLeft: '16px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1e88e5' }}>Question {index + 1}</Typography>
              <Box>
                <Checkbox
                  checked={selectedQuestions.includes(question)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleQuestionClick(question)}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestion(question._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ paddingBottom: '16px', paddingLeft: '16px', borderRadius: '0 0 8px 8px' }}>
              <Typography variant="body2" sx={{ color: '#555' }}>{question.text}</Typography>
              {question.svg && (
                <Box sx={{ marginBottom: 2 }}>
                  <img src={`data:image/svg+xml;base64,${btoa(question.svg)}`} alt="Question SVG" />
                </Box>
              )}
              <Typography variant="body2" sx={{ marginTop: 2, color: '#888' }}>
                Answer: {question.answer}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuestionList;
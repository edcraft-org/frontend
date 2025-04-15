import React from 'react';
import { Box, Grid, Typography, Checkbox, IconButton, Divider, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Question, SubQuestion } from '../../utils/api/QuestionAPI';

interface QuestionListProps {
  questions: Question[];
  selectedQuestions: Question[];
  handleQuestionClick: (question: Question) => void;
  selectAll: boolean;
  handleSelectAll: () => void;
  onQuestionClick: (question: Question, index: number) => void;
  handleRemoveQuestion: (questionId: string) => void;
  onEdit?: (question: Question) => void; // Add this line
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, selectedQuestions, handleQuestionClick, selectAll, handleSelectAll, onQuestionClick, handleRemoveQuestion, onEdit }) => {

  const renderSubQuestion = (subQuestion: SubQuestion, index: number) => (
    <Box key={index} sx={{ marginBottom: 2, paddingLeft: '16px' }}>
      <Typography variant="h6" gutterBottom>
       {String.fromCharCode(97 + index)}. [{subQuestion.marks} {subQuestion.marks == 1 ? 'mark' : 'marks'}] {subQuestion.description}
      </Typography>
      {subQuestion.svg && (
        <Box sx={{ marginBottom: 2 }}>
          {subQuestion.svg.table && (
            <img src={`data:image/svg+xml;base64,${btoa(subQuestion.svg.table)}`} alt="Table SVG" />
          )}
          {subQuestion.svg.graph && (
            <img src={`data:image/svg+xml;base64,${btoa(subQuestion.svg.graph)}`} alt="Graph SVG" />
          )}
        </Box>
      )}
      <Typography variant="body2" sx={{ color: '#888' }}>
        Answer: {subQuestion.answer}
      </Typography>
      {subQuestion.answer_svg && (
        <Box sx={{ marginBottom: 2 }}>
          {subQuestion.answer_svg.table && (
            <img src={`data:image/svg+xml;base64,${btoa(subQuestion.answer_svg.table)}`} alt="Table SVG" />
          )}
          {subQuestion.answer_svg.graph && (
            <img src={`data:image/svg+xml;base64,${btoa(subQuestion.answer_svg.graph)}`} alt="Graph SVG" />
          )}
        </Box>
      )}
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
    </Box>
  );

  return (
    <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px', paddingLeft: '0 !important' }}>
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
        <Grid item xs={12} key={index} sx={{ paddingLeft: '0 !important'}}>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={selectedQuestions.includes(question)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleQuestionClick(question)}
                />
                {onEdit && (
                  <Tooltip title="Edit question">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(question);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete question">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveQuestion(question._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box sx={{ paddingBottom: '16px', paddingLeft: '16px', borderRadius: '0 0 8px 8px' }}>
              <Typography variant="body2" sx={{ color: '#555' }}>{question.description}</Typography>
              {question.svg && (
                <Box sx={{ marginBottom: 2 }}>
                  {question.svg.table && (
                    <img src={`data:image/svg+xml;base64,${btoa(question.svg.table)}`} alt="Table SVG" />
                  )}
                  {question.svg.graph && (
                    <img src={`data:image/svg+xml;base64,${btoa(question.svg.graph)}`} alt="Graph SVG" />
                  )}
                </Box>
              )}
              {question.subquestions?.map((subQuestion, index) => renderSubQuestion(subQuestion, index))}
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuestionList;
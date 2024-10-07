import { Box, Typography, RadioGroup, FormControlLabel, Radio, Divider, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { Question } from "../../../utils/api/QuestionAPI";

interface QuestionGroupPageProps {
  questionNumber: number;
  question: Question;
  onRemove?: (questionId: string) => void;
}

const QuestionGroupPage: React.FC<QuestionGroupPageProps> = ({ questionNumber, question, onRemove }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ marginBottom: 2, backgroundColor: '#e0e0e0', paddingY: '8px', paddingLeft: '16px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#1e88e5' }}>Question {questionNumber}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1e88e5', marginRight: 2 }}>
            {question.marks} {question.marks === 1 ? 'pt' : 'pts'}
          </Typography>
          {onRemove && (
            <IconButton onClick={() => onRemove(question._id)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box sx={{ paddingBottom: '16px', paddingLeft: '16px', borderRadius: '0 0 8px 8px' }}>
        <Typography variant="h6" gutterBottom>
          {question.text}
        </Typography>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
          {question.options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Typography variant="body2" sx={{ color: '#888' }}>
          Answer: {question.answer}
        </Typography>
      </Box>
    </Box>
  );
};

export default QuestionGroupPage;
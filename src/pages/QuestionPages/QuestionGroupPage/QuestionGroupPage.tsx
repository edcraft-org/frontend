import { Box, Typography, RadioGroup, FormControlLabel, Radio, Divider } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Question } from "../../../utils/api/QuestionAPI";

interface SubQuestion {
  title: string;
  description: string;
}

interface QuestionGroup {
  title: string;
  description: string;
  subQuestions: SubQuestion[];
}

interface QuestionGroupPageProps {
  questionNumber: number;
  question: Question;
}

const QuestionGroupPage: React.FC<QuestionGroupPageProps> = ({ questionNumber, question }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ marginBottom: 2, backgroundColor: '#e0e0e0', paddingY: '8px', paddingLeft: '16px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#1e88e5' }}>Question {questionNumber}</Typography>
        <Typography variant="h6" sx={{ color: '#1e88e5', marginRight: 2 }}>
         {question.marks} {question.marks === 1 ? 'pt' : 'pts'}
        </Typography>
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
      {/* <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sub Questions
        </Typography>
        {question.subQuestions?.map((subQuestion, index) => (
          <Box key={index} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="h6" sx={{ color: '#1e88e5' }}>{subQuestion.title}</Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>{subQuestion.description}</Typography>
          </Box>
        ))}
      </Box> */}
    </Box>
  );
};

export default QuestionGroupPage;
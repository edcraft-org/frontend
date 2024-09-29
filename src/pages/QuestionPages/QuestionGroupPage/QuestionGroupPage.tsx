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
  question: Question;
}

const QuestionGroupPage: React.FC<QuestionGroupPageProps> = ({ question }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {question.text}
      </Typography>
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
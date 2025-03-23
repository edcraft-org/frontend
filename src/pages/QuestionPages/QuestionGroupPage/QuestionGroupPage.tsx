import { Box, Typography, RadioGroup, FormControlLabel, Radio, Divider, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { Question, SubQuestion } from "../../../utils/api/QuestionAPI";
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
      <RadioGroup value={selectedOption} onChange={handleOptionChange}>
        {subQuestion.options.map((option, idx) => (
          <FormControlLabel
            key={idx}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
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

  const totalMarks = question.subquestions?.reduce((sum, subQuestion) => sum + subQuestion.marks, 0) || 1;

  return (
    <Box>
      <Box sx={{ marginBottom: 2, backgroundColor: '#e0e0e0', paddingY: '8px', paddingLeft: '16px', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#1e88e5' }}>Question {questionNumber}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1e88e5', marginRight: 2 }}>
            {totalMarks} {totalMarks === 1 ? 'pt' : 'pts'}
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
          {question.description}
        </Typography>
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
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        {question.subquestions && question.subquestions.length === 1 ? (
          // Combine main question and single subquestion
          <Box>
            <Typography variant="h6" gutterBottom>
              {question.description} {question.subquestions[0].description}
            </Typography>
            {question.subquestions[0].svg && (
              <Box sx={{ marginBottom: 2 }}>
                {question.subquestions[0].svg.table && (
                  <img src={`data:image/svg+xml;base64,${btoa(question.subquestions[0].svg.table)}`} alt="Table SVG" />
                )}
                {question.subquestions[0].svg.graph && (
                  <img src={`data:image/svg+xml;base64,${btoa(question.subquestions[0].svg.graph)}`} alt="Graph SVG" />
                )}
              </Box>
            )}
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
              {question.subquestions[0].options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            <Typography variant="body2" sx={{ color: '#888' }}>
              Answer: {question.subquestions[0].answer}
            </Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          </Box>
        ) : (
          // Display subquestions grouped together
          question.subquestions?.map((subQuestion, index) => renderSubQuestion(subQuestion, index))
        )}
      </Box>
    </Box>
  );
};

export default QuestionGroupPage;
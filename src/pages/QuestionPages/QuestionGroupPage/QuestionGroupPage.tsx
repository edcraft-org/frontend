import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

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
  // projectId: string;
  // questionGroupId: string;
  questionTitle: string;
  // handleClose: () => void; // Add handleClose prop
}

const QuestionGroupPage: React.FC<QuestionGroupPageProps> = () => {
  const { questionTitle } = useParams<{ questionTitle: string }>();


  // const [questionGroup, setQuestionGroup] = useState<QuestionGroup>({
  const [questionGroup] = useState<QuestionGroup>({
    title: questionTitle ? questionTitle : "Question Group",
    description: "This is a detailed description of the question group.",
    subQuestions: [
      { title: "SubQuestion 1", description: "This is a short description of subquestion 1." },
      { title: "SubQuestion 2", description: "This is a short description of subquestion 2." },
    ],
  });

  return (
    <Box>
      {/* <IconButton
        aria-label="close"
        // onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton> */}
      {/* <Typography variant="h4" gutterBottom >
        {questionGroup.title}
      </Typography> */}
      <Typography variant="body1" gutterBottom>
        {questionGroup.description}
      </Typography>
      <Box sx={{ marginTop: 4 }}>
        {questionGroup.subQuestions.map((subQuestion, index) => (
          <Box key={index} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="h6" sx={{ color: '#1e88e5' }}>{subQuestion.title}</Typography>
            <Typography variant="body2" sx={{ color: '#555' }}>{subQuestion.description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuestionGroupPage;
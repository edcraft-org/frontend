import { Box, Grid, Button, TextField, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Remove } from "@mui/icons-material";

import NavBar from "../../../components/NavBar/Navbar";
import TrueOrFalseQuestion from "../../../components/QuestionTypes/TrueOrFalse";
import MultipleChoiceQuestion from "../../../components/QuestionTypes/MultipleChoice";
import OpenEndedQuestion from "../../../components/QuestionTypes/OpenEnded";

interface Question {
  questionText: string;
  options: string[];
  type: string;
  correctAnswer: string;
  category: string;
}

const questionTypes = ["True or False", "Multiple Choice", "Open Ended Question", "Fill in the Blank", "Matching"];

const CreateAssessmentPage: React.FC = () => {
  const { projectId, assessmentId } = useParams<{ projectId: string, assessmentId: string }>();
  // const [assessmentTitle, setAssessmentTitle] = useState<string>("");
  const [assessmentTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([{ questionText: "", options: ["True", "False"], type: "True or False", correctAnswer: "True", category: "Rule Based" }]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }

  if (!assessmentId) {
    return <div>Error: Assessment ID is missing</div>;
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleTypeChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].type = value;
    if (value === "True or False") {
      newQuestions[index].options = ["True", "False"];
      newQuestions[index].correctAnswer = "True";
    } else if (value === "Open Ended Question") {
      newQuestions[index].options = [];
      newQuestions[index].correctAnswer = "";
    } else {
      newQuestions[index].options = [""];
      newQuestions[index].correctAnswer = "";
    }
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].category = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: [""], type: "Multiple Choice", correctAnswer: "", category: "Rule Based" }]);
  };

  // const removeQuestion = (index: number) => {
  //   const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
  //   setQuestions(newQuestions);
  // };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== oIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ projectId, assessmentId, assessmentTitle, questions });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar projectId={projectId} assessmentId={assessmentId} />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Typography variant="h4" gutterBottom>{assessmentId}</Typography>
        {questions.map((question, qIndex) => (
          <Box key={qIndex} sx={{ marginTop: 4 }}>
            <Grid container alignItems="center" spacing={2} marginBottom={2}>
              <Grid item xs>
                <Typography variant="h6" sx={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                  Question {qIndex + 1}
                </Typography>
              </Grid>
              <Grid item>
                <FormControl variant="standard">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={question.category}
                    onChange={(e) => handleCategoryChange(qIndex, e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="Rule Based">Rule Based</MenuItem>
                    <MenuItem value="Knowledge Base">Knowledge Base</MenuItem>
                    <MenuItem value="Code Based">Code Based</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ marginBottom: 1 }}>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={question.type}
                onChange={(e) => handleTypeChange(qIndex, e.target.value)}
                label="Question Type"
              >
                {questionTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {question.type === "True or False" ? (
              <TrueOrFalseQuestion
                questionText={question.questionText}
                onQuestionChange={(value) => handleQuestionChange(qIndex, value)}
              />
            ) : question.type === "Multiple Choice" ? (
              <MultipleChoiceQuestion
                questionText={question.questionText}
                options={question.options}
                onQuestionChange={(value) => handleQuestionChange(qIndex, value)}
                onOptionChange={(oIndex, value) => handleOptionChange(qIndex, oIndex, value)}
                onRemoveOption={(oIndex) => removeOption(qIndex, oIndex)}
              />
            ) : question.type === "Open Ended Question" ? (
              <OpenEndedQuestion
                questionText={question.questionText}
                correctAnswer={question.correctAnswer}
                onQuestionChange={(value) => handleQuestionChange(qIndex, value)}
                onCorrectAnswerChange={(value) => handleCorrectAnswerChange(qIndex, value)}
              />
            ) : (
              question.options.map((option, oIndex) => (
                <Box key={oIndex} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                  <TextField
                    label={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                  <IconButton onClick={() => removeOption(qIndex, oIndex)} sx={{ marginLeft: 1 }}>
                    <Remove />
                  </IconButton>
                </Box>
              ))
            )}
            {question.type !== "True or False" && question.type !== "Open Ended Question" && (
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                <Button onClick={() => addOption(qIndex)} variant="outlined">
                  Add Option
                </Button>
              </Box>
            )}
            {question.type !== "Open Ended Question" && (
              <FormControl fullWidth sx={{ marginBottom: 1 }}>
                <InputLabel>Correct Answer</InputLabel>
                <Select
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                  label="Correct Answer"
                >
                  {question.options.map((option, oIndex) => (
                    <MenuItem key={oIndex} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <Button onClick={addQuestion} variant="outlined">
            Add Question
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginLeft: 2 }}>
            Save Assessment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateAssessmentPage;
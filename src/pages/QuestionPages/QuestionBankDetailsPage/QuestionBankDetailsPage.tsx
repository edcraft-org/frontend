import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import NavBar from "../../../components/NavBar/Navbar";
import ExportAssessmentsDialog from "../../../components/ExportAssessmentDialog/ExportAssessmentDialog";
import ExportQuestionBankDialog from "../../../components/ExportQuestionBankDialog/ExportQuestionBankDialog";
import QuestionList from "../../../components/QuestionList/QuestionList";
import QuestionDialog from "../../../components/QuestionDialog/QuestionDialog";

interface Question {
  title: string;
  description: string;
}

const QuestionBankDetailsPage: React.FC = () => {
  const { projectId, questionBankId } = useParams<{ projectId: string, questionBankId: string }>();
  // const [questions, setQuestions] = useState<Question[]>([
  const [questions] = useState<Question[]>([
    { title: "Question 1", description: "This is a short description of question 1." },
    { title: "Question 2", description: "This is a short description of question 2." },
    { title: "Question 3", description: "This is a short description of question 3." },
    { title: "Question 4", description: "This is a short description of question 4." },
  ]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [exportAssessmentDialogOpen, setExportAssessmentDialogOpen] = useState(false);
  const [exportQuestionBankDialogOpen, setExportQuestionBankDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // const [assessments, setAssessments] = useState<string[]>(["Assessment 1", "Assessment 2", "Assessment 3"]);
  const [assessments] = useState<string[]>(["Assessment 1", "Assessment 2", "Assessment 3"]);
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [newAssessment, setNewAssessment] = useState<string>('');

  // const [questionBanks, setQuestionBanks] = useState<string[]>(["Question Bank 2", "Question Bank 3", "Question Bank 4"]);
  const [questionBanks] = useState<string[]>(["Question Bank 2", "Question Bank 3", "Question Bank 4"]);
  const [selectedQuestionBanks, setSelectedQuestionBanks] = useState<string[]>([]);
  const [newQuestionBank, setNewQuestionBank] = useState<string>('');


  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }
  if (!questionBankId) {
    return <div>Error: Question Bank ID is missing</div>;
  }

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.includes(question)
        ? prevSelected.filter((q) => q.title !== question.title)
        : [...prevSelected, question]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions);
    }
    setSelectAll(!selectAll);
  };

  const handleExportAssessmentClick = () => {
    setSelectedAssessments([]);
    setExportAssessmentDialogOpen(true);
  };

  const handleExportQuestionBankClick = () => {
    setExportQuestionBankDialogOpen(true);
  };

  const handleExportAssessmentDialogClose = () => {
    setExportAssessmentDialogOpen(false);
  };

  const handleExportQuestionBankDialogClose = () => {
    setExportQuestionBankDialogOpen(false);
  };

  const handleQuestionClickDialog = (question: Question) => {
    setCurrentQuestion(question);
    setQuestionDialogOpen(true);
  };

  const handleQuestionDialogClose = () => {
    setQuestionDialogOpen(false);
    setCurrentQuestion(null);
  };

  const handleNewAssessmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssessment(event.target.value);
  };

  const handleNewQuestionBankChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestionBank(event.target.value);
  };

  const handleExportAssessment = () => {
    const combinedAssessments = [...selectedAssessments];
    if (newAssessment) {
      combinedAssessments.push(newAssessment);
    }
    alert(`Exporting questions to assessments: ${combinedAssessments.join(', ')}`);
    setExportAssessmentDialogOpen(false);
  };

  const handleExportQuestionBank = () => {
    const combinedQuestionBanks = [...selectedQuestionBanks];
    if (newQuestionBank) {
      combinedQuestionBanks.push(newQuestionBank);
    }
    alert(`Exporting questions to question banks: ${combinedQuestionBanks.join(', ')}`);
    setExportQuestionBankDialogOpen(false);
  };

  const importQuestions = () => {
    alert("Import questions from the question bank");
  };

  const createNewQuestion = () => {
    alert("Create a new question");
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar projectId={projectId} questionBankId={questionBankId} />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleExportAssessmentClick} sx={{ width: '150px', mb: 2 }}>
            Export to assessment
          </Button>
          <Button variant="contained" color="primary" onClick={handleExportQuestionBankClick} sx={{ width: '150px' }}>
            Export to question bank
          </Button>
        </Box>
        <QuestionList
          questions={questions}
          selectedQuestions={selectedQuestions}
          handleQuestionClick={handleQuestionClick}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          onQuestionClick={handleQuestionClickDialog}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button variant="contained" color="primary" onClick={importQuestions} sx={{ marginRight: 2 }}>
            Import Questions
          </Button>
          <Button variant="contained" color="primary" onClick={createNewQuestion}>
            Create New Question
          </Button>
        </Box>
      </Box>

      <QuestionDialog
        open={questionDialogOpen}
        onClose={handleQuestionDialogClose}
        question={currentQuestion}
      />

      <ExportAssessmentsDialog
        open={exportAssessmentDialogOpen}
        onClose={handleExportAssessmentDialogClose}
        selectedQuestions={selectedQuestions}
        assessments={assessments}
        newAssessment={newAssessment}
        handleNewAssessmentChange={handleNewAssessmentChange}
        handleExport={handleExportAssessment}
        setSelectedAssessments={setSelectedAssessments}
      />

      <ExportQuestionBankDialog
        open={exportQuestionBankDialogOpen}
        onClose={handleExportQuestionBankDialogClose}
        selectedQuestions={selectedQuestions}
        questionBanks={questionBanks}
        // selectedQuestionBanks={selectedQuestionBanks}
        newQuestionBank={newQuestionBank}
        handleNewQuestionBankChange={handleNewQuestionBankChange}
        handleExport={handleExportQuestionBank}
        setSelectedQuestionBanks={setSelectedQuestionBanks}
      />
    </Box>
  );
};

export default QuestionBankDetailsPage;
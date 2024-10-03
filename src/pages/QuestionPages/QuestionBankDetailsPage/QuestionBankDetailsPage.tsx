import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import NavBar from "../../../components/NavBar/Navbar";
import ExportAssessmentsDialog from "../../../components/ExportAssessmentDialog/ExportAssessmentDialog";
import ExportQuestionBankDialog from "../../../components/ExportQuestionBankDialog/ExportQuestionBankDialog";
import QuestionList from "../../../components/QuestionList/QuestionList";
import QuestionDialog from "../../../components/QuestionDialog/QuestionDialog";
import { addExistingQuestionToQuestionBank, createQuestionBank, getQuestionBankById, getUserQuestionBanks, NewQuestionBank, QuestionBank, QuestionBankList } from "../../../utils/api/QuestionBankAPI";
import { AuthContext } from "../../../context/Authcontext";
import { Question } from "../../../utils/api/QuestionAPI";
import { addExistingQuestionToAssessment, AssessmentList, createAssessment, getUserAssessments, NewAssessment } from "../../../utils/api/AssessmentAPI";


const QuestionBankDetailsPage: React.FC = () => {
  const { projectId, questionBankId } = useParams<{ projectId: string, questionBankId: string }>();
  const [questionBankDetails, setQuestionBankDetails] = useState<QuestionBank | null>(null);
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [exportAssessmentDialogOpen, setExportAssessmentDialogOpen] = useState(false);
  const [exportQuestionBankDialogOpen, setExportQuestionBankDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const [assessments, setAssessments] = useState<AssessmentList[]>([]);
  const [selectedAssessments, setSelectedAssessments] = useState<AssessmentList[]>([]);
  const [newAssessmentTitle, setNewAssessmentTitle] = useState<string>('');

  const [questionBanks, setQuestionBanks] = useState<QuestionBankList[]>([]);
  const [selectedQuestionBanks, setSelectedQuestionBanks] = useState<QuestionBankList[]>([]);
  const [newQuestionBankTitle, setNewQuestionBankTitle] = useState<string>('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionBankQuestions = async () => {
      if (questionBankId) {
        const questionBank = await getQuestionBankById(questionBankId);
        setQuestionBankDetails(questionBank);
        setQuestions(questionBank.questions);
      }
    };
    fetchQuestionBankQuestions();
  }, [questionBankId]);

  useEffect(() => {
    const fetchAssessmentList = async () => {
      if (user) {
        const userAssessments = await getUserAssessments(user.id);
        setAssessments(userAssessments);
      }
    };
    fetchAssessmentList();
  }, [user]);

  useEffect(() => {
    const fetchQuestionBanksList = async () => {
      if (user) {
        const userQuestionBanks = await getUserQuestionBanks(user.id);
        setQuestionBanks(userQuestionBanks);
      }
    };
    fetchQuestionBanksList();
  }, [user]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }
  if (!questionBankId) {
    return <div>Error: Question Bank ID is missing</div>;
  }
  if (!user) {
    return <div>Error: User is missing</div>;
  }

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.some((q) => q._id === question._id)
        ? prevSelected.filter((q) => q._id !== question._id)
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
    setSelectedAssessments([]);
    setSelectedQuestions([]);
    setExportAssessmentDialogOpen(false);
  };

  const handleExportQuestionBankDialogClose = () => {
    setSelectedAssessments([]);
    setSelectedQuestions([]);
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
    setNewAssessmentTitle(event.target.value);
  };

  const handleNewQuestionBankChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestionBankTitle(event.target.value);
  };

  const handleExportAssessment = async () => {
    const combinedAssessments = [...selectedAssessments];
    if (newAssessmentTitle) {
      const newAssessment: NewAssessment = {
        title: newAssessmentTitle,
        questions: [],
        user_id: user.id
      };
      const newAssessmentId = await createAssessment(newAssessment);
      console.log(newAssessmentId)
      combinedAssessments.push({...newAssessment, _id: newAssessmentId});
    }
    try {
      for (const assessment of combinedAssessments) {
        for (const question of selectedQuestions) {
          await addExistingQuestionToAssessment(assessment._id, question._id);
        }
      }
      alert(`Exporting questions to assessments: ${combinedAssessments.map(a => a.title).join(', ')}`);
    } catch (error) {
      console.error("Error adding questions to assessments:", error);
      alert("An error occurred while exporting questions to assessments.");
    }

    setExportAssessmentDialogOpen(false);
  };

  const handleExportQuestionBank = async () => {
    const combinedQuestionBanks = [...selectedQuestionBanks];
    if (newQuestionBankTitle) {
      const newQuestionBank: NewQuestionBank = {
        title: newQuestionBankTitle,
        questions: [],
        user_id: user.id
      };
      const newQuestionBankId = await createQuestionBank(newQuestionBank);
      combinedQuestionBanks.push({...newQuestionBank, _id: newQuestionBankId});
    }
    try {
      for (const assessment of combinedQuestionBanks) {
        for (const question of selectedQuestions) {
          await addExistingQuestionToQuestionBank(assessment._id, question._id);
        }
      }
      alert(`Exporting questions to assessments: ${combinedQuestionBanks.map(a => a.title).join(', ')}`);
    } catch (error) {
      console.error("Error adding questions to assessments:", error);
      alert("An error occurred while exporting questions to assessments.");
    }
    setExportQuestionBankDialogOpen(false);
  };

  const importQuestions = () => {
    alert("Import questions from the question bank");
  };

  const createNewQuestion = () => {
     // Logic to create a new question
     navigate(`/projects/${projectId}/createQuestion`, {
      state: { questionBankId, questionBankTitle: questionBankDetails?.title },
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar projectId={projectId} questionBank={questionBankDetails ? { id: questionBankId, title: questionBankDetails.title } : undefined} />
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
        newAssessmentTitle={newAssessmentTitle}
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
        newQuestionBankTitle={newQuestionBankTitle}
        handleNewQuestionBankChange={handleNewQuestionBankChange}
        handleExport={handleExportQuestionBank}
        setSelectedQuestionBanks={setSelectedQuestionBanks}
      />
    </Box>
  );
};

export default QuestionBankDetailsPage;
import { Box, Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import NavBar from "../../../components/NavBar/Navbar";
import ExportAssessmentsDialog from "../../../components/Dialogs/ExportAssessmentDialog/ExportAssessmentDialog";
import ExportQuestionBankDialog from "../../../components/Dialogs/ExportQuestionBankDialog/ExportQuestionBankDialog";
import QuestionList from "../../../components/QuestionList/QuestionList";
import QuestionDialog from "../../../components/QuestionDialog/QuestionDialog";
import { addExistingQuestionToQuestionBank, createQuestionBank, getQuestionBankById, getUserProjectQuestionBanks, NewQuestionBank, QuestionBank, QuestionBankWithQuestions, removeQuestionFromQuestionBank } from "../../../utils/api/QuestionBankAPI";
import { AuthContext } from "../../../context/Authcontext";
import { Question } from "../../../utils/api/QuestionAPI";
import { addExistingQuestionToAssessment, AssessmentList, createAssessment, getUserProjectAssessments, NewAssessment } from "../../../utils/api/AssessmentAPI";


const QuestionBankDetailsPage: React.FC = () => {
  const { projectId, questionBankId } = useParams<{ projectId: string, questionBankId: string }>();
  const [questionBankDetails, setQuestionBankDetails] = useState<QuestionBankWithQuestions | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [exportAssessmentDialogOpen, setExportAssessmentDialogOpen] = useState(false);
  const [exportQuestionBankDialogOpen, setExportQuestionBankDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<{ question: Question | null, index: number | null }>({ question: null, index: null });
  const [assessments, setAssessments] = useState<AssessmentList[]>([]);
  const [selectedAssessments, setSelectedAssessments] = useState<AssessmentList[]>([]);
  const [newAssessmentTitle, setNewAssessmentTitle] = useState<string>('');

  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [selectedQuestionBanks, setSelectedQuestionBanks] = useState<QuestionBank[]>([]);
  const [newQuestionBankTitle, setNewQuestionBankTitle] = useState<string>('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectTitle } = location.state || {};

  const fetchQuestionBankQuestions = async () => {
    if (questionBankId) {
      const questionBank = await getQuestionBankById(questionBankId);
      setQuestionBankDetails(questionBank)
    }
  };

  useEffect(() => {
    fetchQuestionBankQuestions();
  }, [questionBankId]);

  useEffect(() => {
    const fetchAssessmentList = async () => {
      if (user && projectId) {
        const userAssessments = await getUserProjectAssessments(user.id, projectId);
        setAssessments(userAssessments);
      }
    };
    fetchAssessmentList();
  }, [user]);

  useEffect(() => {
    const fetchQuestionBanksList = async () => {
      if (user && projectId) {
        const userQuestionBanks = await getUserProjectQuestionBanks(user.id, projectId);
        setQuestionBanks(userQuestionBanks);
      }
    };
    fetchQuestionBanksList();
  }, [user, projectId]);

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
      setSelectedQuestions(questionBankDetails?.full_questions || []);
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

  const handleQuestionClickDialog = (question: Question, index: number) => {
    setCurrentQuestion({ question, index });
    setQuestionDialogOpen(true);
  };

  const handleQuestionDialogClose = () => {
    setQuestionDialogOpen(false);
    setCurrentQuestion({question: null, index: null});
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
        user_id: user.id,
        project_id: projectId
      };
      const newAssessmentCreated = await createAssessment(newAssessment);
      combinedAssessments.push({...newAssessment, _id: newAssessmentCreated._id});
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
        user_id: user.id,
        project_id: projectId
      };
      const newQuestionBankCreated = await createQuestionBank(newQuestionBank);
      combinedQuestionBanks.push({...newQuestionBank, _id: newQuestionBankCreated._id});
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

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      await removeQuestionFromQuestionBank(questionBankId, questionId);
      fetchQuestionBankQuestions();
    } catch (error) {
      console.error('Failed to remove question:', error);
    }
  };

  // const importQuestions = () => {
  //   alert("Import questions from the question bank");
  // };

  const createNewQuestion = () => {
     // Logic to create a new question
     navigate(`/projects/${projectId}/createQuestion`, {
      state: { questionBankId, questionBankTitle: questionBankDetails?.title, projectTitle },
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar project={{id: projectId, title: projectTitle}} questionBank={questionBankDetails ? { id: questionBankId, title: questionBankDetails.title } : undefined} />
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
          questions={questionBankDetails?.full_questions || []}
          selectedQuestions={selectedQuestions}
          handleQuestionClick={handleQuestionClick}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          onQuestionClick={handleQuestionClickDialog}
          handleRemoveQuestion={handleRemoveQuestion}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          {/* <Button variant="contained" color="primary" onClick={importQuestions} sx={{ marginRight: 2 }}>
            Import Questions
          </Button> */}
          <Button variant="contained" color="primary" onClick={createNewQuestion}>
            Create New Question
          </Button>
        </Box>
      </Box>

      <QuestionDialog
        open={questionDialogOpen}
        onClose={handleQuestionDialogClose}
        question={currentQuestion.question}
        questionNumber={currentQuestion.index}
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
        currentQuestionBankId={questionBankId}
        newQuestionBankTitle={newQuestionBankTitle}
        handleNewQuestionBankChange={handleNewQuestionBankChange}
        handleExport={handleExportQuestionBank}
        setSelectedQuestionBanks={setSelectedQuestionBanks}
      />
    </Box>
  );
};

export default QuestionBankDetailsPage;
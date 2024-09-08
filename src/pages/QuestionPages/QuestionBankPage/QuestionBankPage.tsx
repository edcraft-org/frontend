import { Box, Grid, Button, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../../components/NavBar/Navbar";
import { getUserQuestionBanks, createQuestionBank, QuestionBankList } from "../../../utils/api/QuestionBankAPI";
import { AuthContext } from "../../../context/Authcontext";

const QuestionBankPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [questionBanks, setQuestionBanks] = useState<QuestionBankList[]>([]);
  const [newQuestionBankTitle, setNewQuestionBankTitle] = useState<string>("");
  const [view, setView] = useState<'assessment' | 'questionBank'>('questionBank');
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (view === 'assessment') {
      navigate(`/projects/${projectId}/assessments`);
    }
  }, [view, navigate, projectId]);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      if (user) {
        const userQuestionBanks = await getUserQuestionBanks(user.id);
        setQuestionBanks(userQuestionBanks);
      }
    };
    fetchQuestionBanks();
  }, [user]);

  if (!projectId) {
    return <div>Error: Project ID is missing</div>;
  }
  if (!user) {
    return <div>Error: User is missing</div>;
  }

  const addQuestionBank = async () => {
    if (newQuestionBankTitle.trim() !== "" && !questionBanks.some(qb => qb.title === newQuestionBankTitle.trim())) {
      const newQuestionBankData = {
        title: newQuestionBankTitle,
        questions: [],
        user_id: user.id,
      };
      const questionBankId = await createQuestionBank(newQuestionBankData);
      setQuestionBanks([...questionBanks, {...newQuestionBankData, _id: questionBankId}]);
      setNewQuestionBankTitle("");
      // navigate(`/projects/${projectId}/createQuestionBank/${newQuestionBank}`);
    } else {
      alert("Question Bank already exists or input is empty.");
    }
  };

  const handleQuestionBankClick = (questionBank: string) => {
    navigate(`/projects/${projectId}/questionBanks/${questionBank}`);
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'assessment' | 'questionBank') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <NavBar projectId={projectId} />
      <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
            <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view selection"
            >
                <ToggleButton value="assessment" aria-label="assessment">
                Assessment
                </ToggleButton>
                <ToggleButton value="questionBank" aria-label="question bank">
                Question Bank
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {questionBanks.map((questionBank, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleQuestionBankClick(questionBank._id)}
              >
                {questionBank.title}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                border: '1px dashed #ccc',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ width: '80%' }}>
                <TextField
                  value={newQuestionBankTitle}
                  onChange={(e) => setNewQuestionBankTitle(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button onClick={addQuestionBank} variant="outlined" fullWidth>
                  Create new Question Bank
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default QuestionBankPage;
import { Box, Grid, Button, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../../components/NavBar/Navbar";

const CollectionDetailsPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();

  const [quizes, setQuizes] = useState<string[]>(["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4"]);
  const [newQuiz, setNewQuiz] = useState<string>("");
  const navigate = useNavigate();

  if (!collectionId) {
    return <div>Error: Collection ID is missing</div>;
  }

  const addQuiz = () => {
    if (newQuiz.trim() !== "" && !quizes.includes(newQuiz)) {
      setQuizes([...quizes, newQuiz]);
      setNewQuiz("");
      navigate(`/collection/${collectionId}/createQuiz/${newQuiz}`);
    } else {
      alert("Quiz already exists or input is empty.");
    }
  };

  const handleQuizClick = (quiz: string) => {
    navigate(`/collection/${collectionId}/quiz/${quiz}`);
  };

  return (
    <Box sx={{ width: '100%'}}>
        <NavBar collectionId = {collectionId}/>
        <Box sx={{ marginTop: '64px', padding: 2 }}>
        <Grid container spacing={2} sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {quizes.map((quiz, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  height: '150px', // Fixed height for consistency
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleQuizClick(quiz)}
              >
                {quiz}
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
                height: '150px', // Fixed height for consistency
                flexDirection: 'column',
              }}
            >
              <Box sx={{ width: '80%' }}>
                <TextField
                  value={newQuiz}
                  onChange={(e) => setNewQuiz(e.target.value)}
                  variant="outlined"
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button onClick={addQuiz} variant="outlined" fullWidth>
                  Create new quiz
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        </Box>
    </Box>
  );
};

export default CollectionDetailsPage;

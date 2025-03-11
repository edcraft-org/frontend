import type React from "react"

import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from "@mui/material"
import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"

import NavBar from "../../../components/NavBar/Navbar"
import QuestionGroupPage from "../../QuestionPages/QuestionGroupPage/QuestionGroupPage"
import { AuthContext } from "../../../context/Authcontext"
import { getAssessmentById, removeQuestionFromAssessment } from "../../../utils/api/AssessmentAPI"
import type { Question } from "../../../utils/api/QuestionAPI"
import { generateRTF } from "../../../utils/export/rtf"
import { generateWordDoc } from "../../../utils/export/word"

interface AssessmentDetails {
  title: string
  questions: Question[]
}

const AssessmentDetailsPage: React.FC = () => {
  const { projectId, assessmentId } = useParams<{ projectId: string; assessmentId: string }>()
  const [assessmentDetails, setAssessmentDetails] = useState<AssessmentDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const { projectTitle } = location.state || {}
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    const fetchAssessmentQuestions = async () => {
      if (assessmentId) {
        setLoading(true)
        try {
          const assessmentQuestions = await getAssessmentById(assessmentId)
          setAssessmentDetails(assessmentQuestions)
        } catch (error) {
          console.error("Failed to fetch assessment details:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchAssessmentQuestions()
  }, [assessmentId, location.state])

  if (!projectId) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: Project ID is missing
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/projects")} startIcon={<ArrowBackIcon />}>
          Back to Projects
        </Button>
      </Container>
    )
  }

  if (!assessmentId) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: Assessment ID is missing
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/projects/${projectId}/assessments`)}
          startIcon={<ArrowBackIcon />}
        >
          Back to Assessments
        </Button>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: User authentication required
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Container>
    )
  }

  const createNewQuestion = () => {
    navigate(`/projects/${projectId}/createQuestion`, {
      state: { assessmentId, assessmentTitle: assessmentDetails?.title, projectTitle },
    })
  }

  const exportAssessmentRTF = () => {
    if (!assessmentDetails) return
    generateRTF(assessmentDetails)
  }

  const exportAssessmentWord = () => {
    if (!assessmentDetails) return
    generateWordDoc(assessmentDetails)
  }

  const handleRemoveQuestion = async (questionId: string) => {
    if (assessmentId) {
      try {
        await removeQuestionFromAssessment(assessmentId, questionId)
        setAssessmentDetails((prevDetails) => {
          if (!prevDetails) return null
          return {
            ...prevDetails,
            questions: prevDetails.questions.filter((q) => q._id !== questionId),
          }
        })
      } catch (error) {
        console.error("Failed to remove question:", error)
      }
    }
  }

  const handleBackToAssessments = () => {
    navigate(`/projects/${projectId}/assessments`, {
      state: { projectTitle },
    })
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <NavBar
        project={{ id: projectId, title: projectTitle }}
        assessment={assessmentDetails ? { id: assessmentId, title: assessmentDetails.title } : undefined}
      />
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              onClick={() => navigate("/")}
            >
              Projects
            </Link>
            <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={handleBackToAssessments}>
              {projectTitle} Assessments
            </Link>
            <Typography color="text.primary">{assessmentDetails?.title || "Assessment Details"}</Typography>
          </Breadcrumbs>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              borderTop: "8px solid",
              borderColor: "primary.main",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {assessmentDetails ? assessmentDetails.title : "Loading..."}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={`${assessmentDetails?.questions.length || 0} Questions`}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportAssessmentRTF}
                  sx={{
                    height: "48px",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Export as RTF
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportAssessmentWord}
                  sx={{
                    height: "48px",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Export as Word Doc
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={createNewQuestion}
                  sx={{
                    height: "48px",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Add Question
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        {loading ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.primary">
              Loading assessment questions...
            </Typography>
          </Paper>
        ) : assessmentDetails?.questions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
              This assessment doesn't have any questions yet
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={createNewQuestion}>
              Create Your First Question
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {assessmentDetails?.questions.map((question, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      // borderLeft: "8px solid",
                      // borderColor: "primary.main",
                      height: "100%",
                    }}
                  >
                    <QuestionGroupPage questionNumber={index + 1} question={question} onRemove={handleRemoveQuestion} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {assessmentDetails && assessmentDetails.questions.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={createNewQuestion}
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Add Another Question
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default AssessmentDetailsPage

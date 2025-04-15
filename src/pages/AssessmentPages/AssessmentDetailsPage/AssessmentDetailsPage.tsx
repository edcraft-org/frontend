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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import DescriptionIcon from "@mui/icons-material/Description"
import TextSnippetIcon from "@mui/icons-material/TextSnippet"
import AutomateIcon from "@mui/icons-material/AutoFixHigh"
import EditIcon from "@mui/icons-material/Edit"

import NavBar from "../../../components/NavBar/Navbar"
import QuestionGroupPage from "../../QuestionPages/QuestionGroupPage/QuestionGroupPage"
import { AuthContext } from "../../../context/Authcontext"
import { getAssessmentById, removeQuestionFromAssessment } from "../../../utils/api/AssessmentAPI"
import type { Question } from "../../../utils/api/QuestionAPI"
import { generateRTF } from "../../../utils/export/rtf"
import { generateWordDoc } from "../../../utils/export/word"

export interface AssessmentDetails {
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
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null)
  const openExportMenu = Boolean(exportMenuAnchor)
  const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(null)
  const openCreateMenu = Boolean(createMenuAnchor)


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

  const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCreateMenuAnchor(event.currentTarget)
  }

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null)
  }

  const createNewQuestion = (isManual: boolean = false) => {
    navigate(`/projects/${projectId}/createQuestion`, {
      state: {
        assessmentId,
        assessmentTitle: assessmentDetails?.title,
        projectTitle,
        isManual
      },
    })
    handleCreateMenuClose()
  }

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget)
  }

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null)
  }

  const handleExportFormat = (format: "rtf" | "word") => {
    if (!assessmentDetails) return

    if (format === "rtf") {
      generateRTF(assessmentDetails)
    } else {
      generateWordDoc(assessmentDetails)
    }
    handleExportMenuClose()
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

  const handleEditQuestion = (question: Question) => {
    const isManual = question.generated_context === undefined
    navigate(`/projects/${projectId}/editQuestion`, {
      state: {
        assessmentId,
        assessmentTitle: assessmentDetails?.title,
        projectTitle,
        isManual,
        question
      },
    });
  };

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
                  <Chip label={`${assessmentDetails?.questions.length || 0} Questions`} color="primary" size="small" />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FileDownloadIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleExportClick}
                    sx={{
                      height: "48px",
                      width: isMobile ? "100%" : "auto",
                      borderRadius: "8px",
                      fontWeight: "medium",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      },
                    }}
                    aria-controls={openExportMenu ? "export-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openExportMenu ? "true" : undefined}
                  >
                    Export
                  </Button>
                  <Menu
                    id="export-menu"
                    anchorEl={exportMenuAnchor}
                    open={openExportMenu}
                    onClose={handleExportMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "export-button",
                      dense: true,
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => handleExportFormat("rtf")}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <TextSnippetIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>Export as RTF</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleExportFormat("word")}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>Export as Word Doc</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleCreateClick}
                    sx={{
                      height: "48px",
                      width: isMobile ? "100%" : "auto",
                    }}
                    aria-controls={openCreateMenu ? "create-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openCreateMenu ? "true" : undefined}
                  >
                    Add Question
                  </Button>
                  <Menu
                    id="create-menu"
                    anchorEl={createMenuAnchor}
                    open={openCreateMenu}
                    onClose={handleCreateMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "create-button",
                      dense: true,
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => createNewQuestion(false)}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AutomateIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>Generate Question</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => createNewQuestion(true)}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <EditIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>Manual Creation</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
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
                    <QuestionGroupPage questionNumber={index + 1} question={question} onEdit={handleEditQuestion} onRemove={handleRemoveQuestion} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default AssessmentDetailsPage

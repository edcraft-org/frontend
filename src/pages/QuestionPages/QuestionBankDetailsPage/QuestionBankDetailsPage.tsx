"use client"

import type React from "react"

import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Chip,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Menu,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import AutomateIcon from "@mui/icons-material/AutoFixHigh"
import EditIcon from "@mui/icons-material/Edit"

import NavBar from "../../../components/NavBar/Navbar"
import ExportAssessmentsDialog from "../../../components/Dialogs/ExportAssessmentDialog/ExportAssessmentDialog"
import ExportQuestionBankDialog from "../../../components/Dialogs/ExportQuestionBankDialog/ExportQuestionBankDialog"
import QuestionList from "../../../components/QuestionList/QuestionList"
import QuestionDialog from "../../../components/QuestionDialog/QuestionDialog"
import {
  addExistingQuestionToQuestionBank,
  createQuestionBank,
  getQuestionBankById,
  getUserProjectQuestionBanks,
  type NewQuestionBank,
  type QuestionBank,
  type QuestionBankWithQuestions,
  removeQuestionFromQuestionBank,
} from "../../../utils/api/QuestionBankAPI"
import { AuthContext } from "../../../context/Authcontext"
import type { Question } from "../../../utils/api/QuestionAPI"
import {
  addExistingQuestionToAssessment,
  type AssessmentList,
  createAssessment,
  getUserProjectAssessments,
  type NewAssessment,
} from "../../../utils/api/AssessmentAPI"

const QuestionBankDetailsPage: React.FC = () => {
  const { projectId, questionBankId } = useParams<{ projectId: string; questionBankId: string }>()
  const [questionBankDetails, setQuestionBankDetails] = useState<QuestionBankWithQuestions | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)

  const [createMenuAnchor, setCreateMenuAnchor] = useState<null | HTMLElement>(null)
  const openCreateMenu = Boolean(createMenuAnchor)
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(exportMenuAnchor);

  const [exportAssessmentDialogOpen, setExportAssessmentDialogOpen] = useState(false)
  const [exportQuestionBankDialogOpen, setExportQuestionBankDialogOpen] = useState(false)
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)

  const [currentQuestion, setCurrentQuestion] = useState<{ question: Question | null; index: number | null }>({
    question: null,
    index: null,
  })
  const [assessments, setAssessments] = useState<AssessmentList[]>([])
  const [selectedAssessments, setSelectedAssessments] = useState<AssessmentList[]>([])
  const [newAssessmentTitle, setNewAssessmentTitle] = useState<string>("")

  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [selectedQuestionBanks, setSelectedQuestionBanks] = useState<QuestionBank[]>([])
  const [newQuestionBankTitle, setNewQuestionBankTitle] = useState<string>("")

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const { projectTitle } = location.state || {}
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const fetchQuestionBankQuestions = async () => {
    if (questionBankId) {
      setLoading(true)
      try {
        const questionBank = await getQuestionBankById(questionBankId)
        setQuestionBankDetails(questionBank)
      } catch (error) {
        console.error("Failed to fetch question bank details:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchQuestionBankQuestions()
  }, [questionBankId])

  useEffect(() => {
    const fetchAssessmentList = async () => {
      if (user && projectId) {
        const userAssessments = await getUserProjectAssessments(user.id, projectId)
        setAssessments(userAssessments)
      }
    }
    fetchAssessmentList()
  }, [user, projectId])

  useEffect(() => {
    const fetchQuestionBanksList = async () => {
      if (user && projectId) {
        const userQuestionBanks = await getUserProjectQuestionBanks(user.id, projectId)
        setQuestionBanks(userQuestionBanks)
      }
    }
    fetchQuestionBanksList()
  }, [user, projectId])

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

  if (!questionBankId) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: Question Bank ID is missing
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/projects/${projectId}/questionBanks`)}
          startIcon={<ArrowBackIcon />}
        >
          Back to Question Banks
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

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.some((q) => q._id === question._id)
        ? prevSelected.filter((q) => q._id !== question._id)
        : [...prevSelected, question],
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([])
    } else {
      setSelectedQuestions(questionBankDetails?.full_questions || [])
    }
    setSelectAll(!selectAll)
  }

  const handleExportAssessmentClick = () => {
    setSelectedAssessments([])
    setExportAssessmentDialogOpen(true)
  }

  const handleExportQuestionBankClick = () => {
    setExportQuestionBankDialogOpen(true)
  }

  const handleExportAssessmentDialogClose = () => {
    setSelectedAssessments([])
    setSelectedQuestions([])
    setExportAssessmentDialogOpen(false)
  }

  const handleExportQuestionBankDialogClose = () => {
    setSelectedAssessments([])
    setSelectedQuestions([])
    setExportQuestionBankDialogOpen(false)
  }

  const handleQuestionClickDialog = (question: Question, index: number) => {
    setCurrentQuestion({ question, index })
    setQuestionDialogOpen(true)
  }

  const handleQuestionDialogClose = () => {
    setQuestionDialogOpen(false)
    setCurrentQuestion({ question: null, index: null })
  }

  const handleNewAssessmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAssessmentTitle(event.target.value)
  }

  const handleNewQuestionBankChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestionBankTitle(event.target.value)
  }

  const handleCreateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCreateMenuAnchor(event.currentTarget)
  }

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null)
  }

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportAssessment = async () => {
    const combinedAssessments = [...selectedAssessments]
    if (newAssessmentTitle) {
      const newAssessment: NewAssessment = {
        title: newAssessmentTitle,
        questions: [],
        user_id: user.id,
        project_id: projectId,
      }
      const newAssessmentCreated = await createAssessment(newAssessment)
      combinedAssessments.push({ ...newAssessment, _id: newAssessmentCreated._id })
    }
    try {
      for (const assessment of combinedAssessments) {
        for (const question of selectedQuestions) {
          await addExistingQuestionToAssessment(assessment._id, question._id)
        }
      }
      alert(`Exporting questions to assessments: ${combinedAssessments.map((a) => a.title).join(", ")}`)
    } catch (error) {
      console.error("Error adding questions to assessments:", error)
      alert("An error occurred while exporting questions to assessments.")
    }

    setExportAssessmentDialogOpen(false)
  }

  const handleExportQuestionBank = async () => {
    const combinedQuestionBanks = [...selectedQuestionBanks]
    if (newQuestionBankTitle) {
      const newQuestionBank: NewQuestionBank = {
        title: newQuestionBankTitle,
        questions: [],
        user_id: user.id,
        project_id: projectId,
      }
      const newQuestionBankCreated = await createQuestionBank(newQuestionBank)
      combinedQuestionBanks.push({ ...newQuestionBank, _id: newQuestionBankCreated._id })
    }
    try {
      for (const assessment of combinedQuestionBanks) {
        for (const question of selectedQuestions) {
          await addExistingQuestionToQuestionBank(assessment._id, question._id)
        }
      }
      alert(`Exporting questions to question banks: ${combinedQuestionBanks.map((a) => a.title).join(", ")}`)
    } catch (error) {
      console.error("Error adding questions to question banks:", error)
      alert("An error occurred while exporting questions to question banks.")
    }
    setExportQuestionBankDialogOpen(false)
  }

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      await removeQuestionFromQuestionBank(questionBankId, questionId)
      fetchQuestionBankQuestions()
    } catch (error) {
      console.error("Failed to remove question:", error)
    }
  }

  const createNewQuestion = (isManual: boolean = false) => {
    navigate(`/projects/${projectId}/createQuestion`, {
      state: {
        questionBankId,
        questionBankTitle: questionBankDetails?.title,
        projectTitle,
        isManual
      },
    })
    handleCreateMenuClose()
  }


  const handleBackToQuestionBanks = () => {
    navigate(`/projects/${projectId}/questionBanks`, {
      state: { projectTitle },
    })
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <NavBar
        project={{ id: projectId, title: projectTitle }}
        questionBank={questionBankDetails ? { id: questionBankId, title: questionBankDetails.title } : undefined}
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
            <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={handleBackToQuestionBanks}>
              {projectTitle} Question Banks
            </Link>
            <Typography color="text.secondary">{questionBankDetails?.title || "Question Bank Details"}</Typography>
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
                  {questionBankDetails ? questionBankDetails.title : "Loading..."}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={`${questionBankDetails?.full_questions?.length || 0} Questions`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={`${selectedQuestions.length} Selected`}
                    color={selectedQuestions.length > 0 ? "primary" : "default"}
                    size="small"
                    sx={{ display: selectedQuestions.length > 0 ? "flex" : "none" }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  width: isMobile ? "100%" : "auto",
                  justifyContent: isMobile ? "space-between" : "flex-end",
                }}
              >
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FileUploadIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleExportClick}
                    disabled={selectedQuestions.length === 0}
                    sx={{
                      height: "48px",
                      width: isMobile ? "100%" : "auto",
                    }}
                    aria-controls={openExportMenu ? "export-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openExportMenu ? "true" : undefined}
                  >
                    Export To
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
                      onClick={() => {
                        handleExportAssessmentClick();
                        handleExportMenuClose();
                      }}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <FileUploadIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>To Assessment</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleExportQuestionBankClick();
                        handleExportMenuClose();
                      }}
                      sx={{
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <FileUploadIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText>To Question Bank</ListItemText>
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
                      mt: isMobile ? 1 : 0,
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
            <Typography variant="h6" color="text.secondary">
              Loading question bank...
            </Typography>
          </Paper>
        ) : questionBankDetails?.full_questions?.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              This question bank doesn't have any questions yet
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
            }}
          >
            <style>
              {`
                .question-list-container table {
                  width: 100%;
                  table-layout: fixed;
                  border-collapse: separate;
                  border-spacing: 0;
                }
                .question-list-container th,
                .question-list-container td {
                  padding: 12px;
                  text-align: left;
                  vertical-align: top;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                .question-list-container th:first-child,
                .question-list-container td:first-child {
                  width: 50px;
                }
                .question-list-container th:nth-child(2),
                .question-list-container td:nth-child(2) {
                  width: 60%;
                }
                .question-list-container th:last-child,
                .question-list-container td:last-child {
                  width: 100px;
                  text-align: right;
                }
              `}
            </style>

              <QuestionList
                questions={questionBankDetails?.full_questions || []}
                selectedQuestions={selectedQuestions}
                handleQuestionClick={handleQuestionClick}
                selectAll={selectAll}
                handleSelectAll={handleSelectAll}
                onQuestionClick={handleQuestionClickDialog}
                handleRemoveQuestion={handleRemoveQuestion}
              />
          </Paper>
        )}

        {questionBankDetails && questionBankDetails?.full_questions?.length > 0 && selectedQuestions.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileUploadIcon />}
              onClick={handleExportAssessmentClick}
              sx={{ px: 3, py: 1 }}
            >
              Export to Assessment
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileUploadIcon />}
              onClick={handleExportQuestionBankClick}
              sx={{ px: 3, py: 1 }}
            >
              Export to Question Bank
            </Button>
          </Box>
        )}
      </Container>

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
  )
}

export default QuestionBankDetailsPage


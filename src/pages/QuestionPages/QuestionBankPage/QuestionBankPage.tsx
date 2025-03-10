import type React from "react"

import {
  Box,
  Grid,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Typography,
  Paper,
  Container,
  Fade,
  Grow,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material"
import { useLocation, useParams } from "react-router-dom"
import { useState, useEffect, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import QuizIcon from "@mui/icons-material/Quiz"
import SearchIcon from "@mui/icons-material/Search"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import NavBar from "../../../components/NavBar/Navbar"
import {
  getUserProjectQuestionBanks,
  createQuestionBank,
  renameQuestionBankTitle,
  deleteQuestionBank,
  type QuestionBank,
} from "../../../utils/api/QuestionBankAPI"
import { AuthContext } from "../../../context/Authcontext"
import EditDialog from "../../../components/Dialogs/EditDialog/EditDialog"
import DeleteDialog from "../../../components/Dialogs/DeleteDialog/DeleteDialog"

const QuestionBankPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([])
  const [filteredQuestionBanks, setFilteredQuestionBanks] = useState<QuestionBank[]>([])
  const [newQuestionBankTitle, setNewQuestionBankTitle] = useState<string>("")
  const [editQuestionBank, setEditQuestionBank] = useState<QuestionBank | null>(null)
  const [editTitle, setEditTitle] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [questionBankToDelete, setQuestionBankToDelete] = useState<QuestionBank | null>(null)
  const [view, setView] = useState<"assessment" | "questionBank">("questionBank")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const { projectTitle } = location.state || {}
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (view === "assessment") {
      navigate(`/projects/${projectId}/assessments`, {
        state: { projectTitle },
      })
    }
  }, [view, navigate, projectId, projectTitle])

  const fetchQuestionBanks = useCallback(async () => {
    if (user && projectId) {
      const userQuestionBanks = await getUserProjectQuestionBanks(user.id, projectId)
      setQuestionBanks(userQuestionBanks)
      setFilteredQuestionBanks(userQuestionBanks)
    }
  }, [user, projectId])

  useEffect(() => {
    fetchQuestionBanks()
  }, [fetchQuestionBanks])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredQuestionBanks(questionBanks)
    } else {
      setFilteredQuestionBanks(
        questionBanks.filter((bank) => bank.title.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
  }, [searchTerm, questionBanks])

  if (!projectId) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Error: Project ID is missing
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
          Back to Projects
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

  const addQuestionBank = async () => {
    if (newQuestionBankTitle.trim() !== "" && !questionBanks.some((qb) => qb.title === newQuestionBankTitle.trim())) {
      const newQuestionBankData = {
        title: newQuestionBankTitle,
        questions: [],
        user_id: user.id,
        project_id: projectId,
      }
      await createQuestionBank(newQuestionBankData)
      fetchQuestionBanks()
      setNewQuestionBankTitle("")
      setIsAddingNew(false)
    } else {
      alert("Question Bank already exists or input is empty.")
    }
  }

  const handleQuestionBankClick = (questionBank: QuestionBank) => {
    navigate(`/projects/${projectId}/questionBanks/${questionBank._id}`, {
      state: { projectTitle },
    })
  }

  const handleEditClick = (questionBank: QuestionBank, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditQuestionBank(questionBank)
    setEditTitle(questionBank.title)
    setDialogOpen(true)
  }

  const handleDeleteClick = (questionBank: QuestionBank, event: React.MouseEvent) => {
    event.stopPropagation()
    setQuestionBankToDelete(questionBank)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (questionBankToDelete) {
      await deleteQuestionBank(questionBankToDelete._id)
      fetchQuestionBanks()
      setDeleteDialogOpen(false)
      setQuestionBankToDelete(null)
    }
  }

  const handleEditSave = async () => {
    if (editQuestionBank && editTitle.trim() !== "") {
      await renameQuestionBankTitle(editQuestionBank._id, { title: editTitle })
      fetchQuestionBanks()
      setDialogOpen(false)
      setEditQuestionBank(null)
      setEditTitle("")
    } else {
      alert("Title cannot be empty.")
    }
  }

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: "assessment" | "questionBank") => {
    if (newView !== null) {
      setView(newView)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addQuestionBank()
    }
  }

  const handleBackToProjects = () => {
    navigate("/")
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <NavBar project={{ id: projectId, title: projectTitle }} isProjectQuestionBank={view === "questionBank"} />
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToProjects}
              sx={{ mr: 2, color: "text.primary" }}
            >
              Projects
            </Button>
          </Box>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view selection"
            sx={{
              bgcolor: "white",
              boxShadow: 1,
              width: isMobile ? "100%" : "auto",
              "& .MuiToggleButton-root": {
                px: 3,
                py: 1,
                fontWeight: "medium",
              },
            }}
          >
            <ToggleButton value="assessment" aria-label="assessment">
              Assessment
            </ToggleButton>
            <ToggleButton value="questionBank" aria-label="question bank">
              Question Bank
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {projectTitle}: Question Banks
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage reusable question banks for this project
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexGrow: 1,
                width: isMobile ? "100%" : "auto",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <TextField
                placeholder="Search question banks..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddingNew(true)}
                sx={{
                  minWidth: isMobile ? "100%" : "220px",
                  height: "56px",
                  boxShadow: 2,
                }}
              >
                New Question Bank
              </Button>
            </Box>
          </Box>
        </Box>
        <Grid container spacing={3}>
          {filteredQuestionBanks.map((questionBank, index) => (
            <Grid item xs={12} sm={6} md={4} key={questionBank._id || index}>
              <Grow in={true} timeout={(index + 1) * 200}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: "180px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                      "& .questionbank-actions": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleQuestionBankClick(questionBank)}
                >
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        height: "8px",
                        width: "100%",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        flexGrow: 1,
                      }}
                    >
                      <QuizIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography
                          variant="h6"
                          fontWeight="medium"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {questionBank.title}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {questionBank.questions?.length || 0} questions
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className="questionbank-actions"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1.5,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                        opacity: { xs: 1, md: 0 },
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      <Tooltip title="Edit question bank">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEditClick(questionBank, e)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete question bank">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(questionBank, e)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grow>
            </Grid>
          ))}

          {isAddingNew && (
            <Grid item xs={12} sm={6} md={4}>
              <Fade in={true}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    height: "180px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    border: "2px dashed",
                    borderColor: "success.light",
                    bgcolor: "rgba(76, 175, 80, 0.04)",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Create New Question Bank
                  </Typography>
                  <TextField
                    autoFocus
                    value={newQuestionBankTitle}
                    onChange={(e) => setNewQuestionBankTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter question bank name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={addQuestionBank}
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!newQuestionBankTitle.trim()}
                    >
                      Create
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingNew(false)
                        setNewQuestionBankTitle("")
                      }}
                      variant="outlined"
                      color="primary"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          )}

          {filteredQuestionBanks.length === 0 && !isAddingNew && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm ? "No question banks match your search" : "You don't have any question banks yet"}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddingNew(true)}
                  >
                    Create Your First Question Bank
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      <EditDialog
        open={dialogOpen}
        title="Question Bank"
        value={editTitle}
        onClose={() => setDialogOpen(false)}
        onSave={handleEditSave}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="question bank"
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
      />
    </Box>
  )
}

export default QuestionBankPage


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
import AssessmentIcon from "@mui/icons-material/Assessment"
import SearchIcon from "@mui/icons-material/Search"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import NavBar from "../../../components/NavBar/Navbar"
import {
  getUserProjectAssessments,
  createAssessment,
  deleteAssessment,
  renameAssessmentTitle,
  type AssessmentList,
} from "../../../utils/api/AssessmentAPI"
import { AuthContext } from "../../../context/Authcontext"
import EditDialog from "../../../components/Dialogs/EditDialog/EditDialog"
import DeleteDialog from "../../../components/Dialogs/DeleteDialog/DeleteDialog"

const AssessmentPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

  const [assessments, setAssessments] = useState<AssessmentList[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentList[]>([])
  const [newAssessment, setNewAssessment] = useState<string>("")
  const [editAssessment, setEditAssessment] = useState<AssessmentList | null>(null)
  const [editTitle, setEditTitle] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [assessmentToDelete, setAssessmentToDelete] = useState<AssessmentList | null>(null)
  const [view, setView] = useState<"assessment" | "questionBank">("assessment")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const { projectTitle } = location.state || {}
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    if (view === "questionBank") {
      navigate(`/projects/${projectId}/questionBanks`, {
        state: { projectTitle },
      })
    }
  }, [view, navigate, projectId, projectTitle])

  const fetchAssessments = useCallback(async () => {
    if (user && projectId) {
      const userAssessments = await getUserProjectAssessments(user.id, projectId)
      setAssessments(userAssessments)
      setFilteredAssessments(userAssessments)
    }
  }, [user, projectId])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAssessments(assessments)
    } else {
      setFilteredAssessments(
        assessments.filter((assessment) => assessment.title.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
  }, [searchTerm, assessments])

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

  const addAssessment = async () => {
    if (newAssessment.trim() !== "" && !assessments.some((assessment) => assessment.title === newAssessment.trim())) {
      const newAssessmentData = {
        title: newAssessment,
        questions: [],
        user_id: user.id,
        project_id: projectId,
      }
      await createAssessment(newAssessmentData)
      fetchAssessments()
      setNewAssessment("")
      setIsAddingNew(false)
    } else {
      alert("Assessment already exists or input is empty.")
    }
  }

  const handleAssessmentClick = (assessment: AssessmentList) => {
    navigate(`/projects/${projectId}/assessments/${assessment._id}`, {
      state: { projectTitle },
    })
  }

  const handleEditClick = (assessment: AssessmentList, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditAssessment(assessment)
    setEditTitle(assessment.title)
    setDialogOpen(true)
  }

  const handleDeleteClick = (assessment: AssessmentList, event: React.MouseEvent) => {
    event.stopPropagation()
    setAssessmentToDelete(assessment)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (assessmentToDelete) {
      await deleteAssessment(assessmentToDelete._id)
      fetchAssessments()
      setDeleteDialogOpen(false)
      setAssessmentToDelete(null)
    }
  }

  const handleEditSave = async () => {
    if (editAssessment && editTitle.trim() !== "") {
      await renameAssessmentTitle(editAssessment._id, { title: editTitle })
      fetchAssessments()
      setDialogOpen(false)
      setEditAssessment(null)
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
      addAssessment()
    }
  }

  const handleBackToProjects = () => {
    navigate("/")
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <NavBar project={{ id: projectId, title: projectTitle }} isProjectAssessment={view === "assessment"} />
      <Container maxWidth="lg" sx={{ pt: 10, pb: 5 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToProjects}
              sx={{ mr: 2, color: "text.secondary" }}
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
            {projectTitle}: Assessments
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Manage assessments for this project
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
                placeholder="Search assessments..."
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
                startIcon={<AddIcon />}
                onClick={() => setIsAddingNew(true)}
                sx={{
                  bgcolor: "primary.main",
                  minWidth: isMobile ? "100%" : "200px",
                  height: "56px",
                  boxShadow: 2,
                }}
              >
                New Assessment
              </Button>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredAssessments.map((assessment, index) => (
            <Grid item xs={12} sm={6} md={4} key={assessment._id || index}>
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
                      "& .assessment-actions": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleAssessmentClick(assessment)}
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
                      <AssessmentIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
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
                          {assessment.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.questions?.length || 0} questions
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className="assessment-actions"
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
                      <Tooltip title="Edit assessment">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEditClick(assessment, e)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete assessment">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(assessment, e)}>
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
                    borderColor: "secondary.light",
                    bgcolor: "rgba(156, 39, 176, 0.04)",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Create New Assessment
                  </Typography>
                  <TextField
                    autoFocus
                    value={newAssessment}
                    onChange={(e) => setNewAssessment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter assessment name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      onClick={addAssessment}
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!newAssessment.trim()}
                    >
                      Create
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingNew(false)
                        setNewAssessment("")
                      }}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            </Grid>
          )}

          {filteredAssessments.length === 0 && !isAddingNew && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {searchTerm ? "No assessments match your search" : "You don't have any assessments yet"}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddingNew(true)}
                  >
                    Create Your First Assessment
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>

      <EditDialog
        open={dialogOpen}
        title="Assessment"
        value={editTitle}
        onClose={() => setDialogOpen(false)}
        onSave={handleEditSave}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="assessment"
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
      />
    </Box>
  )
}

export default AssessmentPage
